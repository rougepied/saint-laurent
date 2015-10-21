(function() {
  'use-strict';

  const template = `
  <style type="text/css"></style>
  <div id="container">saint-laurent-station-new</div>
  `;

  class StLaurentStation extends HTMLElement {
    createdCallback() {
      this.createShadowRoot().innerHTML = template;
      this.$container = this.shadowRoot.getElementById('container');

      this.$stopID = this.getAttribute('stop-id');
      this.$routeID = this.getAttribute('route-id');
      this.$directionID = this.getAttribute('direction-id');
      this.$label = this.getAttribute('label');
      this.$color = this.getAttribute('color');

    };
  }

  document.registerElement('saint-laurent-station-new', StLaurentStation);
})();
