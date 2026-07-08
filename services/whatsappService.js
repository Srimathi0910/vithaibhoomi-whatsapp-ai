const axios=require("axios");


async function getMediaURL(mediaId){


const response =
await axios.get(

`https://graph.facebook.com/v20.0/${mediaId}`,

{
headers:{
Authorization:
`Bearer ${process.env.WHATSAPP_TOKEN}`
}
}

);


return response.data.url;


}



async function downloadImage(url){


const response =
await axios.get(
url,
{
headers:{
Authorization:
`Bearer ${process.env.WHATSAPP_TOKEN}`
},

responseType:"arraybuffer"

});


return Buffer.from(
response.data
);


}


module.exports={
getMediaURL,
downloadImage
};
