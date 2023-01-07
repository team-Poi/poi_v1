let food = require("./food").default;
let foodBefore = require("./foodBefore").default;

exports.default = function getFood() {
  let f = food[Math.floor(Math.random() * food.length)];
  let l = foodBefore[Math.floor(Math.random() * foodBefore.length)];
  let c = Math.floor(Math.random() * 999) + 1;
  return `${c}개의${l}${f}`;
};
