(function() {
  'use-strict';

  const template = `
  <style type="text/css">
    :host {
      display:inline-block;
      position:relative;
      margin: 0px;
      padding: 0px;

      height: 22px;
      line-height: 22px;
      vertical-align:middle;
    }

    .saint-laurent-time-new {
      display:inline-block;
      position:relative;
      margin: 0px;

      height: 22px;
      line-height: 22px;
      vertical-align:middle;
    }
  </style>
  <div class="saint-laurent-time-new" id="container"></div>
  `;

  class SaintLaurentTime extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.$container = this.shadowRoot.getElementById('container');

      this._updateTime(this.getAttribute('time'));
    };

    attributeChangedCallback(attrName, oldVal, newVal) {
      switch (attrName) {
        case "time":
          this._updateTime(newVal);
          break;
      }
    };

    _updateTime(time) {
      var theDate, display;

      moment.locale('fr');
      theDate = moment(time);

      display = theDate.format("HH:mm");

      this.$container.innerHTML = display + " (" + theDate.fromNow() + ")";
    }
  }
  document.registerElement('saint-laurent-time-new', SaintLaurentTime);
})();
