import Point from './point';
import Rectangle from './rectangle';
import {getFadeAnimation, getRotationAnimation} from '../helper/animations';

/**
 * Canva class is handling the drawing logic.
 */
export default class Canva {

  constructor(svgElement, width, height) {
    this.canva = svgElement;
    this.canva.setAttribute('width', width + 'px');
    this.canva.setAttribute('height', height + 'px');

    this.animationDurationTime = 3;
    this.animationsInProgress = 0;

    this.drawingInProgress = false;
    this.rectangles = [];
    this.initialCoordinates = new Point(0, 0);
    this.currentCoordinates = new Point(1, 1);
    this.lastRectangleId = 0;

    this.setupEventListeners();
  }

  /**
   * Set up the EventListeners.
   */
  setupEventListeners() {
    this.mouseMoveListener = this.mousemove.bind(this);
    this.mouseUpListener = this.mouseup.bind(this);
    this.onEndRotationAnimationListener = this.rectOnRotationAnimationEnd.bind(this);
    this.onEndFadeAnimationListener = this.rectOnFadeAnimationEnd.bind(this);
    this.canva.addEventListener('mousedown', this.mousedown.bind(this));
  }

  /**
   * Transforms cordinates relatively to svg canva element.
   *
   * @param e
   * @returns {Point}
   */
  screenToSVGCoords(e) {
    if (e) {
      let canvasRect = this.canva.getBoundingClientRect();
      return new Point(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
    }
  }

  /**
   * Handle rotation animation end.
   *
   * @param e SVG animation 'endEvent'
   */
  rectOnRotationAnimationEnd(e) {
    const animation = e.currentTarget;
    const rect = animation.parentNode;
    if (rect.getAttribute('data:scheduledForFade') && --this.animationsInProgress === 0) {
      // remove current
      this.removeRotationAttachFadeAnimation(rect);
      // remove all
      this.removeRotationAttachFadeAnimationFromAll();
    }
  }

  /**
   * Removes rotation animation and attaches fade animation for all rect elements scheduled.
   */
  removeRotationAttachFadeAnimationFromAll() {
    const allElements = this.canva.getElementsByTagName('rect');
    for (let i = 0, n = allElements.length; i < n; i++) {
      if (allElements[i].getAttribute('data:scheduledForFade') !== null) {
        this.removeRotationAttachFadeAnimation(allElements[i]);
      }
    }
  }

  /**
   * Removes rotation animation and attaches fade animation.
   *
   * @param rectangle SVGRectElement
   */
  removeRotationAttachFadeAnimation(rectangle) {
    // set duration for fade as 20% of rotation duration - just for visual effect
    const duration = this.animationDurationTime / 5;
    const fadeAnimation = getFadeAnimation(duration);
    rectangle.removeChild(rectangle.lastChild);
    fadeAnimation.addEventListener('endEvent', this.onEndFadeAnimationListener);
    rectangle.appendChild(fadeAnimation);
    fadeAnimation.beginElement();
    setTimeout(() => rectangle.setAttribute('data:scheduledForRemoval', 'true'), duration * 1000 / 5);
  }

  /**
   * Handle fade animation end.
   *
   * @param e SVG animation 'endEvent'
   */
  rectOnFadeAnimationEnd(e) {
    const animation = e.currentTarget;
    const rectangle = animation.parentNode;
    if (rectangle && rectangle.getAttribute('data:scheduledForRemoval') !== null) {
      // remove from local data table
      this.rectangles = this.rectangles.filter((rect) => {
        return rect.id !== rectangle.getAttribute('id');
      });
      // remove from svg
      rectangle.parentNode.removeChild(rectangle);
    }
  }

  /**
   * Handle MouseEvent dblclick on rectangle.
   * Starts animation only if not started already
   *
   * @param e
   */
  rectDoubleClick(e) {
    const rect = e.currentTarget;
    if (rect.getAttribute('data:animationStarted')) {
      return;
    }

    this.animationsInProgress++;
    const animation = getRotationAnimation(rect, this.animationDurationTime);
    animation.addEventListener('endEvent', this.onEndRotationAnimationListener);
    animation.addEventListener('beginEvent', Rectangle.rectOnAnimationBegin);
    rect.appendChild(animation);
    animation.beginElement();
    e.stopPropagation();
    setTimeout(() => rect.setAttribute('data:scheduledForFade', 'true'), this.animationDurationTime * 1000 / 5);
  }

  /**
   * Handle MouseEvent mousedown.
   *
   * @param e
   */
  mousedown(e) {
    this.drawingInProgress = true;
    this.canva.addEventListener('mousemove', this.mouseMoveListener);
    this.canva.addEventListener('mouseup', this.mouseUpListener);
    this.startRectangle(e);
  }

  /**
   * Handle MouseEvent mousemove.
   * Drawing the rectangle on svg canva
   *
   * @param e {MouseEvent} type: 'mousemove'
   */
  mousemove(e) {
    if (this.drawingInProgress) {
      this.currentCoordinates = this.screenToSVGCoords(e);
      this.drawRectangle();
    }
  }

  /**
   * Handle MouseEvent mouseup.
   */
  mouseup() {
    this.drawingInProgress = false;
    this.removeRecentlyCreatedRectangleIfNeeded();
    this.canva.removeEventListener('mousemove', this.mouseMoveListener);
    this.canva.removeEventListener('mouseup', this.mouseUpListener);
  }

  /**
   * Start drawing rectangle.
   *
   * @param e {MouseEvent} type: 'mousedown'
   */
  startRectangle(e) {
    this.initialCoordinates = this.screenToSVGCoords(e);
    const rectId = 'bs-rect-' + ++this.lastRectangleId;
    const rect = new Rectangle(this.initialCoordinates, this.currentCoordinates, rectId);
    rect.svgRect.addEventListener('mousedown', Rectangle.rectMouseDown);
    rect.svgRect.addEventListener('dblclick', this.rectDoubleClick.bind(this));

    this.canva.appendChild(rect.svgRect);
    this.rectangles.push(rect);
  }

  /**
   * Continue drawing rectangle.
   */
  drawRectangle() {
    const rect = this.rectangles[this.rectangles.length - 1];
    rect.updateSvgRect(this.currentCoordinates);
  }

  /**
   * Remove the recently created rectangle if its a line.
   */
  removeRecentlyCreatedRectangleIfNeeded() {
    const rect = this.rectangles[this.rectangles.length - 1];
    if (rect.svgRect.getAttribute('height') <= 1 || rect.svgRect.getAttribute('width') <= 1) {
      this.rectangles.splice(-1, 1);
      if (this.canva.lastChild) {
        this.canva.removeChild(this.canva.lastChild);
      }
    }
  }
}
