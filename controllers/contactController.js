import Contact from "../models/Contact.js";

//create a contact (logged in user)
export const createContact = async (req, res) => {
    const {subject, message} = req.body ?? {};
    try {
        
        if(!subject || !message) return res.status(400).json({
            status: 'error',
            data: 'Please provide subject and message'
        })

        const contact = await Contact.create({
            user: req.userId,
            subject,
            message 
        });
        
        return res.status(201).json({
            status: 'success',
            data: contact
        });

    } catch (err) {
        return res.status(500).json({ 
            status: 'error', 
            data: err.message });
    }
}


// get all conatact of logged in user
export const getMyContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({user: req.userId}).sort({createdAt: -1});
        return res.status(200).json({
            status: 'success',
            data: contacts
        });

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            data: err.message
        })
        
    }
}

//get single coantact (for user or admin)
export const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.id).populate('user', 'username email');
        
        if(req.role !== 'admin' && contact.user.id.toString() !==req.userId){
            return res.status(401).json({
                status: 'error',
                data: 'Unauthorized'
            })
        }
        
        return res.status(200).json({
            status: 'success',
            data: contact
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            data: err.message
        })
    }
}


//pending update cotact (admmin only);
//pending delete contact (admin only)
//get all contacts (admin only)
