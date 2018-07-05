var nodemailer = require('nodemailer');

module.exports=function mail(email,message,subject){

    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secureConnection: true,
            port:587,
            transportMethod: 'SMTP',
            auth: {
              user: 'info@24klen.com',
              pass: 'india@123'
            }
          });
          
          let mailOptions = {
            from: '"Admin" <donotreply@24klen.com>',
            to: email,
            subject: subject,
            html: message
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



