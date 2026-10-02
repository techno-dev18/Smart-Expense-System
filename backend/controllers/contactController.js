const nodemailer = require("nodemailer");

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        message: "Please provide all required fields.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (
      !cleanName ||
      !cleanEmail ||
      !cleanSubject ||
      !cleanMessage
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    if (
      cleanName.length > 100 ||
      cleanEmail.length > 254 ||
      cleanSubject.length > 150 ||
      cleanMessage.length > 5000
    ) {
      return res.status(400).json({
        message: "One or more fields exceed the allowed length.",
      });
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    // Ensure SMTP credentials are configured
    const requiredEnv = [
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_USER",
      "SMTP_PASS",
      "CONTACT_EMAIL",
    ];

    const missingConfig = requiredEnv.some(
      (key) => !process.env[key]
    );

    if (missingConfig) {
      console.error("Contact email configuration is incomplete.");

      return res.status(500).json({
        message: "Email service is not configured. Please try again later.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: {
        name: "SmartExpense Contact Form",
        address: process.env.SMTP_USER,
      },

      to: process.env.CONTACT_EMAIL,

      // Allows you to reply directly to the person who contacted you.
      replyTo: {
        name: cleanName,
        address: cleanEmail,
      },

      subject: `[SmartExpense Contact] ${cleanSubject}`,

      text: [
        "New message from the SmartExpense contact form",
        "",
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Subject: ${cleanSubject}`,
        "",
        "Message:",
        cleanMessage,
      ].join("\n"),
    });

    return res.status(200).json({
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact email error:", error.message);

    return res.status(500).json({
      message: "We couldn't send your message right now. Please try again later.",
    });
  }
};

module.exports = { sendContactMessage };