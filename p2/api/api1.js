const axios = require('axios');

async function service1(word) {
  const api_url = 'https://api.api-ninjas.com/v1/dictionary';
  const API_KEY = '1/rgt/MVxRVRjFiTHgzHFA==zuVon7hpmTtr6xwI';

  try{
    const response = await axios.get(`${api_url}?word=${word}`, {
      headers: { 'X-Api-Key': API_KEY },
    });

    if(response.data) {
      console.log(response.data);
      const res = response.data;
      return res;
    }
    
  }catch(err) {
    console.log(err);
  }
}

module.exports = {
  service1,
};