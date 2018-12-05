import {getRandomInt} from './helper/randoms';

test('should return number between 1 and 10', () => {
  expect(getRandomInt(1,10)).not.toBeLessThan(1);
  expect(getRandomInt(1,10)).toBeLessThan(11);
});
