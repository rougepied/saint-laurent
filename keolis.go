// Copyright © 2015 Arnaud Malivoir
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See the COPYING file or http://www.wtfpl.net/
// for more details.

package main

import (
	"bytes"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"
)

// const (
// 	keyDefault = "XXXXXXXXXXXXXXX"
// )

// OpenData represents the main struct return by the Keolis-Rennes API.
type OpenData struct {
	// Request is a copy of the request passed to the Keolis-Rennes API
	Request string  `xml:"request" json:"request"`
	Answer  *Answer `xml:"answer" json:"answer"`
}

// Answer is the answer contained in OpenData.
type Answer struct {
	Status Status `xml:"status" json:"status"`
	Data   *Data  `xml:"data" json:"data"`
}

// Status contains the status of the response.
//
//    0    Success
//    1    Invalid key
//    2    Invalid version
//    3    Invalid command
//    4    Empty key
//    5    Empty version
//    6    Empty command
//    8    Usage limit reached
//    98   Disabled
//    99   Maintenance
//    100+ Command error code
//
// see: http://data.keolis-rennes.com/fr/les-donnees/fonctionnement-de-lapi.html
type Status struct {
	Code    int    `xml:"code,attr" json:"code"`
	Message string `xml:"message,attr" json:"status"`
}

// Data of the Answer.
type Data struct {
	Stations      *Stations `xml:"station" json:"station"`
	LocalDateTime string    `xml:"localdatetime,attr" json:"localdatetime"`
	StopLine      *StopLine `xml:"stopline" json:"stopline"`
}

type StopLine struct {
	Stop       string       `xml:"stop" json:"stop"`
	Route      string       `xml:"route" json:"route"`
	Direction  int          `xml:"direction" json:"direction"`
	Departures []*Departure `xml:"departures>departure" json:"departures"`
}

// Departure represente the next bus / metro departure.
type Departure struct {
	Accurate  int    `xml:"accurate,attr" json:"accurate"`
	HeadSign  string `xml:"headsign,attr" json:"headsign"`
	Vehicle   int    `xml:"vehicle,attr" json:"vehicle"`
	Expected  string `xml:"expected,attr" json:"expected"`
	timeValue `xml:",innerxml"`
}

// Stopline of a Departure.
type Stopline struct {
	Stop       string     `xml:"stop"`
	Route      string     `xml:"route"`
	Direction  string     `xml:"direction"`
	Departures Departures `xml:"departures"`
}

type Departures []*Departure

func (d Departures) String() {
	for _, depart := range d {
		fmt.Printf("%#v\n", depart)
	}
}

type Stations []*Station

// Station for a bus or a metro
type Station struct {
	Id             int     `xml:"id" json:"id"`
	Number         int     `xml:"number" json:"number"`
	Name           string  `xml:"name" json:"name"`
	State          int     `xml:"state" json:"state"`
	Latitude       float64 `xml:"latitude" json:"latitude"`
	Longitude      float64 `xml:longitude" json:"longitude"`
	SlotsAvailable int     `xml:"slotsavailable" json:"slotsavailable"`
	BikesAvailable int     `xml:"bikesavailable" json:"bikesavailable"`
	Pos            int     `xml:"pos" json:"pos"`
	District       string  `xml:"district" json:"district"`
	LastUpdate     string  `xml:"lastupdate" json:"lastupdate"`
}

// timeValue is a custom type that contain a time.Time anonymous field.
// It satisfy the xml.Unmarshaler interface so that it can be used to map
// responses from Keolis Rennes API
// See: http://stackoverflow.com/questions/17301149/golang-xml-unmarshal-and-time-time-fields/25015260#25015260
type timeValue struct {
	time.Time
}

func (t *timeValue) UnmarshalXMLAttr(attr xml.Attr) error {
	fmt.Printf("Parsing attribute '%s', with value '%s'\n", attr.Name.Local, attr.Value)
	const shortForm = "2006-Jan-02"
	parse, err := time.Parse(shortForm, "2013-Feb-03")
	if err != nil {
		return nil
	}
	*t = timeValue{parse}
	return nil
}

func (c *timeValue) UnmarshalXML(d *xml.Decoder, start xml.StartElement) error {
	var v string
	err := d.DecodeElement(&v, &start)
	if err != nil {
		return err
	}
	parse, err := time.Parse("2006-01-02T15:04:05-07:00", v)
	if err != nil {
		return err
	}
	*c = timeValue{parse}
	return nil
}

type Schedule struct {
	Time timeValue
	Line string
}

type Schedules []*Schedule

type Response struct {
	Schedules *Schedules
}

func handleApi(key string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// parsing body

		// vars := mux.Vars(r)
		stopID := r.FormValue("stop")
		routeID := r.FormValue("route")
		directionID := r.FormValue("direction")

		debugf(r, "\n%s, %s, %s\n", stopID, routeID, directionID)

		// getting data from Keolis
		ret, err := getBusNextDepartures(r, key, stopID, routeID, directionID)
		if err != nil {
			http.Error(w, err.Error(), 500)
			debugf(r, "%s", err.Error())
			return
		}

		// responding
		headers := w.Header()
		headers["Content-Type"] = []string{"application/json"}

		msg, err := json.MarshalIndent(ret, "", " ")
		if err != nil {
			http.Error(w, err.Error(), 500)
			debugf(r, "%s", err.Error())
			return
		}

		//		debugf(r, "réponse : %s", msg)
		fmt.Fprintf(w, "%s", msg)
	})
}

func unmarshalResponse(data []byte) (OpenData, error) {
	decoder := xml.NewDecoder(bytes.NewBuffer(data))
	decoder.Strict = false
	var o OpenData
	err := decoder.Decode(&o)

	return o, err
}

func getBusNextDepartures(r *http.Request, key, stopID, routeID, directionID string) (*StopLine, error) {
	var Url *url.URL
	Url, err := url.Parse("http://data.keolis-rennes.com/xml/")
	if err != nil {
		debugf(r, "%s", err.Error())
		return nil, err
	}
	parameters := url.Values{}
	parameters.Add("key", key)
	parameters.Add("cmd", "getbusnextdepartures")
	parameters.Add("version", "2.2")
	parameters.Add("param[mode]", "stopline")
	parameters.Add("param[stop][]", stopID)
	parameters.Add("param[route][]", routeID)
	parameters.Add("param[direction][]", directionID)
	Url.RawQuery = parameters.Encode()

	fmt.Println(Url.String())

	// getting URL result
	// resp, err := http.Get(Url.String())
	resp, err := get(r, Url.String())
	if err != nil {
		debugf(r, "%s", err.Error())
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		debugf(r, "%s", err.Error())
		return nil, err
	}

	o, err := unmarshalResponse(body)
	if err != nil {
		debugf(r, "%s", err.Error())
		return nil, err
	}

	if o.Answer == nil || o.Answer.Data == nil || o.Answer.Data.StopLine == nil {
		debugf(r, "Response %v\n", o)
		return nil, err
	}
	return o.Answer.Data.StopLine, err

}
