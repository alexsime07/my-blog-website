const baseURL = "http://api.weatherapi.com/v1"
const weatherEndPoint = "/current.json?q="

const getWeather = async (location) => {
    const url = baseURL + weatherEndPoint + location;
      const response = await fetch(url, {
        method: 'POST',
        body: req.body, // string or object
        headers: {
          'Content-Type': 'application/json',
          'key': '7a529339c4a6443b8f0144547241002'
        }
      });
      const myJson = await response.json(); //extract JSON from the http response
      // do something with myJson
      console.log(myJson)

    }

  export {
    getWeather as weather 
  }