const express = require("express");
const router = express.Router();
const Message = require('../model/Message');


//  Send a new message
router.post("/send", async (req, res) => {
  try {
    const { senderId, receiverId, productId, message } = req.body;

    if (!senderId || !receiverId || !productId || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new Message({ senderId, receiverId, productId, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
});


module.exports = router;
