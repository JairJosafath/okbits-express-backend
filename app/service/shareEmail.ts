import { EmailI } from "../utils/types";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3e5dc894044f57",
    pass: "efc007e92f9f1e",
  },
});
var mailOptions = {
  from: '"Example Team" <from@example.com>',
  to: "user1@example.com, user2@example.com",
  subject: "Nice Nodemailer test",
  text: "Hey there, it’s our first message sent with Nodemailer 😉 ",
  html: "<b>Hey there! </b><br> This is our first message sent with Nodemailer",
};
export function shareEmail(email: EmailI) {
  // console.log(email);
  transport.sendMail(
    {
      to: "jairjosafath@gmail.com",
      subject: "qweqwe",
      cc: "jairjosafath@gmail.com",
      text: "qweqwe",
      attachments: [
        {
          filename: "test.txt",
          path: path.join(__dirname, "../../storage/test.txt"),
        },
      ],
    },
    (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    }
  );

  // const filePath = path.join(__dirname, "../../storage/test.txt");
  // let file = fs.createReadStream(filePath);
  // console.log(file);
  // const res = await fetch("https://send.api.mailtrap.io/api/send", {
  //   method: "POST",
  //   body: JSON.stringify({}),
  // });
}
