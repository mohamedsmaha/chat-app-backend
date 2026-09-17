import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

type SendEmailOptions = {
  to: string;
  subject: string;
  template: string;
  context?: Record<string, unknown>;
};

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {

  }


    private async sendEmail({
      to,
      subject,
      template,
      context,
    }: SendEmailOptions) {
      try {
        await this.mailerService.sendMail({
          from: {
  name: 'Chat App',
  address: this.configService.getOrThrow<string>('MAIL_FROM'),
},
          to,
          subject,
          template,
          context,
        });

        return {
          success: true,
        };
      } catch (error) {
        console.error('EMAIL ERROR:', error);

        throw new InternalServerErrorException(
          'Failed to send email',
        );
      }
    }

    public async SendVerifyEmail(
      email: string,
      link: string,
    ): Promise<void> {
      await this.sendEmail({
        to: email,
        subject: 'Verify Email',
        template: 'verify-email',
        context: {
          email,
          link
        },
      });
    }
public async SendResetPassEmail(
  email: string,
  link: string,
): Promise<void> {
  await this.sendEmail({
    to: email,
    subject: 'Reset Password',
    template: 'reset-password',
    context: {
      email,
      link,
    },
  });
}


}
