/*
The `saint-laurent-list` web component display a list of next departures
from the Saint-Laurent bus station.

exemple:

    <saint-laurent-list list="[]""></saint-laurent-list>
    <saint-laurent-list list="[{"time":"2015-10-31T22:02:35+01:00","line":"0009"},{"time":"2015-10-31T22:17:00+01:00","line":"0009"}]""></saint-laurent-list>
*/
(function() {
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
    <div class="saint-laurent" id="container"></div>
  `.trim();

  let sortSchedules = (a, b) => {
    if (moment(a.time).isBefore(b.time)) {
      return -1;
    }
    if (moment(a.time).isAfter(b.time)) {
      return 1;
    }
    return 0;
  };

  const templateStation = (s) => `
      <div class="saint-laurent-station">
        <saint-laurent-badge line="${s.line}"></saint-laurent-badge>
        <saint-laurent-time time="${s.time}"></saint-laurent-time>
      </div>
  `.trim();

  class SaintLaurentList extends HTMLElement {
    // Fires when an instance of the element is created.
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.$container = this.shadowRoot.querySelector('#container');
      console.log('list created');
    }

    // Fires when an instance was inserted into the document.
    attachedCallback() {}

    // Fires when an attribute was added, removed, or updated.
    attributeChangedCallback(attrName, oldVal, newVal) {
      switch (attrName) {
        case "list":
          let schedules = JSON.parse(newVal);
          this._updateView(schedules);
          break;
      }
    }

    _updateView(schedules) {
      let content = "";

      schedules.sort(sortSchedules)
        .forEach(i => {
          console.log(i);
          content += templateStation(i);
        });

      this.$container.innerHTML = content;
    }
  }
  document.registerElement('saint-laurent-list', SaintLaurentList);
})();
