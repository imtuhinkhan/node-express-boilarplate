import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from "path";
import { __filename, __dirname } from '../utils/pathUtils.js';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  });
};

const readHTMLFile = async (filePath) => {
  try {
    const html = await fs.readFile(filePath, 'utf-8');
    return html;
  } catch (err) {
    console.error('Error reading file', err);
    throw err;
  }
};

const mailSender = async (email, title, replacements, templatePath) => {
  try {
    const transporter = createTransporter();
    const html = await readHTMLFile(path.join(__dirname, `../email_templates/${templatePath}`));

    const template = handlebars.compile(html);
    const htmlToSend = template(replacements);
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL_NAME,
      to: email,
      subject: title,
      html: htmlToSend,
    });
    return info;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export { mailSender };
