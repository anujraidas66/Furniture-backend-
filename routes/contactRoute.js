import express from "express";

import { createContact, 
deleteContact, getContact, getContacts, 
replyContact } from "../controllers/contactController.js";
import { notAllowed } from "../utils/notAllowed.js";
import { checkId } from "../middleware/checkId.js";
import { checkUser } from "../middleware/checkUser.js";

const router = express.Router();

router.route('/api/contacts')
.get(checkUser, getContacts)
.post(checkUser, createContact)
.all(notAllowed);


router.route('/api/contacts/:id')
.get(checkUser, checkId, getContact)
.patch(checkUser, checkId, replyContact)
.delete(checkUser, checkId, deleteContact)
.all(notAllowed);

// router.get("/contacts/:id", checkUser, checkId, getContact);
// router.patch("/contacts/:id/reply", checkUser, checkId, replyContact);
// router.delete("/contacts/:id", checkUser, checkId, deleteContact);

export default router;
