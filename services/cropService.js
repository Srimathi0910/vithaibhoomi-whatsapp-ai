const db = require("../config/firebase");


async function saveCrop(crops, whatsappImageURL, message){


    for(const crop of crops){

        await db
        .collection("crops")
        .add({

            name: crop.name,

            days: crop.days,

            description: crop.description,

            status: crop.status,


            // actual crop image
            imageURL: null,


            // whatsapp original table image
            whatsappImageURL: whatsappImageURL,


            sender: message.from,


            createdAt:new Date(),

            updatedAt:new Date()

        });


    }


}


module.exports = saveCrop;
