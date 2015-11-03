/**
 * This class encapsulates the UI and handles the DOM elements and click
 * handlers for the UI.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

/**
 * Constructor for the UI class.
 * @constructor
 * @param {Element} buildOptionContainerElement The element containing all the
 *   build options available to the player.
 */
function UI(buildOptionContainerElement) {
  this.buildOptionContainerElement = buildOptionContainerElement;

  this.buildOptionElements = [];
}

/**
 * Factory method to create a UI class.
 * @param {Element} The container element of the UI in which all the UI's
 *   divs will be created.
 */
UI.create = function(containerElement) {
  var buildOptionContainerElement = createDiv(containerElement, 'ui');
  return new UI(buildOptionContainerElement);
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
  for (var i = 0; i < Constants.NUM_CONSTRUCTS; ++i) {
    var buildOptionElement = createDiv(this.buildOptionContainerElement,
                                       null, 'ui-build-option');
    buildOptionElement.style.backgroundImage = 'url(' +
        Drawing.SELF_CONSTRUCT_SRCS[i] + ')';
    // We use an anonymous function here to do static binding so that the
    // function is called with the value of i that it was assigned at that
    // iteration of the loop.
    // @todo: look into a better bind() method and stick it in base.js to use
    // here.
    // @todo (omgimanerd): I don't like this but okay.
    (function(j) {
      buildOptionElement.onclick = function(e) {
        startBuildCallback(j);
        e.stopPropagation();
      }
    }(i));

    this.buildOptionElements.push(buildOptionElement);
  }
};

/**
 * Updates the UI so that the build images have a cancel icon over them
 * if the player wishes to cancel their build.
 */
UI.prototype.startBuild = function() {
  for (var i = 0; i < this.buildOptionElements.length; ++i) {
    this.buildOptionElements[i].style.backgroundImage = 'url(' +
        Drawing.CANCEL_SRC + '), url(' + Drawing.NEUTRAL_CONSTRUCT_SRCS[i] +
        ')';
  }
};

/**
 * Updates the UI and removes the cancel icon from the build icons after a
 * build has been canceled.
 */
UI.prototype.endBuild = function() {
  for (var i = 0; i < this.buildOptionElements.length; ++i) {
    this.buildOptionElements[i].style.backgroundImage = 'url(' +
        Drawing.NEUTRAL_CONSTRUCT_SRCS[i] + ')';
  }
};
