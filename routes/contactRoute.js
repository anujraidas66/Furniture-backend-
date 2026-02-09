import express from 'express';
import { checkId } from '../middleware/checkId.js';
import { checkUser } from '../middleware/checkUser.js';
import { createContact, getContactById, getMyContacts } from '../controllers/contactController.js';
import { notAllowed } from '../utils/notAllowed.js';


const router = express.Router();

// User routes
router.route('/')
  .post(checkUser, createContact)
  .get(checkUser, getMyContacts)
  .all(notAllowed);


router.route('/api/contact/:id')
.get(checkId,checkUser,getContactById).all(notAllowed);


// // Admin routes
// router.get('/', checkUser, getAllContacts);          // Admin: get all contacts
// router.put('/:id/status', checkUser, updateContactStatus); // Admin: update status
// router.delete('/:id', checkUser, deleteContact);    // Admin: delete contact

export default router;
