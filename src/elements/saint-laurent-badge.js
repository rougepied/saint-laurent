(function() {
  'use-strict';

  const template = `
  <style type="text/css">
    .saint-laurent-badge {
      display:inline-block;
      margin: 0;

      width: 80px;
      height: 20px;
      border-radius: 10px;
      overflow: hidden;
      background: #ccc;

      text-align: center;
      line-height: 20px;
    }
  </style>
  <div class="saint-laurent-badge" id="container"></div>
  `;

  class SaintLaurenBadge extends HTMLElement {
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

  document.registerElement('saint-laurent-badge', SaintLaurenBadge);
})();
