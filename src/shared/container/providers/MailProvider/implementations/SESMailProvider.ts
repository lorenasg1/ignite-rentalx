import { IMailProvider } from '../IMailProvider';
import { SES } from 'aws-sdk';
import { injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';

@injectable()
export class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_REGION,
      }),
    });
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

    await this.client.sendMail({
      to,
      from: 'RentX <hi@lorenasg.com>',
      subject,
      html: HTMLTemplate,
    });
  }
}
