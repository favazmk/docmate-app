const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function test() {
  const res = await fetch('https://kingscollegehospitaldubai.com/dr/hussain-ibrahem-hussain/');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const content = $('.elementor-widget-container').text();
  
  // Just log a substring of the raw html
  console.log(html.substring(html.indexOf('<img'), html.indexOf('<img') + 1000));
}

test();
