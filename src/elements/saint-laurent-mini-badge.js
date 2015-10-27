(function() {
  'use-strict';

  const template = `
  <style type="text/css">
    .saint-laurent-mini-badge {
      display:inline-block;
      margin: 0;

      width: 80px;
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
    };

    attributeChangedCallback(attrName, oldVal, newVal) {
      switch (attrName) {
        case "label":
          this._updateLabel(newVal);
          break;
      }
    };

    _updateLabel(value) {
      this.$container.innerHTML = value;
    };

  }

  document.registerElement('saint-laurent-mini-badge', MiniBadge);
})();
