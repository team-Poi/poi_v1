let getElectronic = require("./getElectronic").default;
let getFood = require("./getFood").default;

let getFuncs = [getFood, getElectronic];

function rand(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

exports.default = function getWord() {
  let func = getFuncs[rand(0, getFuncs.length - 1)];
  return func();
};
