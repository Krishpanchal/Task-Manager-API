const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  const sendWelcomeEmail = (email , name) => {
      sgMail.send({
        to: email, 
        from: 'krishpanchal582@gmail.com', 
        subject: 'Thanks for Signing Up!',
        text: `Welcome to the app , ${name}. Let me know how you get along with the app`,
      })
      .then(() => {
        console.log("Email Sent");
      })
      .catch((e) => {
        console.log(e);
      })
  }


  const sendCancelEmail = async(email , name) => {
    try {
      await sgMail.send({
        to: email, 
        from: 'krishpanchal582@gmail.com', 
        subject: 'GoodyBye!',
        text: `GooodBye ${name}.You can Signup again`,
      })
      console.log("Cancel Email Sent");
    } catch (error) {
      console.log(error);
    }
    
}

  module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
  }
