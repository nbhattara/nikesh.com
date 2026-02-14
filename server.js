const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = 3000;

/* ===============================
   MIDDLEWARE
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   API ROUTE
================================ */
app.post("/api/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: message,
      html: `
        <h3>New Contact Form</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message.replace(/\n/g, "<br>")}</p>
      `
    });

    res.status(200).json({ success: true, message: "Message sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email failed to send" });
  }
});

/* ===============================
   STATIC FILES
================================ */
app.use(express.static(path.join(__dirname, "public")));

/* ===============================
   FALLBACK (SPA SUPPORT)
================================ */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ===============================
   START SERVER
================================ */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
