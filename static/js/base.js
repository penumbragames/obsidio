/**
 * Base functions needed on the client side.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

/**
 * Binds a function to a context, useful for assigning event handlers and
 * function callbacks.
 * @param {Object} context The context to assign the method to.
 * @param {function()} method The method to bind the context to.
 */
function bind(context, method) {
  return function() {
    return method.apply(context, arguments);
  };
}

/**
 * Creates and returns a div element.
 * @param {?Element=} parent The element to append the newly created div to.
 * @param {?string=} id The id to apply to the newly created div.
 * @param {?string=} className The class name to apply to the newly created
 *   div.
 */
function createDiv(parent, id, className) {
  var div = document.createElement('div');
  if (parent) {
    parent.appendChild(div);
  }
  if (id) {
    div.setAttribute('id', id);
  }
  if (className) {
    div.setAttribute('class', className);
  }
  return div;
}

/**
 * Creates a returns a JavaScript Image object.
 * @param {?string=} src The source URL of the image.
 * @param {?string=} width The width of the image in pixels.
 * @param {?string=} height The height of the image in pixels.
 */
function createImage(src, width, height) {
  var image = new Image(width, height);
  image.src = src;
  return image;
}
