/**
 * Get rotation animation.
 *
 * @param rectangle
 * @param durationTime
 * @returns {SVGElement}
 */
export function getRotationAnimation(rectangle, durationTime) {
  const a = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
  const bb = rectangle.getBBox();
  const cx = bb.x + bb.width / 2;
  const cy = bb.y + bb.height / 2;
  a.setAttributeNS(null, 'attributeName', 'transform');
  a.setAttributeNS(null, 'attributeType', 'XML');
  a.setAttributeNS(null, 'type', 'rotate');
  a.setAttributeNS(null, 'dur', durationTime + 's');
  a.setAttributeNS(null, 'repeatCount', '1');
  a.setAttributeNS(null, 'from', '0 ' + cx + ' ' + cy);
  a.setAttributeNS(null, 'to', 360 + ' ' + cx + ' ' + cy);
  a.setAttributeNS(null, 'begin', '0s');
  return a;
}

/**
 * Get Fade animation.
 *
 * @param durationTime
 * @returns {SVGElement}
 */
export function getFadeAnimation(durationTime) {
  const a = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
  a.setAttributeNS(null, 'attributeName', 'opacity');
  a.setAttributeNS(null, 'fill', 'freeze');
  a.setAttributeNS(null, 'from', '1');
  a.setAttributeNS(null, 'to', '0');
  a.setAttributeNS(null, 'dur', durationTime + 's');
  return a;
}
