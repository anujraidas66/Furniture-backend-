
import { Contact } from "../models/Contact.js";

export const createContact = async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({
      status: "error",
      message: "Subject and message are required"
    });
  }

  try {
    const contact = await Contact.create({
      user: req.userId,
      subject,
      message
    });

    return res.status(201).json({
      status: "success",
      message: "Message sent successfully",
      contact
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};


//  Get All Contacts (Admin)

export const getContacts = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Forbidden: Admin only"
    });
  }

  try {
    const contacts = await Contact.find()
      .populate("user", "username email")
      .populate("repliedBy", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      contacts
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};



// Get Single Contact (Admin)
export const getContact = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Forbidden: Admin only"
    });
  }

  try {
    const contact = await Contact.findById(req.id)
      .populate("user", "username email")
      .populate("repliedBy", "username email");

    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Contact not found"
      });
    }

    return res.status(200).json({
      status: "success",
      contact
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};



//  Reply to Contact (Admin)

export const replyContact = async (req, res) => {
  const { reply } = req.body;

  if (req.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Forbidden: Admin only"
    });
  }

  if (!reply) {
    return res.status(400).json({
      status: "error",
      message: "Reply message is required"
    });
  }

  try {
    const contact = await Contact.findById(req.id);

    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Contact not found"
      });
    }

    contact.reply = reply;
    contact.repliedAt = new Date();
    contact.repliedBy = req.userId;

    await contact.save();

    return res.status(200).json({
      status: "success",
      message: "Reply sent successfully",
      contact
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};


//  Delete Contact (Admin)

export const deleteContact = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Forbidden: Admin only"
    });
  }

  try {
    const contact = await Contact.findByIdAndDelete(req.id);

    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Contact not found"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Contact deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};
