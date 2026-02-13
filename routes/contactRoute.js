import express from "express";
import { createContact, getContacts, getContact, replyContact, deleteContact } from "../controllers/contactController.js";
import { checkId } from "../middleware/checkId.js";
import { checkUser, checkAdmin } from "../middleware/checkUser.js";
import { notAllowed } from "../utils/notAllowed.js";

const router = express.Router();

// ✅ All contacts
router.route('/api/contacts')
  .get(checkUser, checkAdmin, getContacts)
  .post(checkUser, createContact)
  .all(notAllowed);

// ✅ Single contact
router.route('/api/contacts/:id')
  .get(checkUser, checkId, getContact)
  .delete(checkUser, checkId, checkAdmin, deleteContact)
  .all(notAllowed);

// ✅ Reply contact
router.patch('/api/contacts/:id/reply', checkUser, checkAdmin, checkId, replyContact);

export default router;
