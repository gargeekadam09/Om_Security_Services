import nodemailer from 'nodemailer'
import User from '../models/usermodel.mjs';
import bcrypt from 'bcryptjs' 

export const sendEmail = async({email, emailType, userId} :any) =>
{
    try{
       const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if(emailType ==="VERIFY"){
            await User.findByIdAnd Update(userId,
                {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})

        }else if (emailType === "RESET"){
            await User.findByIdAndUpdate(userId,
                {forgotPasswordToken: hashedToken,
                 verifyPasswordTokenExpiry: Date.now() + 3600000})
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: "maddison53@ethereal.email",
              pass: "jn7jnAPss4f63QBp6D",
            },
          });

          const mailOptions = {
            from: 'gargeekadam09@gmail.com', 
            to: email,
            subject: emailType === 'VERIFY' ? "Verify Your email" : "Reset your password",}
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${
                emailType === "VERIFY" ? "verify your email" : "reset your password"
            }<br> Copy and paste the link below in your browser.
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
          const mailResponse =  await transporter.sendMail(mailOptions)
          return mailResponse

    }catch(error:any){
          throw new Error (error.message)
    }
}
