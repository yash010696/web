var request = require('request');

module.exports=function generateSms(phone,message){
    
        return new Promise((resolve, reject) => {
           
            if (phone === null) {
                return reject('Invalid Phone Number');
            } else if (phone.length === 10) {
                console.log(phone,'/',message);
                request({
                    url: `http://bhashsms.com/api/sendmsg.php?user=laundryscience&pass=24klen123&sender=KLENLS&phone=${phone}&text=${message}&priority=ndnd&stype=normal`,
                    method: 'post',
                }, function (err, response, data) {
                    if (err) {
                        return reject(err);
                    } else {
                        console.log('/////',data , '///////////statusCode:',response.statusCode , '///////////err:',err);
                        return resolve(data);
                    }
                });
            } else {
                return reject('Invalid Phone Number');
            }
        })
    };




