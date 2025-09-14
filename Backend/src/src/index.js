const express = require('express');
const path = require('path');
const bcrypt = require("bcryptjs");
const app = express();
const { collection, Appointment } = require('./config');
const session = require('express-session');

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../../Frontend/public')));
app.set('views', path.join(__dirname, '../views'));

app.get("/", (req, res) => {
  const user = req.session.user;
  res.render("index", {
    userName: user ? user.fullName : null
  });
});

function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/loginpage');
}

app.get("/loginpage", (req, res) => {
  res.render("loginpage");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/about", (req, res) => {
  const user = req.session.user;
  res.render("about", {
    userName: user ? user.fullName : null
  });
});

app.get("/healthTips", (req, res) => {
  const user = req.session.user;
  res.render("healthTips", {
    userName: user ? user.fullName : null
  });
});

app.get("/chatbot", (req, res) => {
  const user = req.session.user;
  res.render("chatbot", {
    userName: user ? user.fullName : null
  });
});

app.get("/appointment", isAuthenticated, (req, res) => {
  res.render("appointment");
});

app.get("/articles", (req, res) => {
  const userName = req.session.userName || null;
  res.render("articles", { userName });
});

app.get("/coronaVirusMyths", (req, res) => {
  const userName = req.session.userName || null;
  res.render("coronaVirusMyths", { userName });
});

app.get("/diet", (req, res) => {
  const userName = req.session.userName || null;
  res.render("diet", { userName });
});

app.get("/yogaaadvice", (req, res) => {
  const userName = req.session.userName || null;
  res.render("yogaaadvice", { userName });
});

app.get("/GenralPhysician", (req, res) => {
  const userName = req.session.userName || null;
  res.render("GenralPhysician", { userName });
});

app.get("/Cardiologist", (req, res) => {
  const userName = req.session.userName || null;
  res.render("Cardiologist", { userName });
});

app.get("/Gynocologist", (req, res) => {
  const userName = req.session.userName || null;
  res.render("Gynocologist", { userName });
});

app.get("/psychiatrist", (req, res) => {
  const userName = req.session.userName || null;
  res.render("psychiatrist", { userName });
});

app.get("/Dermatologist", (req, res) => {
  const userName = req.session.userName || null;
  res.render("Dermatologist", { userName });
});

app.get("/Gastoenterologist", (req, res) => {
  const userName = req.session.userName || null;
  res.render("Gastoenterologist", { userName });
});

app.get("/Neurologists", (req, res) => {
  const userName = req.session.userName || null;
  res.render("Neurologists", { userName });
});

app.get("/Sexologist", (req, res) => {
  const userName = req.session.userName || null;
  res.render("Sexologist", { userName });
});

app.get("/Pediatricians", (req, res) => {
  const userName = req.session.userName || null;
  res.render("Pediatricians", { userName });
});

app.get("/Surgeon", (req, res) => {
  const userName = req.session.userName || null;
  res.render("Surgeon", { userName });
});

app.get("/Orthopaedic", (req, res) => {
  const userName = req.session.userName || null;
  res.render("Orthopaedic", { userName });
});

app.get("/Dentist", (req, res) => {
  const userName = req.session.userName || null;
  res.render("Dentist", { userName });
});

app.get("/specialities", (req, res) => {
  const user = req.session.user;
  res.render("specialities", {
    userName: user ? user.fullName : null
  });
});

app.get("/madicare", (req, res) => {
  const user = req.session.user;
  res.render("madicare", {
    userName: user ? user.fullName : null
  });
});

app.get("/bloodpressure", (req, res) => {
  const user = req.session.user;
  res.render("bloodpressure", {
    userName: user ? user.fullName : null
  });
});

app.get("/BuildImmunity", (req, res) => {
  const user = req.session.user;
  res.render("BuildImmunity", {
    userName: user ? user.fullName : null
  });
});

app.get("/sexual", (req, res) => {
  const user = req.session.user;
  res.render("sexual", {
    userName: user ? user.fullName : null
  });
});

app.get("/question", (req, res) => {
  const user = req.session.user;
  res.render("question", {
    userName: user ? user.fullName : null
  });
});

app.post('/signup', async (req, res) => {
  if (!req.body.fullName || !req.body.email || !req.body.phoneNumber || !req.body.password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const { fullName, email, phoneNumber, password } = req.body;
    const existingUser = await collection.findOne({ $or: [{ email }, { phoneNumber }] });

    if (existingUser) {
      return res.render("signup", {
        errorMessage: "Email or Phone Number already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new collection({ fullName, email, phoneNumber, password: hashedPassword });
    await newUser.save();

    res.redirect("/loginpage");
  } catch (error) {
    if (error.code === 11000) {
      return res.render("signup", {
        errorMessage: "Duplicate email or phone number found"
      });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/loginpage', async (req, res) => {
  const { email, password } = req.body;
  const user = await collection.findOne({ email });

  if (!user) {
    return res.render("loginpage", {
      errorMessage: "No user found with this email."
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render("loginpage", {
      errorMessage: "Incorrect password."
    });
  }

  req.session.user = user;
  res.redirect("/");
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

app.post("/appointment", isAuthenticated, async (req, res) => {
  const { name, age, number, date, email, time, gender, symptoms, drname } = req.body;

  const newAppointment = new Appointment({
    patientName: name,
    age,
    phoneNumber: number,
    date,
    email,
    time,
    gender,
    symptoms: {
      fever: symptoms.includes('fever'),
      headache: symptoms.includes('Headache'),
      cold: symptoms.includes('cold'),
      others: symptoms.includes('other')
    },
    doctorName: drname
  });

  try {
    await newAppointment.save();
    res.render("appointment", {
      successMessage: "Appointment booked successfully!"
    });
  } catch (error) {
    res.status(500).render("appointment", {
      errorMessage: "Error booking appointment."
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
