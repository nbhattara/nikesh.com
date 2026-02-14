import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields: name, email, or message" });
  }

  // Create transporter with explicit Gmail SMTP settings
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,                    // Use SSL/TLS on port 465
    auth: {
      user: process.env.GMAIL_USER,           // your.email@gmail.com
      pass: process.env.GMAIL_APP_PASSWORD,   // 16-char App Password (NOT regular password)
    },
    // Optional: increase timeout if Gmail responds slowly
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  try {
    // Optional: verify connection (useful during debugging)
    // await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,             // where you receive messages
      replyTo: email,                         // lets you reply directly to sender
      subject: `New Message from ${name}`,
      text: message,                          // plain-text fallback
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    console.log("Message sent:", info.messageId);

    return res.status(200).json({ 
      success: true,
      message: "Message sent successfully" 
    });

  } catch (err) {
    console.error("Email sending error:", err);

    return res.status(500).json({ 
      error: "Failed to send message", 
      details: err.message 
    });
  }
}