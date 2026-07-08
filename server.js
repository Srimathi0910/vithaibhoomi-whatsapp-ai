require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
    getMediaURL,
    downloadImage
} = require("./services/whatsappService");

const uploadImage =
    require("./services/cloudinaryService");

const extractCrop =
    require("./services/geminiService");

const saveCrop =
    require("./services/cropService");


const app = express();


app.use(cors());

app.use(express.json());


// =================================
// VERIFY WHATSAPP WEBHOOK
// =================================

app.get("/webhook", (req, res) => {


    console.log("\n==============================");
    console.log("VERIFY REQUEST");
    console.log(req.query);
    console.log("==============================");


    const mode =
        req.query["hub.mode"];

    const token =
        req.query["hub.verify_token"];

    const challenge =
        req.query["hub.challenge"];



    console.log("MODE:", mode);
    console.log("TOKEN:", token);
    console.log(
        "ENV TOKEN:",
        process.env.VERIFY_TOKEN
    );



    if (
        mode === "subscribe" &&
        token === process.env.VERIFY_TOKEN
    ) {

        console.log("✅ VERIFIED");

        return res
            .status(200)
            .send(challenge);

    }


    console.log("❌ FAILED");

    return res.sendStatus(403);


});




// =================================
// RECEIVE WHATSAPP MESSAGES
// =================================

app.post("/webhook", async (req, res) => {


    console.log("\n==============================");
    console.log("🔥 NEW WHATSAPP WEBHOOK");
    console.log("==============================");

    console.log(
        JSON.stringify(req.body, null, 2)
    );


    try {


        const message =

            req.body.entry?.[0]
                ?.changes?.[0]
                ?.value
                ?.messages?.[0];



        if (!message) {

            console.log(
                "No message found"
            );

            return res.sendStatus(200);

        }



        console.log(
            "MESSAGE TYPE:",
            message.type
        );



        // IMAGE MESSAGE

        if (message.type === "image") {


            console.log(
                "📷 IMAGE RECEIVED"
            );


            const mediaId =
                message.image.id;



            console.log(
                "MEDIA ID:",
                mediaId
            );



            // Get WhatsApp media URL

            const url =
                await getMediaURL(mediaId);



            console.log(
                "MEDIA URL RECEIVED"
            );



            // Download image

            const buffer =
                await downloadImage(url);



            console.log(
                "IMAGE DOWNLOADED"
            );



            // Upload Cloudinary

            const imageURL =
                await uploadImage(buffer);



            console.log(
                "CLOUDINARY URL:",
                imageURL
            );



            // Gemini extraction

            const crop =
                await extractCrop(buffer);



            console.log(
                "GEMINI RESULT:",
                crop
            );



            // Save Firebase

            await saveCrop(
                crop,
                imageURL
            );


            console.log(
                "✅ SAVED TO FIREBASE"
            );


        }


        return res.sendStatus(200);



    }

    catch(error){


        console.log(
            "WEBHOOK ERROR:",
            error
        );


        return res.sendStatus(500);


    }


});





// =================================
// SERVER START
// =================================


app.listen(
    process.env.PORT,
    () => {

        console.log(
            `Server running ${process.env.PORT}`
        );

    }
);
