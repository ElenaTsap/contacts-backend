const contacts = require('../model/contacts')
const logs = require('../model/logs')
const multer = require('multer');
const path = require('path'); //this is a node.js thing
const fs = require('fs'); //this is the node.js file system

//multer settings goes here
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatars') //destination folder
    },
    filename: function (req, file, cb) {
        cb(null, 'a' + Date.now() + path.extname(file.originalname))//how the file will be named after upload
    }
})

const upload = multer({ storage: storage }).single('file');
//file is the same name as in the front end

exports.postContact = (req, res) => {
    //multer call goes here
    //this puts everything in the request
    upload(req, res, async (err) => {
        if (err) {
            console.log({err});
        }
        console.log('multer', req.body, 'file', req.file);

        console.log('controller',req.body);

        const {fullName, email, phone, address} = req.body;

/*         const newContact = new contacts ({fullName, email, phone, address, userId: req.userId});

        if (req.file) {
            newContact.avatar = req.file.filename;
        }  */

        //A quicker way to write this
        const newContact = new contacts ({...req.body, userId:req.userId})
        console.log(req.userId);
        if (req.file) {
            newContact.avatar = req.file.filename;
        }

        //instead of async await we can use .then()
        await newContact.save((err, docs) => {
            console.log( err);
            if (err) {
                res.send(err)
            } else {
                console.log(docs);
                /* res.send(`${req.body.fullName} is registered in your contact list!`) */
                res.send(docs)
                console.log('req.logId', req.logId)
                logs.findByIdAndUpdate(req.logId, {postData: JSON.stringify(docs)}, (err, docs) => console.log({err, docs}))
            }
        })
    })
}

//getting all data from DB
exports.getAll = (req, res) => {
    contacts.find({userId: req.userId}, (err, docs) => {
        if (err) {
            res.status(500).send({status: 'failed', message: err})
        } else {
            res.send({status: 'success', message: 'All data fetched!', data: docs});
            console.log('now we fetched');
        }
    })
}

exports.deleteContact = (req, res) => {
    const id = req.params.contactId;

    //this contactId come from the client - 
    contacts.findByIdAndDelete(id, (err, doc) => {
        if(err) { //there is a strict error like an authrisation error
            console.log(err);
            res.send({status: 'failed', message: err})
        } else if (doc === null) { //there is a logical error
            res.send({status: 'failed', message: 'there was no contact'})
        } else {
            console.log(doc);
            logs.findByIdAndUpdate(req.logId, {preData: JSON.stringify(doc)},(err, docs) => {})

            try {
                fs.unlinkSync('public/avatars/' + doc.avatar);
                console.log('successfully deleted public/avatars/' + doc.avatar);
            } catch (err) {
            // handle the error
            }

            res.send({
                status: 'success', 
                message: `${doc.fullName} is deleted from your contact list`,
                data: doc._id 
                //this is the id of the document comes from MongoDB
                //when you send stuff to the front end like doc._id we can also send the whole document
                //for safety reasons ans saving resources it is better exactly what is needed
            })
        }
    })
/*     res.send({status:'test', message:req.params.id}) */
}

exports.updateContact =  (req, res) => {
    upload( req, res, (err) => {
        if (err) {
            console.log('err',err);
        }
        console.log('multer', req.body, req.file);

        console.log(req.body);
        const contact = {...req.body }
        if (req.file) {
            contact.avatar = req.file.filename;
        }

    //1. contact._id find the id of the item to be updated
    //2. after
    //3. options of the process
    //upsert: true if there is no record match with this id and create a new record
    //new:true instead of original document you see in console updated document
    //runValidators: true run the same validators for updating as in the Schema

    //first way with findByIdAndUpdate
    //to create the logs we use this way - we will put in true:false like that it will return the previous format at the docs
    contacts.findByIdAndUpdate(contact._id, contact, { upsert: true, new: false, runValidators: true }, (err, doc) => {
            if(err) {
                console.log(err);
                res.send({status: 'failed', message: err})
            } else {
                if (contact.avatar) {
                    try {
                        fs.unlinkSync('public/avatars/' + doc.avatar);
                        console.log('successfully deleted public/avatars/' + doc.avatar);
                    } catch (err) {
                    // handle the error
                    }
                }
                
                console.log(doc);
                logs.findByIdAndUpdate(req.logId, {preData: JSON.stringify(doc), postData: JSON.stringify(contact)}, (err, docs) => {})
                res.send({status: 'success', message: 'contact updated successfully', data: contact})
            }
    });
})};

    //----------------------------------------------------
    //second way with save - first find it then save it

/*     const updatedContact = await contacts.findById(contact._id);  

    Object.keys(contact).forEach(key => updatedContact[key] = contact[key]);

    updatedContact.save((err, doc) => {
        if (err) {
            console.log(err);
            res.send({status: 'failed', message: err})
        } else {
            console.log(doc);
            res.send({status: 'success', message: 'contact updated successfully'})
        }
    })
} */

//second way more detailed with async await
/* const contacts = require('../model/contacts')

exports.postContact = async (req, res) => {
    const {fullName, email, phone, address} = req.body;
    console.log('from postContact',req.body);

    const newContact = new contacts ({
        fullName,
        email,
        phone,
        address
    });

    await newContact.save();

    res.send('contact added!');
} */

/* 
old way before needing validations and error catching
    //instead of async await we can use .then()
    await newContact.save().then(`${req.body.fullName} is registered in your contact list!`)

    res.send('contact added!');

*/


