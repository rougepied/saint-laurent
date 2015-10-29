(function() {
  'use-strict';

  const template = `
    <style type="text/css">
      @import url(https://fonts.googleapis.com/css?family=Roboto+Condensed);

      .saint-laurent-time {
        font-family: 'Roboto Condensed', sans-serif;
        
        display:inline-block;
        position:relative;
        margin: 0px;
        padding: 0px;

        height: 22px;
        line-height: 22px;
        vertical-align:middle;
      }
    </style>
    <div class="saint-laurent-time" id="container"></div>
  `;

  class SaintLaurentTime extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.$container = this.shadowRoot.getElementById('container');

      this._updateTime(this.getAttribute('time'));
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      switch (attrName) {
        case "time":
          this._updateTime(newVal);
          break;
      }
    }

    _updateTime(time) {
      let theDate, display;

      theDate = moment(time);
      display = theDate.format("HH:mm");

      this.$container.innerHTML = display + " (" + theDate.fromNow() + ")";
    }
  }
  document.registerElement('saint-laurent-time', SaintLaurentTime);
})();
