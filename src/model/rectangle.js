import {getRandomRgbaColor} from '../helper/randoms';

/**
 * Rectangle class.
 */
export default class Rectangle {
  constructor(beginningPoint, endingPoint, id) {
    this.beginningPoint = beginningPoint;
    this.endingPoint = endingPoint;
    this.id = id;
    this.initiateRectangle();
  }

  /**
   * Initiates SVGRectElement.
   */
  initiateRectangle() {
    const xmlns = 'http://www.w3.org/2000/svg';
    const rect = document.createElementNS(xmlns, 'rect');

    rect.setAttributeNS(null, 'id',  this.id);
    rect.setAttributeNS(null, 'x', this.beginningPoint.x);
    rect.setAttributeNS(null, 'y', this.beginningPoint.y);
    rect.setAttributeNS(null, 'width', '1');
    rect.setAttributeNS(null, 'height', '1');
    rect.setAttributeNS(null, 'fill', getRandomRgbaColor());

    this.svgRect = rect;
  }

  /**
   * Updates the SVGRectElement with current end point.
   *
   * @param currentCoordinates
   */
  updateSvgRect(currentCoordinates) {
    this.endingPoint = currentCoordinates;
    const x = Math.min(this.beginningPoint.x, this.endingPoint.x);
    const y = Math.min(this.beginningPoint.y, this.endingPoint.y);

    const width = Math.abs(this.endingPoint.x - this.beginningPoint.x);
    const height = Math.abs(this.endingPoint.y - this.beginningPoint.y);

    this.svgRect.setAttribute('x', x);
    this.svgRect.setAttribute('y', y);
    this.svgRect.setAttribute('width', width);
    this.svgRect.setAttribute('height', height);
  }

  /**
   *
   * @param e SVG animation 'beginEvent'
   */
  static rectOnAnimationBegin(e) {
    const animation = e.currentTarget;
    const rect = animation.parentNode;
    rect.setAttribute('data:animationStarted', 'true');
  }

  /**
   * To stop propagation - enables double click event on rectangle.
   *
   * @param e MouseEvent mousedown
   */
  static rectMouseDown(e) {
    e.stopPropagation();
  }
}
