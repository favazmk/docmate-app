const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const urls = [
"https://kingscollegehospitaldubai.com/dr/am-bello/",
"https://kingscollegehospitaldubai.com/dr/lucy-rany-khan/",
"https://kingscollegehospitaldubai.com/dr/shabeeha-k-rana/",
"https://kingscollegehospitaldubai.com/dr/hussain-ibrahem-hussain/",
"https://kingscollegehospitaldubai.com/dr/syed-monawer-karim/",
"https://kingscollegehospitaldubai.com/dr/atif-alvi/",
"https://kingscollegehospitaldubai.com/dr/firas-younis/",
"https://kingscollegehospitaldubai.com/dr/balazs-hodosi/",
"https://kingscollegehospitaldubai.com/dr/farha-khalil/",
"https://kingscollegehospitaldubai.com/dr/suruchi-vohra/",
"https://kingscollegehospitaldubai.com/dr/marjan-shah/",
"https://kingscollegehospitaldubai.com/dr/omar-ayoub/",
"https://kingscollegehospitaldubai.com/dr/murtaza-najmi/",
"https://kingscollegehospitaldubai.com/dr/lama-jalouk/",
"https://kingscollegehospitaldubai.com/dr/umesh-nihalani/",
"https://kingscollegehospitaldubai.com/dr/aman-seyf/",
"https://kingscollegehospitaldubai.com/dr/roberto-puxeddu/",
"https://kingscollegehospitaldubai.com/dr/joseph-sleiman/",
"https://kingscollegehospitaldubai.com/dr/ida-laila-amir/",
"https://kingscollegehospitaldubai.com/dr/somaya-saddik/",
"https://kingscollegehospitaldubai.com/dr/sophie-racktoo/",
"https://kingscollegehospitaldubai.com/dr/tetyana-proenca/",
"https://kingscollegehospitaldubai.com/dr/ali-razzak/",
"https://kingscollegehospitaldubai.com/dr/riad-mounayer/"
];

async function scrapeAll() {
  let results = [];
  
  for (let url of urls) {
    try {
      console.log("Scraping: " + url);
      const res = await fetch(url);
      const html = await res.text();
      const $ = cheerio.load(html);

      const name = $('h1').first().text().trim();
      let specialty = "";
      let location = "Dubai Hills Hospital"; // Default
      let languages = "";

      // Try to parse the sidebar details block
      const detailsText = $('.dr-details, .elementor-widget-container').text();
      
      $('li, p, span, div').each((i, el) => {
        const text = $(el).text().replace(/\s+/g, ' ').trim();
        if (text.startsWith('Specialty:')) specialty = text.replace('Specialty:', '').trim();
        else if (text.startsWith('Languages Spoken:')) languages = text.replace('Languages Spoken:', '').trim();
        else if (text.startsWith('Location:')) location = text.replace('Location:', '').trim();
      });

      // Extract image
      let img = $('.dr-img img, .elementor-image img').attr('src') || $('img.attachment-full').attr('src');
      
      // Extract bio
      let bio = $('.dr-bio, .entry-content').text().trim().replace(/\s+/g, ' ');

      results.push({
        name,
        specialty,
        languages,
        location,
        img,
        bio,
        url
      });

    } catch (err) {
      console.error(`Failed to scrape ${url}: `, err.message);
    }
  }

  fs.writeFileSync('scripts/scraped_doctors.json', JSON.stringify(results, null, 2));
  console.log("Scraping complete! Data saved to scripts/scraped_doctors.json");
}

scrapeAll();
