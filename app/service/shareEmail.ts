import { EmailI } from "../utils/types";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.USEREMAIL,
    pass: process.env.PASSWORDEMAIL,
  },
});

export function shareEmail(email: EmailI) {
  // console.log(email);
  transport.sendMail(
    {
      to: "jairjosafath@gmail.com",
      ...email,
    },
    (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    }
  );
}
