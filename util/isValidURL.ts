const protocol = "(((ws(s)?)|(http(s)?))\\:\\/\\/)";
const domain = "[a-zA-Z0-9_-]+";
const other = '([a-zA-Z/0-9$-/:-?{#-~!"^_`\\[\\]]+)?';
const ext = "(\\." + other + ")";
const port = "(\\:[0-9]+)?";
const ip = "([a-zA-Z0-9]{4}:)+[a-zA-Z0-9]";

export default function isValidURL(url: string) {
  let options = { requireProtocol: true };
  const re = new RegExp(
    "^" +
      protocol +
      (!options.requireProtocol ? "?" : "") +
      "(" +
      domain +
      ext +
      "|localhost|" +
      ip +
      ")" +
      port +
      other +
      "$"
  );
  return re.test(url);
}
