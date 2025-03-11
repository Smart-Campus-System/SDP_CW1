import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js'; 

dotenv.config();

const modules = [
  { title: "Software Development Practice", description: "Advanced software development methodologies" },
  { title: "Patterns and Algorithms", description: "Design patterns and algorithm analysis" },
  { title: "Database Management", description: "SQL and NoSQL database management systems" },
  { title: "Mathematics and Statistics", description: "Math and stats for computer science" },
  { title: "Cloud Computing", description: "Introduction to cloud technologies and platforms" },
  { title: "Machine Learning", description: "Supervised and unsupervised learning techniques" },
  { title: "Software Quality Assurance", description: "Testing methodologies and quality control" },
  { title: "Networking", description: "Fundamentals of computer networking and security" },
  { title: "English", description: "Technical writing and communication skills" },
  { title: "Aesthetic", description: "Creative design and user experience principles" }
];

const addModules = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Module.deleteMany(); // Optional: Clears existing modules
    await Module.insertMany(modules);

    console.log("✅ Modules added successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error adding modules:", error);
    mongoose.connection.close();
  }
};

addModules();
