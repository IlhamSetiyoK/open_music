const nodemailer = require('nodemailer')

class MailSender {
  constructor () {
    this._transpoter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }

  sendEmail (targetEmail, content) {
    const message = {
      from: 'OpenMusic Apps',
      to: targetEmail,
      subject: 'Ekspor Playlists',
      text: 'terlampir hasil expor playlists',
      attachments: [
        {
          filename: 'playlists.json',
          content
        }
      ]
    }

    return this._transpoter.sendMail(message)
  }
}

module.exports = MailSender
