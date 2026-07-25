const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fetch = require('node-fetch');
const fs = require('fs');

async function fixRemaining() {
  const docs = await prisma.doctor.findMany({ where: { photoUrl: null } });
  console.log(`Found ${docs.length} doctors without images.`);
  
  const scraped = JSON.parse(fs.readFileSync('scripts/scraped_doctors.json'));

  for (const doc of docs) {
    // Find the original URL
    const originalDoc = scraped.find(s => s.name === doc.name);
    if (!originalDoc) continue;
    
    const url = originalDoc.url;
    
    try {
      console.log('Scraping: ' + url);
      const res = await fetch(url);
      const html = await res.text();
      
      const matches = html.match(/https:\/\/kingscollegehospitaldubai\.com\/wp-content\/uploads\/[^"'\s]*\.(jpg|png|webp|jpeg)/gi);
      if (!matches) {
         console.log('No image matches at all for ' + doc.name);
         continue;
      }

      const uniqueMatches = [...new Set(matches)];
      const nameParts = doc.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter(p => p !== 'dr' && p !== 'professor' && p !== 'prof');
      
      let candidates = uniqueMatches.filter(m => {
         const mLow = m.toLowerCase();
         return !mLow.includes('logo') && 
                !mLow.includes('banner') && 
                !mLow.includes('ban2') && 
                !mLow.includes('texture') && 
                !mLow.includes('mask-group') && 
                !mLow.includes('whatsapp') &&
                !mLow.includes('bg_hq') &&
                !mLow.includes('bg_lq') &&
                mLow.includes('20');
      });
      
      let img = candidates.find(m => nameParts.some(p => p.length >= 3 && m.toLowerCase().includes(p)));
      
      if (!img && candidates.length > 0) {
        img = candidates.find(m => m.toLowerCase().includes('dr_') || m.toLowerCase().includes('dr-') || m.toLowerCase().includes('dr.'));
      }

      if (!img) {
         const possible = candidates.filter(m => !m.includes('dubai') && !m.includes('smart') && !m.includes('sec-') && !m.includes('screenshot') && !m.includes('image.jpg'));
         if (possible.length > 0) img = possible[0];
      }

      if (img) {
         console.log(`-> Found: ${img}`);
         await prisma.doctor.update({ where: { id: doc.id }, data: { photoUrl: img } });
      } else {
         console.log('-> STILL NO MATCH found for ' + doc.name);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

fixRemaining().finally(() => process.exit(0));
