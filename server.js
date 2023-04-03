
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

const serviceAccount = {
  "type": "service_account",
  "project_id": "deshkamasla-34259",
  "private_key_id": "f454580f71a956719996b66dd97abe1e6d71d7ab",
  "private_key": "-----BEGIN PRIVATE 
KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCqdet68MXwnIru\nufE3uODcl1TyJfczGywxFfi1jInf5xnQYCd02xfby0sde/88pti5cOM5W4U833N2\noggN+NA4UDZYlnGbEO8WPIQkYcPMjHT4G2VxsDmYnn+AyEZcqh9T3OtTSi/7MMW7\n7i/cHqBCingSeavA3XTtLbhZyi24C+MFeQUv9IAqV5gq6H000m8fn5ikbvb093gX\nNHMfBiSrlzjsJC0jtW4C5Ye1xZreEp0IPHPVRHGXZK++L+gRzzKjoD9XmJyt4BtJ\n8g3lX22GtAsS6JCFmLJU/q36pqjYEHuBUTwB48fgG7EAxrTQlTu8tov0AhSwzuPx\n/WvLD7oNAgMBAAECggEAE3uP0wji7snNnVR2TAKe/Md1J4oMU3SHHAMhXoq2FXfB\n/Q2IZPRHqVD2gGO0O/fr7GIJLnyV4Wu+tC/30LUAA3ezhnOHf4wzb2yyQ8BC00W4\ndsUW1qQoKRfwhcUeOageFYU6BlaD3mdoKj8ijDuZ4JEYATCT32LQYu1nVSflCtRt\nBbrbPqjaeZSQiP386ZSvLo5wioAkCGQI+VTPbLrpbFe+kCzFr+wMOWGT8yqKoCi/\nPFTQCIJDKwhtd9ElVm1iSbpEzR5PFiGWw1Vl2aZDrCe/K1VAfaqXW9QmLFP/9oIp\nRyeFRLDPAqmfipj00q5foLMx4Ay7DGufkSwez6BVsQKBgQDk8vbxL8NukJWF8oeR\nm7AKOCjL81nhI96xPp2Y4eFpaI4bmMzPrTj2WcZRhcnf1zLGQQJAymjwsESydwrM\nIt9QrhREAXD0ix+3/zf+MldqWlqExIlu/fLiyIpVA+OwsIho9oVDuxY/lQYYHrH+\n/0+7J5Ih50HifO6y4N1Pl1LclQKBgQC+mdoIVDHIKEX0bvDXYV8z1dvkBPIR9Cjg\n6QkdAGIOY0aIfTaYK/BfWK1KJ8OeouUfc7/RSUm78y+gCSUJFRrRdxMDPDYJw2jq\nmYy4Qb+8I87tZa7JHiRDbV7eEMf7viBnqlTiT5VoUnHiWva0s7gWABHjUTPy78GA\nYXfgVVQRmQKBgEhbIQAIgFMpDphOldnGwlP4e6w5NGaa135cs6HlgT+283J1UAUy\nUZZJuQt6pNpBQKK3WObxEUk/6/Ya+SaavsjYuz7i1bfzYAredeu4LThHZeQf2O9j\nAqf5iP5lREhLAlFp16QYNGfTySFGUiqstZ4IW36rf378zNNrjYXh5SYhAoGBAI7Y\nBwuO7fAwHp1eN6lzFEJo2G8/NZw2/BvzCh1uGA7oYAgSr0PESlVqxBR7UKQnOMgl\nm3BiGJx/WQX7VIJGCt9I+jrGeUk/5fVMNqYwwF1kCMTqG+Amcs8FvL94nCgTCX4n\nrY4eTr7sauVVfudWeXQjgUR3qxM6lC5+3bSGvoahAoGBAN6wGO1q1Atr3JPgxJGW\ntbTB1bg6HlkcqtJ5eEfDPAECctclV6drFLcwDqpypF70isr5lS/ZMJ/rnBGdZrD/\nPQZ3laSDEjjnSYi/p6xxkd9DdX06c//lr53itfyxthi/fZhYZaV1PPCDES7I66YB\nm2QM6quJIuJ5zX0zlfEb+eeY\n-----END 
PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-euehh@deshkamasla-34259.iam.gserviceaccount.com",
  "client_id": "107656009212687224931",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": 
"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-euehh%40deshkamasla-34259.iam.gserviceaccount.com"
}


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
