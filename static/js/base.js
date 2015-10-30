/**
 * Base functions needed on the client side.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

function bind(context, method) {
  return function() {
    return method.apply(context, arguments);
  };
}

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
