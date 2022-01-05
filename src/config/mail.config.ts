//import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapters';
//TODO COMPLETE MAIL 
export const mailOption = {
  transport: process.env.MAIL_SMTP,
  defaults: {
    from: '"No Reply" <hi@emir.krd>',
  },
  template: {
    dir: __dirname + '/templates',
    //adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
