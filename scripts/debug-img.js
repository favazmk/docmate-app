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
      src: $(el).attr('src')
    });
  });
  
  console.log(images.filter(img => img.src && img.src.includes('wp-content/uploads')));
}

test();
