

// import express from "express";
// import multer from "multer";
// import fs from "fs";
// import axios from "axios";
// import FormData from "form-data";
// import dotenv from 'dotenv';

// dotenv.config();

// const router = express.Router();

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, "uploads/"),
//     filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });
// const FLASK_API = process.env.FLASK_API_URL

// router.post("/", upload.single("image"), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: "No Image was uploaded" });
//         }

//         const formData = new FormData();
//         formData.append("image", fs.createReadStream(req.file.path));

//         const flaskResponse = await axios.post(
//             `${FLASK_API}`,
//             formData,
//             {
//                 headers: formData.getHeaders(),
//                 maxContentLength: Infinity,
//                 maxBodyLength: Infinity,
//                 timeout: 60000,
//             }
//         );

//         console.log(FLASK_API);
//         const { predicted_class, confidence, details } = flaskResponse.data;

//         fs.unlink(filePath, (err) => {
//             if (err) console.error("❌ Error deleting file:", err);
//             else console.log("✅ Deleted:", filePath);
//         }); // delete image after prediction
//         console.log("This Happen");

//         // Send full info back to frontend
//         return res.json({
//             success: true,
//             predicted_class,
//             confidence,
//             details,
//         });

//     } catch (error) {
//         console.error("🔥 Error connecting to Flask API:", error.message);
//         if (error.response) {
//             console.error("Flask responded with:", error.response.data);
//         }
//         return res.status(500).json({ error: "Server error" });
//     }
// });

// export default router;

import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(process.cwd(), "uploads")),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const FLASK_API = process.env.FLASK_API_URL;

router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No Image was uploaded" });
        }

        const filePath = path.resolve(req.file.path);
        const formData = new FormData();
        formData.append("image", fs.createReadStream(filePath));

        const flaskResponse = await axios.post(FLASK_API, formData, {
            headers: formData.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 60000,
        });

        const { predicted_class, confidence, details } = flaskResponse.data;

        // Delete after ensuring request completes
        fs.unlink(filePath, (err) => {
            if (err) console.error("❌ Error deleting file:", err);
            else console.log("✅ Deleted:", filePath);
        });

        return res.json({ success: true, predicted_class, confidence, details });
    } catch (error) {
        console.error("🔥 Error connecting to Flask API:", error.message);
        if (error.response) console.error("Flask responded with:", error.response.data);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;
