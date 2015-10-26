/**
 * Base functions needed on the client side.
 * @author Alvin Lin (omgimanerd1998@gmail.com)
 */

function bind(context, method) {
  return function() {
    return method.apply(context, arguments);
  };
}

function createDiv(parent, className) {
  var div = document.createElement('div');
  if (parent) {
    parent.appendChild(div);
  }
  if (className) {
    div.setAttribute('class', className);
  }
  return div;
}
