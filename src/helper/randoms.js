/**
 * Gets random integer between min and max.
 *
 * @param min
 * @param max
 * @returns {*}
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * Get floating point number between min and max.
 *
 * @param min
 * @param max
 * @returns {*}
 */
export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Get random rgba color.
 *
 * @returns {string}
 */
export function getRandomRgbaColor() {
  const alpha = getRandomArbitrary(0.3, 1);
  const red = getRandomInt(0, 255);
  const green = getRandomInt(0, 255);
  const blue = getRandomInt(0, 255);
  return 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';
}
