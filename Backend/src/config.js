const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb+srv://kusyapk:rpOtmQGhbXFM86cn@health.rsloxmw.mongodb.net/?retryWrites=true&w=majority&appName=Health")
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

// User Schema (For Login/Signup)
const loginSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/, 'Password must contain uppercase, lowercase letters, and special characters']
    }
}, { timestamps: true });

const collection = mongoose.model("Authentication", loginSchema);

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    symptoms: {
        fever: Boolean,
        headache: Boolean,
        cold: Boolean,
        others: Boolean
    },
    doctorName: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

// Export both models
module.exports = { collection, Appointment };
