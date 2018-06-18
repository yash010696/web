var nodemailer = require('nodemailer');

module.exports=function mail(email,message,subject){

    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secureConnection: true,
            port:587,
            transportMethod: 'SMTP',
            auth: {
              user: 'sunmit.testing@gmail.com',
              pass: 'Sunmit123@'
            }
          });
          
          var mailOptions = {
            from: ' "Admin" <donotreply@24klen.com>',
            to: email,
            subject: subject,
            text: message
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



