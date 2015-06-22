// Copyright © 2015 Arnaud Malivoir
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See the COPYING file or http://www.wtfpl.net/
// for more details.

// +build !appengine

// A stand-alone HTTP server providing a web UI showing bus next departure.
package main

import (
	"flag"
	"fmt"
	"net/http"
)

func main() {
	var key = flag.String("key", keyDefault, "Keolis API Key")
	flag.Parse()

	if key == nil {
		*key = keyDefault
	}

	// serving API
	http.Handle("/api/2.0", handleApi(*key))
	// serving static files
	http.Handle("/", http.FileServer(http.Dir("./static/")))

	http.ListenAndServe(":8080", nil)
}

func debugf(r *http.Request, format string, args ...interface{}) {
	fmt.Printf(format, args)
}

func get(r *http.Request, url string) (resp *http.Response, err error) {
	return http.Get(url)
}
