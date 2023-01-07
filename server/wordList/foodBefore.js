const foods = [
  "맛있는",
  "맛없는",
  "단",
  "싱거운",
  "매운",
  "바삭한",
  "짠",
  "신",
  "쓴",
  "부드러운",
  "텁텁한",
  "쫄깃쫄깃한",
  "기름진",
  "이상한",
  "달콤한",
  "신기한",
  "신비로운",
  "딱딱한",
  "말랑말랑한",
  "느끼한",
  "A급",
  "B급",
  "C급",
];
// (Modi + F)로 이미 있는 단어인지 확인 하고 만드셈들
// 물론 중복 제거 기능이 있긴 한데 CPU 사용하니까 ;;
// 띄어쓰기 X
// 맞춤법 체크 하셈
// 느금마 같은거 넣지 마셈

let gx = foods.filter((v) => v.indexOf(" ") == -1);
let gxy = gx.filter((element, index) => {
  return gx.indexOf(element) === index;
});

exports.default = gxy;
