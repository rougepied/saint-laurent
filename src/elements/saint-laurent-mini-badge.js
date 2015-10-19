(function() {
  'use-strict';

  let template = `
  <style type="text/css">
    :host {
      display: inline-block;
      position: relative;
      margin: 0;

      width: 20px;
      height: 20px;
      border-radius: 50%;
      overflow: hidden;
      background: #ccc;

      text-align: center;
      line-height: 20px;
    }
  </style>
  <div id="label"></div>
  `;


  class MiniBadge extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;

      this.$label = this.shadowRoot.getElementById('label');

      this._updateLabel(this.getAttribute('label'));
    };

    attributeChangedCallback(attrName, oldVal, newVal) {
      switch (attrName) {
        case "label":
          this._updateLabel(newVal);
          break;
      }
    };

    _updateLabel(value) {
      console.log(this.$label);
      this.$label.innerHTML = value;
    };
  }

  document.registerElement('saint-laurent-mini-badge', MiniBadge);
})();
