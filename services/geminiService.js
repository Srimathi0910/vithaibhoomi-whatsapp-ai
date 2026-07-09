const genAI = require("../config/gemini");


async function extractCrop(buffer) {


    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });



    const imageBase64 = buffer.toString("base64");



    const result = await model.generateContent([

        {
            text: `
You are a crop table data extractor.

The image contains a table.

Each row represents one crop.

Extract every row.

Return ONLY JSON array.

Format:

[
 {
  "name":"",
  "days":"",
  "description":"",
  "status":""
 }
]

Do not add markdown.
Do not add explanation.

`
        },

        {
            inlineData:{
                mimeType:"image/jpeg",
                data:imageBase64
            }
        }


    ]);



    let text = result.response.text();



    text = text
        .replace(/```json/gi,"")
        .replace(/```/g,"")
        .trim();



    console.log("GEMINI RAW:",text);



    return JSON.parse(text);



}



module.exports = extractCrop;
