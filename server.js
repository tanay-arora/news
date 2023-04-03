
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

var cors = require("cors");
app.use(cors());

const axios = require('axios');

const apiKey = 'pub_188693219b5db8169608fa5b3cadf48fbbc4d';
const apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}`;

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, } = require('firebase-admin/firestore');

const serviceAccount = require('./news.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function deleteCollection(collectionPath) {
    const collectionRef = db.collection(collectionPath);
    const batchSize = 500;
  
    while (true) {
      const query = collectionRef.limit(batchSize);
      const snapshot = await query.get();
  
      if (snapshot.size === 0) {
        break;
      }
  
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        if(doc.data().source_id!="our-own"){
          batch.delete(doc.ref);
        }
      });
  
      await batch.commit();
    }
  
    console.log('Collection deleted successfully.');
  }

  async function getApiData(config){
    url = 
apiUrl+((config?.category!='')?`&category=${config.category}`:'')+((config?.query!='')?`&qInTitle=${config.query}`:'')+((config.world!=1)?`&country=in`:``)+`&language=${config.language}`;
    console.log('url: '+url)
    return await axios.get(url)
  }
  async function update_data(collection, cat, lang,world=0,query='') {
  
    const config = { language: lang, category: cat,world:world,query:query };
  
    try {
      const response = await getApiData(config);
      const data = response?.data?.results;

      if(data){
         await deleteCollection(collection);
      }
  
      await Promise.all(data.map(async (val) => {
        await db.collection(collection).doc().set(val);
      }));
    } catch (error) {
    }
  }
  
  async function update_all_data() {
    await update_data('india', 'top', 'en');
    await update_data('business', 'business', 'en');
    await update_data('science', 'science', 'en');
    await update_data('health', 'health', 'en');
    await update_data('sports', 'sports', 'en');
    await update_data('technology', 'technology', 'en');
    await update_data('world', '', 'en',1);
    await update_data('breaking_news', '', 'en');
    await update_data('education','','en',0,'education')
    await update_data('environment','environment','en');
    await update_data('hi_india', 'top', 'hi');
    await update_data('hi_business', 'business', 'hi');
    await update_data('hi_science', 'science', 'hi');
    await update_data('hi_health', 'health', 'hi');
    await update_data('hi_sports', 'sports', 'hi');
    await update_data('hi_technology', 'technology', 'hi');
    await update_data('hi_world', '', 'hi',1);
    await update_data('hi_breaking_news', '', 'hi');
    await update_data('hi_education','','hi',0,'education')
    await update_data('hi_environment','environment','hi');
  }
  
  app.get('/',(req,res)=>{
   update_all_data();  
    res.send("success");
  });

  app.listen(8000, () => {
  });
