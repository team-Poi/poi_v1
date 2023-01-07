const before = [
  "비싼",
  "좋은",
  "빠른",
  "싼",
  "안좋은",
  "느린",
  "고장난",
  "중고인",
  "새상품인",
];
// (Modi + F)로 이미 있는 단어인지 확인 하고 만드셈들
// 물론 중복 제거 기능이 있긴 한데 CPU 사용하니까 ;;
// 띄어쓰기 X
// 맞춤법 체크 하셈
// 느금마 같은거 넣지 마셈

let gx = before.filter((v) => v.indexOf(" ") == -1);
let gxy = gx.filter((element, index) => {
  return gx.indexOf(element) === index;
});

exports.default = gxy;
