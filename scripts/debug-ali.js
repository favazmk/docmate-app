const fetch = require('node-fetch');
async function test() {
  const html = await (await fetch('https://kingscollegehospitaldubai.com/dr/ali-razzak/')).text();
  const matches = html.match(/https:\/\/kingscollegehospitaldubai\.com\/wp-content\/uploads\/[^"'\s]*\.(jpg|png|webp)/g);
  console.log([...new Set(matches)]);
}
test();
