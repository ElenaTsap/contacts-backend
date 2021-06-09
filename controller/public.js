const contacts = require('../model/contacts');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

exports.about = (req, res) => {
    contacts.find({}, (err, docs) =>{
        if (err) {
            res.render('about', {testData: `There is an error!`})
        } else {
            res.render('about', {testData: docs})
        }
    })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'attachments') //destination folder
    },
    filename: function (req, file, cb) {
        cb(null, 'f' +'-'+ Date.now() + path.extname(file.originalname))//how the file will be named after upload
    }
})

const upload = multer({ storage: storage }).array('attachments');

exports.getContact =  (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
        }
        console.log(req.body, req.files);


    try {
        console.log(req.body);
        //create a test account to test our 
        //let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
    /*     let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
            },
        }); */

        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'frufrujoe@gmail.com',
                pass: process.env.GMAIL
            }
        });

    /*     console.log({
            user: testAccount.user, 
            pass: testAccount.pass
        }); */


    // send mail with defined transport object
        let info = await transporter.sendMail({
                //gmail is not allowing you to use another email
                // some other mail providers allow it
                from: '"Elenas Backend" <foo@example.com>', // sender address
                to: "elenatsapaki@gmail.com", // list of receivers
                subject: "Ticket from" + req.body.fullName, // Subject line
                text: req.body.message, // plain text body
                html: `<b>${req.body.message}</b>`, // html body
                attachments: req.files ? req.files.map(file => {return {path:file.path}}) : []
/*                 attachments: [
                    {   // file on disk as an attachment
                        filename: 'AnyName.jpeg',
                        path: 'attachments/f1623223818456.jpeg' // stream this file
                    },
                ] */
            });

            console.log("Message sent: %s", info.messageId);
            res.json({status: 'success', message: 'Congrats!'})
    } catch (err) {
        console.log(err);
        res.status(401).json({status: 'failed', message: err})
    }
    // Preview only available when sending through an Ethereal account
    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
}
