const axios = require('axios');


async function service2() {
  const api_url = 'https://api.api-ninjas.com/v1/randomword';
  const API_KEY = '1/rgt/MVxRVRjFiTHgzHFA==zuVon7hpmTtr6xwI';


  try {
    const response = await axios.get(api_url, {
      headers: { 'X-Api-Key': API_KEY }
    });

    if (response.data) {
      console.log('service 2:',response.data);
      const res = response.data.word[0];
      return res;
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  service2,
};
// service2()