import mongoose from "mongoose";
import dotenv from "dotenv";
import Resource from "../models/Resource.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const initializeResources = async () => {
    try {
        const halls = [];
        for (let i = 1; i <= 5; i++) {
            const seats = [];
            for (let j = 1; j <= 25; j++) {
                seats.push({ seatNumber: j });
            }
            halls.push({ hallName: `Hall ${i}`, seats });
        }

        await Resource.deleteMany(); // ✅ Clear existing resources
        await Resource.create({ halls });

        console.log("✅ Lecture halls initialized successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error initializing resources:", error);
    }
};

initializeResources();
