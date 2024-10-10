const { MailerSend, EmailParams, Recipient } = require("mailersend");

const API_TOKEN = 'mlsn.5c838e5a29704500b80788fcd1efa2357a842385fe784580195501931d05b46e';

async function sendMail(id,imageLink,userEmail) {
    try {
        const mailersend = new MailerSend({
            apiKey: API_TOKEN,
            Authorization: `Bearer ${API_TOKEN}`,
        });
        
        const recipients = [new Recipient(userEmail, "Recipient")];
        
        //const sentFrom = new Sender("noreply@trial-3z0vklo201147qrx.mlsender.net", "Image Generator");

        const emailParams = new EmailParams()
            .setFrom({ email: "noreply@trial-3z0vklo201147qrx.mlsender.net", name: "Image Generator" })
            .setTo(recipients)
            .setReplyTo({ email: "noreply@trial-3z0vklo201147qrx.mlsender.net" })
            .setSubject(`Request ${id} image link`)
            .setText(imageLink);
        
        await mailersend.email.send(emailParams);
    
        console.log('Email has been send.');
    }
    catch(error) {
        //console.log('Mail sender error: ',error);
        throw new Error('Mail sender error: ',error);
    }
}
module.exports = {
    sendMail,
}

