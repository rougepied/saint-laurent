(function() {
  'use-strict';

  const template = `
    <style type="text/css">
      .saint-laurent {
        display: flex;
        flex-direction: column;
      }

      .saint-laurent-station {
        display: inline;
        position: relative;
        margin: 0px;
        padding: 5px;
      }
    </style>
    <div class="saint-laurent" id="container"></div>`;

  function templateStation(s) {
    let time = s.time;
    let line = s.line;

    return `
      <div class="saint-laurent-station">
        <saint-laurent-badge line="${line}"></saint-laurent-badge>
        <saint-laurent-time-new time="${time}"></saint-laurent-time-new>
      </div>`;
  }

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

  class SaintLaurent extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.$container = this.shadowRoot.getElementById('container');

      this.stations = [
        newStations("1372", "0009", "0"),
        newStations("1485", "0071", "0"),
        newStations("1103", "0003", "0"),
        newStations("1485", "0051", "0")
      ];

      var fetches = [];
      this.stations.forEach(i => {
        let param = [
          ["stop", i.stop],
          ["route", i.route],
          ["direction", i.direction]
        ]
          .map(i => i.join("="))
          .join("&");

        fetches.push(fetch("/api/3.0?" + param).then(i => i.json()));
      });

      Promise.all(fetches)
        .then(filterNull)
        .then(mapSchedules)
        .then(flatten)
        .then(sortSchedules)
        .then(i => {
          i.forEach(s => {
            this.$container.innerHTML += templateStation(s);
          });
        });
    }
  }

  document.registerElement('saint-laurent-new', SaintLaurent);
})();
