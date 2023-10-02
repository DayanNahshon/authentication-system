import nodemailer from "nodemailer";
import * as handlebars from "handlebars";

/*
    sendMail():
    .הגדרת פונקציה אסינכרונית עם פרמטרים לנמען, שם, תמונה, קישור, נושא ותבנית המייל
*/
export default async function sendMail(
    to: string,
    name: string,
    image: string,
    url: string,
    subject: string,
    template: string
) {
  const {
    MAILING_EMAIL,
    MAILING_PASSWORD,
    SMTP_HOST,
    SMTP_EMAIL,
    SMTP_PASSWORD,
    SMTP_PORT,
  } = process.env

    /*
        transporter:
        .Gmail-יצירת אובייקט עפ פרטי התחברות ל
    */
   let transporter = await nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: MAILING_EMAIL,
        pass: MAILING_PASSWORD,
    }})

    /*
        data:
        .הכנת נתוני תבנית המייל
    */
    const data = handlebars.compile(template)
    const replacments = {
        name: name,
        email_link: url,
        image: image,
    }

  const html = data(replacments)

  //אימות חיבור המייל
  await new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
        if (error) {
            console.log(error)
            reject(error)
        } else {
            console.log("server is listening...")
            resolve(success)
        }
    })})

  //קביעת אפשרויות המייל - כתובת אימייל, נמען, נושא ותוכן
  const options = {
    from: MAILING_EMAIL,
    to,
    subject,
    html,
  }

  //שליחת המייל
  await new Promise((resolve, reject) => {
    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        console.log(info)
        resolve(info)
      }
    })
  })
}