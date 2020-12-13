/**
 * @file getRandomInt
 * @copyright Copyright (c) 2018-2020 Dylan Miller and openblockexplorer contributors
 * @license MIT License
 */

import getRandomNumber from './getRandomNumber';

/**
 * Return a random integer between start and end.
 * @param {Number} start The starting number.
 * @param {Number} end The ending number.
 * @return {Number} The random integer.
 * @private
 */
function getRandomInt(start, end) {
  return Math.floor(getRandomNumber(start, end + 0.99));
}

export default getRandomInt;
