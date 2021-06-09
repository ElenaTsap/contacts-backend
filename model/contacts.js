const mongoose = require('mongoose');

//using same naming with front end is more convenient but not a must
const contacts = new mongoose.Schema({
            fullName: {
                type: String,
                required: true
            }, 
            email: {
                type: String,
                match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] //validation for correct format in email
            },  
            phone: {
                type: String, 
                minLength: [5, 'too little digits for a phone  number'],
                maxLength: [13, 'too many digits for a phone  number'] //validation for the length  of the input
            },
            address: String,
            avatar: String,
            userId: String
}, {collection: 'Contacts'})

//connect my instance into collection contacts in mongoose
module.exports = mongoose.model('Contacts', contacts)