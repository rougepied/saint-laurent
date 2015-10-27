(function() {
  'use-strict';

  class SaintLaurentTime extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = `<div style="display:inline;" id="container"></div>`;
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
