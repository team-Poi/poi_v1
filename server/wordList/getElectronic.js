let electronic = require("./electronic").default;
let electronicBefore = require("./electronicBefore").default;

exports.default = function getElectronic() {
  let f = electronic[Math.floor(Math.random() * electronic.length)];
  let l = electronicBefore[Math.floor(Math.random() * electronicBefore.length)];
  let c = Math.floor(Math.random() * 99) + 1;
  return `${c}개의${l}${f}`;
};
