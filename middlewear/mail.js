var nodemailer = require('nodemailer');

module.exports=function mail(email,message,subject,attachment){

    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secureConnection: true,
            port:587,
            transportMethod: 'SMTP',
            auth: {
              user: 'info@24klen.com',
              pass: 'india@123'
            }
          });
          
          var mailOptions = {
            from: ' "Admin"donotreply@24klen.com',
            to: email,
            subject: subject,
            text: message,
            // attachments: [{'filename': 'attachment.txt', 'content': data}]
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              return reject(error);
            } else {
              return resolve (info.response);
            }
          }); 

    })
}



