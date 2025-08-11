const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors()); // permite conectar con el frontend

// Ruta para recibir los mensajes
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
  from: `"Formulario Portafolio" <${process.env.EMAIL_USER}>`,
  to: process.env.RECEIVER_EMAIL,
  subject: `Nuevo mensaje de ${name}`,
  text: `
    Has recibido un nuevo mensaje desde tu portafolio:

    Nombre: ${name}
    Email: ${email}

     Mensaje:
    ${message}
    `,
    };

    // Envía el correo
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: 'Mensaje enviado correctamente.' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Hubo un error al enviar el mensaje.' });
  }
});

// Inicia el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
