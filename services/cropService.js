const db = require("../config/firebase");


async function saveCrop(
    data,
    whatsappImageURL,
    message
) {


    await db
    .collection("crops")
    .add({

        // Gemini extracted crop details
        name:
        data.name || "",


        days:
        data.days || "",


        status:
        data.status || "",


        description:
        data.description || "",







        // Original WhatsApp image URL
        whatsappImageURL:
        whatsappImageURL,



        // WhatsApp details
        whatsappUser:
        message.from,


        whatsappMessageId:
        message.id,


        createdAt:
        new Date(),


        updatedAt:
        new Date(),


        isActive:
        true

    });


    console.log("Firebase crop saved");

}



module.exports = saveCrop;
