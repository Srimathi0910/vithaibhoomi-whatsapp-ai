const genAI =
require("../config/gemini");


async function extractCrop(buffer){


const model =
genAI.getGenerativeModel({

model:
"gemini-2.0-flash"

});



const imageBase64 =
buffer.toString("base64");



const result =
await model.generateContent([


{
text:
`
You are crop data extractor.

Read the table in image.

Return only JSON.

Format:

{
"name":"",
"days":"",
"status":"",
"description":""
}

`
},


{

inlineData:{

mimeType:"image/jpeg",

data:imageBase64

}

}


]);



const text =
result.response.text();



return JSON.parse(text);



}



module.exports=extractCrop;
