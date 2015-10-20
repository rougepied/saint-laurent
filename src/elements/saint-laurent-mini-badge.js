(function() {
  'use-strict';

  const template = `

  <style type="text/css">
    .saint-laurent-mini-badge {
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
  <div class="saint-laurent-mini-badge" id="container"></div>
  `;

  class MiniBadge extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.$container = this.shadowRoot.getElementById('container');

      this._updateLabel(this.getAttribute('label'));
      this._updateColor(this.getAttribute('color'));
    };

    attributeChangedCallback(attrName, oldVal, newVal) {
      switch (attrName) {
        case "label":
          this._updateLabel(newVal);
          break;
        case "color":
          this._updateColor(newVal);
          break;
      }
    };

    _updateLabel(value) {
      this.$container.innerHTML = value;
    };

    _updateColor(value) {
      this.$container.style['background-color'] = value;
    }

  }

  document.registerElement('saint-laurent-mini-badge', MiniBadge);
})();
