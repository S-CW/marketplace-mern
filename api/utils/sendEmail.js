import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { promisify } from 'util';
import fs from 'fs';

export const sendEmail = async (token, {recipient, subject, filePath}) =>
{
    const readFile = promisify(fs.readFile);
    const html = await readFile(filePath, 'utf8');
    const appURL = `${process.env.APP_URL}/reset-password/?pcode=${token}`

    const template = Handlebars.compile(html);
    const data = {
        refLink: appURL,
    };
    const email = template(data);

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: process.env.APP_DEBUG ? false : true
        }
    });

    const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: recipient,
        subject: subject,
        html: email,
    };

    const response = new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) =>
        {
            if (err) {
                reject(err);
            }

            resolve(info);
        });
    })

    return response;
}