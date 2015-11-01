/**
 * This class encapsulates the UI and handles the DOM elements and click
 * handlers for the UI.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

/**
 * Constructor for the UI class.
 * @constructor
 * @param {Element} buildOptionElement The element containing all the build
 *   options available to the player.
 */
function UI(buildOptionElement) {
  this.buildOptionElement = buildOptionElement;
}

/**
 * Factory method to create a UI class.
 * @param {Element} The container element of the UI in which all the UI's
 *   divs will be created.
 */
UI.create = function(containerElement) {
  var buildOptionElement = createDiv(
      containerElement, 'ui');
  return new UI(buildOptionElement);
};

/**
 * Initializes the UI after creation.
 * @param {function()} startBuildCallback The callback function to call when
 *   the user clicks on the UI with the intention to build.
 * @param {function()} endBuildCallback The callback function to call when
 *   the user clicks on the UI with the intention to place or cancel their
 *   build.
 */
UI.prototype.init = function(startBuildCallback, endBuildCallback) {
  // @todo: refactor 6 into a constant
  for (var i = 0; i < 6; ++i) {
    var buildOption = createDiv(this.buildOptionElement,
                                null, 'ui-build-option');
    buildOption.style.backgroundImage = 'url(' +
        Drawing.SELF_CONSTRUCT_SRCS[i] + ')';
    // We use an anonymous function here to do static binding so that the
    // function is called with the value of i that it was assigned at that
    // iteration of the loop.
    (function(j) {
      buildOption.onclick = function(e) {
        startBuildCallback(j);
        e.stopPropagation();
      }
    }(i));
  }
};
