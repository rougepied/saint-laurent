(function() {
  'use-strict';

  const template = `
    <div class="saint-laurent" id="container">
      <saint-laurent-list id="saint-laurent-list" list="[]"></saint-laurent-list>
    </div>
  `.trim();

  const newStationParam = (stop, route, direction) => ({
      "stop": stop,
      "route": route,
      "direction": direction
  });

  class SaintLaurent extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.$container = this.shadowRoot.querySelector('#container');
      this.$saintLaurentList = this.shadowRoot.querySelector("#saint-laurent-list");

      this.stations = [
        newStationParam("1372", "0009", "0"),
        newStationParam("1485", "0071", "0"),
        newStationParam("1103", "0003", "0"),
        newStationParam("1485", "0051", "0")
      ];

      let results = [];
      this.stations.forEach(i => {
        let param = [
          ["stop", i.stop],
          ["route", i.route],
          ["direction", i.direction]
        ]
          .map(i => i.join("="))
          .join("&");

        fetch("/api/3.0?" + param)
          .then(i => i.json())
          .then(i => {
            if (i !== null) {
              results = results.concat(i.schedules);
              console.log(results);
              this.$saintLaurentList.setAttribute('list', JSON.stringify(results));
            }
          });
      });
    }
  }

  document.registerElement('saint-laurent', SaintLaurent);
})();
