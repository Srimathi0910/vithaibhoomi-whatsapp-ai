require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { getMediaURL, downloadImage } = require("./services/whatsappService");

const { uploadImage } = require("./services/cloudinaryService");

console.log(uploadImage);
console.log(uploadImage);

const extractCrop = require("./services/geminiService");

const saveCrop = require("./services/cropService");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());

// DEBUG ALL REQUESTS
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);

  next();
});

// ===============================
// VERIFY WEBHOOK
// ===============================

app.get("/webhook", (req, res) => {
  console.log("\n==============================");
  console.log("VERIFY REQUEST");
  console.log(req.query);
  console.log("==============================");

  const mode = req.query["hub.mode"];

  const token = req.query["hub.verify_token"];

  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFIED");

    return res.status(200).send(challenge);
  }

  console.log("❌ VERIFICATION FAILED");

  return res.sendStatus(403);
});

// ===============================
// RECEIVE WHATSAPP EVENTS
// ===============================

app.post("/webhook", async (req, res) => {
  console.log("\n================================");
  console.log("🔥 WHATSAPP WEBHOOK RECEIVED");
  console.log("================================");

  console.log(JSON.stringify(req.body, null, 2));

  // ALWAYS ACK META FIRST

  res.sendStatus(200);

  try {
    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      console.log("No user message event");

      return;
    }

    console.log("MESSAGE TYPE:", message.type);

    // ===========================
    // TEXT MESSAGE
    // ===========================

    if (message.type === "text") {
      console.log("TEXT:", message.text.body);

      return;
    }

    // ===========================
    // IMAGE MESSAGE
    // ===========================

    if (message.type === "image") {
      console.log("📷 IMAGE RECEIVED");

      const mediaId = message.image.id;

      console.log("MEDIA ID:", mediaId);

      // GET MEDIA URL

      const mediaURL = await getMediaURL(mediaId);

      console.log("MEDIA URL:", mediaURL);

      // DOWNLOAD IMAGE

      const buffer = await downloadImage(mediaURL);

      console.log("IMAGE DOWNLOADED");

      // CLOUDINARY UPLOAD

      const whatsappImageURL = await uploadImage(buffer);

      console.log("CLOUDINARY URL:", whatsappImageURL);

      // GEMINI EXTRACTION

      const crop = await extractCrop(buffer);

      console.log("GEMINI RESULT:", crop);

      // FIREBASE SAVE
      await saveCrop(crop, whatsappImageURL, message);

      console.log("✅ CROP SAVED TO FIREBASE");

      return;
    }

    console.log("Unsupported message type");
  } catch (error) {
    console.log("❌ PROCESSING ERROR");

    console.error(error);
  }
});

// ===============================
// SERVER START
// ===============================

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server running ${process.env.PORT || 8000}`);
});
