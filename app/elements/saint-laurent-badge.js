(function() {
  'use-strict';

  const template = `
  <style type="text/css">
    :host {
      display:inline-block;
      position:relative;
      margin: 0px;
      padding: 0px;

      width: 22px;
      height: 22px;
      border-radius: 11px;
      overflow: hidden;

      text-align: center;
      line-height: 22px;
      vertical-align:middle;
    }

    .saint-laurent-badge {
      display:inline-block;
      position:relative;
      margin: 0px;

      width: 22px;
      height: 22px;
      border-radius: 11px;
      overflow: hidden;

      text-align: center;
      line-height: 22px;
      vertical-align:middle;
    }

    .line-3 {
      background: green;
      color: white;
    }

    .line-9 {
      background: blue;
      color: white;
    }
  </style>
  <div class="saint-laurent-badge" id="container"></div>
  `;

  class SaintLaurenBadge extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.$container = this.shadowRoot.getElementById('container');

      this._updateLabel(this.getAttribute('line'));
    };

    attributeChangedCallback(attrName, oldVal, newVal) {
      switch (attrName) {
        case "line":
          this._updateLabel(newVal);
          break;
      }
    };

    _updateLabel(value) {
      let lineName = parseInt(value, 10).toString();
      this.$container.innerHTML = lineName;

      switch (lineName) {
        case "3":
          this.$container.classList.add("line-3");
          break;
        case "9":
          this.$container.classList.add("line-9");
      }
    };

  }

  document.registerElement('saint-laurent-badge', SaintLaurenBadge);
})();
