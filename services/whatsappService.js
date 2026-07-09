const axios = require("axios");


// Get WhatsApp media URL
async function getMediaURL(mediaId) {

    const response = await axios.get(
        `https://graph.facebook.com/v20.0/${mediaId}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
            }
        }
    );

    return response.data.url;
}



// Download image
async function downloadImage(url) {

    const response = await axios.get(
        url,
        {
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
            },
            responseType: "arraybuffer"
        }
    );

    return Buffer.from(response.data);

}



// Send WhatsApp text message
async function sendTextMessage(to, message) {

    await axios.post(
        `https://graph.facebook.com/v20.0/${process.env.PHONE_NUMBER_ID}/messages`,
        {
            messaging_product: "whatsapp",
            to: to,
            type: "text",
            text: {
                body: message
            }
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );

}


module.exports = {
    getMediaURL,
    downloadImage,
    sendTextMessage
};
