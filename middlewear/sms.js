var request = require('request');

module.exports=function generateSms(phone,message){
    
        return new Promise((resolve, reject) => {
           
            if (phone === null) {
                return reject('Invalid Phone Number');
            } else if (phone.length === 10) {
                // console.log(phone,'/',message);
                request({
                    url: `http://bhashsms.com/api/sendmsg.php?user=ClotheSpa&pass=ClotheSpa&sender=CltSpa&phone=${phone}&text=${message}&priority=ndnd&stype=normal`,
                    method: 'post',
                }, function (error, response, data) {
                    if (error) {
                        return reject(err);
                    } else {
                       
                        return resolve(data);
                    }
                });
            } else {
                return reject('Invalid Phone Number');
            }
        })
    };




