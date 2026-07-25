const fetch = require('node-fetch');
async function test() {
  const html = await (await fetch('https://kingscollegehospitaldubai.com/dr/murtaza-najmi/')).text();
  const matches = html.match(/https:\/\/kingscollegehospitaldubai\.com\/wp-content\/uploads\/[^"'\s]*\.(jpg|png|webp|jpeg)/gi);
  console.log([...new Set(matches)]);
}
test();
