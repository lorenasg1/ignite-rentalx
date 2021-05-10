import { injectable } from 'tsyringe';
import { IMailProvider } from '../IMailProvider';
import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';

export class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then(account => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch(error => console.log(error));
  }

  async sendMail(
    to: string,
    subject: string,
    variables: {},
    path: string,
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');

    const templateParse = handlebars.compile(templateFileContent);

    const HTMLTemplate = templateParse(variables);

    const message = await this.client.sendMail({
      to,
      from: 'RentX <no-reply@rentx.com.br>',
      subject,
      html: HTMLTemplate,
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
