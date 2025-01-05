// const nodemailer = require('nodemailer');
// // Configuração do serviço de e-mail 
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // Use o serviço de e-mail de sua escolha 
//     auth: {
//         user: process.env.EMAIL_USER, // Seu e-mail definido nas variáveis de ambiente 
//         pass: process.env.EMAIL_PASS  // Sua senha de e-mail definida nas variáveis de ambiente 
//     }
// });
// // Função para enviar e-mail
// const sendEmail = async (to, subject, text) => {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text
//     };
//     try {
//       const info = await transporter.sendMail(mailOptions);
//       console.log('E-mail enviado:', info.response);
//       return info; // Retorna informações do envio se necessário
//     } catch (error) {
//       console.error('Erro ao enviar e-mail:', error);
//       throw new Error('Falha ao enviar o e-mail'); // Lança o erro para ser tratado externamente
//     }
//   };
// module.exports = { sendEmail };
import nodemailer from 'nodemailer';

// Configuração do serviço de e-mail
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use o serviço de e-mail de sua escolha
    auth: {
        user: process.env.EMAIL_USER, // Seu e-mail definido nas variáveis de ambiente
        pass: process.env.EMAIL_PASS  // Sua senha de e-mail definida nas variáveis de ambiente
    }
});

// Função para enviar e-mail
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('E-mail enviado:', info.response);
      return info; // Retorna informações do envio se necessário
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Falha ao enviar o e-mail'); // Lança o erro para ser tratado externamente
    }
};

export { sendEmail };
