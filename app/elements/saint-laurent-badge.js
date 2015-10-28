(function() {
  'use-strict';

  const template = ` 
    <style type="text/css">
      .saint-laurent-badge {
        display:inline-block;
        position:relative;
        margin: 0px;
        padding: 0px;

        width: 22px;
        height: 22px;

        text-align: center;
        line-height: 22px;
        vertical-align:middle;
      }

      .line-3 {
        background: #00893E;
        color: white;
      }

      .line-9 {
        background: #004F9E;
        color: white;
      }

      .line-51 {
        background: #6F2282;
        color: white;
        font-size: smaller;
        border-radius: 11px;
      }

      .line-71 {
        background: #A96F23;
        color: white;
        font-size: smaller
        border-radius: 11px;
      }

      .line-other {
        background: #D3D3D3;
        color: black;
        border-radius: 11px;
      }
    </style>
    <div class="saint-laurent-badge" id="container"></div>
  `;

  class SaintLaurenBadge extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.$container = this.shadowRoot.getElementById('container');

      this._updateLabel(this.getAttribute('line'));
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
      switch (attrName) {
        case "line":
          this._updateLabel(newVal);
          break;
      }
    }

    _updateLabel(value) {
      let lineNumber = parseInt(value, 10);
      this.$container.innerHTML = lineNumber;

      switch (lineNumber) {
        case 3:
          this.$container.classList.add("line-3");
          this.$container.innerHTML = "C3";
          break;
        case 9:
          this.$container.classList.add("line-9");
          break;
        case 51:
          this.$container.classList.add("line-51");
          break;
        case 71:
          this.$container.classList.add("line-71");
          break;
        default:
          this.$container.classList.add("line-other");
          this.$container.innerHTML = lineNumber;
          break;
      }
    }
  }

  document.registerElement('saint-laurent-badge', SaintLaurenBadge);
})();
