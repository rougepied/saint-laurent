(function() {
  'use-strict';

  function newStations(stop, route, direction) {
    return {
      "stop": stop,
      "route": route,
      "direction": direction
    };
  }

  let filterNull = array => array.filter(i => i !== null);
  let mapSchedules = i => i.map(j => j.schedules);
  let flatten = i => i.reduce((a, b) => a.concat(b))
  let sortSchedules = i => i.sort((a, b) => {
      moment.locale('fr');
      if (moment(a.time).isBefore(b.time)) return -1;
      if (moment(a.time).isAfter(b.time)) return 1;
      return 0;
    });


  class SaintLaurentNew extends HTMLElement {
    createdCallback() {
      this.stations = [
        newStations("1372", "0009", "0"),
        newStations("1485", "0071", "0"),
        newStations("1103", "0003", "0"),
        newStations("1485", "0051", "0")
      ];

      var fetches = [];
      for (
      let i of this.stations) {

      let param = [["stop", i.stop], ["route", i.route], ["direction", i.direction]]
        .map(i => i.join("="))
        .join("&");

      fetches.push(fetch("/api/3.0?" + param).then(i => i.json()));
      }

      Promise.all(fetches)
        .then(filterNull)
        .then(mapSchedules)
        .then(flatten)
        .then(sortSchedules)
        .then(i => console.log(i));
    }
  }

  document.registerElement('saint-laurent-new', SaintLaurentNew);
})();
