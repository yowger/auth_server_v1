const nodemailer = require("nodemailer")
const MY_EMAIL = process.env.MY_EMAIL
const MY_PASSWORD = process.env.MY_PASSWORD

async function sendEmail(recipientEmail, subject, message) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: MY_EMAIL,
                pass: MY_PASSWORD,
            },
        })

        const mailOptions = {
            from: process.env.MY_EMAIL,
            to: recipientEmail,
            subject: subject,
            html: message,
        }

        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent successfully!", info.messageId)
        return true
    } catch (error) {
        console.log("Error occurred:", error.message)
        return false
    }
}

module.exports = sendEmail
