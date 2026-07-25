const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const prisma = new PrismaClient();

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

async function updateImages() {
  for (let url of urls) {
    try {
      console.log("Scraping: " + url);
      const res = await fetch(url);
      const html = await res.text();
      const $ = cheerio.load(html);

      const name = $('h1').first().text().trim();
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // Try multiple ways to find the image
      let img = $('.dr-img img').attr('src') 
             || $('.elementor-widget-image img').attr('src')
             || $('img.attachment-full').attr('src')
             || $('img.attachment-large').attr('src');

      if (!img) {
         // Regex fallback
         const matches = html.match(/https:\/\/kingscollegehospitaldubai\.com\/wp-content\/uploads\/[^"'\s]*\.(jpg|png|webp)/g);
         if (matches) {
            // Find one that likely contains the name or 'DR_'
            const nameParts = slug.split('-');
            img = matches.find(m => m.toLowerCase().includes('dr_') || m.toLowerCase().includes('dr-') || nameParts.some(p => p.length > 3 && m.toLowerCase().includes(p)));
            if (!img) {
                // Just take the first image in 202* that's not a logo
                img = matches.find(m => m.includes('202') && !m.includes('logo') && !m.includes('banner') && !m.includes('texture') && !m.includes('Mask-group') && !m.includes('WhatsApp'));
            }
         }
      }

      if (img) {
        console.log(`Found image for ${name}: ${img}`);
        await prisma.doctor.updateMany({
          where: { slug: slug },
          data: { photoUrl: img }
        });
      } else {
        console.log(`NO IMAGE FOUND for ${name}`);
      }

    } catch (err) {
      console.error(`Failed to update ${url}: `, err.message);
    }
  }

  console.log("Image update complete!");
}

updateImages().finally(() => prisma.$disconnect());
