const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function test() {
  const res = await fetch('https://kingscollegehospitaldubai.com/dr/hussain-ibrahem-hussain/');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const images = [];
  $('img').each((i, el) => {
    images.push({
      class: $(el).attr('class'),
      src: $(el).attr('src'),
      dataSrc: $(el).attr('data-src'),
      dataLazySrc: $(el).attr('data-lazy-src')
    });
  });
  
  console.log(images.filter(img => 
    (img.src && img.src.includes('wp-content')) || 
    (img.dataSrc && img.dataSrc.includes('wp-content')) ||
    (img.dataLazySrc && img.dataLazySrc.includes('wp-content'))
  ));
}

test();
