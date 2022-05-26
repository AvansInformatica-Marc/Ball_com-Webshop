import nodemailer from "nodemailer"

export class MailService {
    private transporter = nodemailer.createTransport({
        host: process.env["MAIL_HOST"]!,
        port: parseInt(process.env["MAIL_PORT"]!)
    })

    async sendMail(from: string, to: string, subject: string, body: string): Promise<void> {
        await this.transporter.sendMail({ from, to, subject, html: body })
    }
}
