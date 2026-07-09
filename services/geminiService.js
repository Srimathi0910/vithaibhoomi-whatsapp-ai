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

Each row is a separate crop.

Extract ALL rows.

Return ONLY JSON array.

Example:

[
 {
  "name":"Tomato",
  "days":"90",
  "description":"Healthy",
  "status":"Ready"
 },
 {
  "name":"Rice",
  "days":"120",
  "description":"Healthy",
  "status":"Ready"
 }
]

Rules:
- Do not add markdown
- Do not add explanation
- Return only JSON
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


    console.log("GEMINI RAW:", text);


    return JSON.parse(text);

}


module.exports = extractCrop;
