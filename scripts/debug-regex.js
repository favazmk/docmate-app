const fetch = require('node-fetch');

async function test() {
  const res = await fetch('https://kingscollegehospitaldubai.com/dr/hussain-ibrahem-hussain/');
  const html = await res.text();
  
  const matches = html.match(/https:\/\/kingscollegehospitaldubai\.com\/wp-content\/uploads\/[^"'\s]*\.(jpg|png|webp)/g);
  if (matches) {
    console.log("Images found: ", [...new Set(matches)]);
  } else {
    console.log("No images found");
  }
}

test();
