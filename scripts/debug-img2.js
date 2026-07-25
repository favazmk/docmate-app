const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function test() {
  const res = await fetch('https://kingscollegehospitaldubai.com/dr/hussain-ibrahem-hussain/');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  // check elementor elements with background images
  const elements = [];
  $('*').each((i, el) => {
    const style = $(el).attr('style');
    if (style && style.includes('background-image')) {
      elements.push(style);
    }
  });
  console.log("Background images:", elements);
}

test();
