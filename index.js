const el = id => document.getElementById(id);

const getRandomGif = async apiKey => {
  let resp = await fetch("https://axios-proxy.herokuapp.com/", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "url": "https://api.giphy.com/v1/gifs/random",
      "headers": {
        "apikey": apiKey
      }
    })
  });
  let json = await resp.json();
  return json.data.embed_url;
}

//standard app config
let appConfig = {
  name: 'Random Gif Custom Field',
  version: '1',
  configValues: [
    { name: 'giphyApiKey', label: 'Giphy API Key', type: 'string' }
  ],
  appComponents: [
    {
      location: agilityAppSDK.types.APP_LOCATION_CUSTOM_FIELD,
      label: 'Random Gif Custom Field',
      name: 'RandomGifCustomField',
      componentToRender: 'RandomGifCustomField'
    }
  ]
};

let componentToRender = agilityAppSDK.resolveAppComponent(appConfig)

//Determine what logic to run depending on the loaded component
if (componentToRender === 'AppConfig') {
  //AppConfig
  agilityAppSDK.setAppConfig(appConfig);
} else if (componentToRender === 'RandomGifCustomField') {
  //BasicCustomField
  let fieldContainer = document.getElementById('RandomGifCustomField');
  //show the HTML for this UI component
  fieldContainer.style.display = 'block';

  agilityAppSDK.initializeField({ containerRef: fieldContainer }).then(function (sdk) {
    //when communication is established with the CMS
    let imgElem = el("imgElem");
    let regenButt = el("regenButt");

    let giphyApiKey = sdk.configValues.giphyApiKey;


    imgElem.src = sdk.field.value;


    regenButt.onclick = () => {
      getRandomGif(giphyApiKey).then(url => {
        imgElem.src = url;
        sdk.updateFieldValue({ fieldValue: url });
      });
    }

  })
} 