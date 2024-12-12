const mysql = require('mysql2/promise');
require('dotenv').config(); // Carregar as variáveis de ambiente

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Testar a conexão com o banco
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Conectado ao banco de dados MySQL!');
    connection.release();
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
  }
})();

module.exports = db;