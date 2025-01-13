import nodemailer, { TransportOptions } from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  } as TransportOptions);

  // send mail with defined transport object
  const { to, subject, text } = options;
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    text,
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};
