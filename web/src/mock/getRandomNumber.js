/**
 * @file getRandomNumber
 * @copyright Copyright (c) 2018-2020 Dylan Miller and openblockexplorer contributors
 * @license MIT License
 */

 /**
 * Return a random number between start and end.
 * @param {Number} start The starting number.
 * @param {Number} end The ending number.
 * @return {Number} The random number.
 * @private
 */
function getRandomNumber(start, end) {
  return Math.random() * (end - start) + start;
}

export default getRandomNumber;
