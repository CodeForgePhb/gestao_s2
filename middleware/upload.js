import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Definir __dirname manualmente para ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do diretório de uploads na raiz do projeto
const uploadDirectory = path.join(process.cwd(), 'uploads');

// Verificar se o diretório 'uploads' existe, caso contrário, criar
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configuração personalizada do armazenamento com nomes finais
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Usar a variável com o caminho correto
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`; // Timestamp + ID único
    const ext = path.extname(file.originalname); // Extensão do arquivo original
    cb(null, `profile_${req.userId || 'user'}_${uniqueSuffix}${ext}`); // Nome final do arquivo
  },
});

// Limite de tamanho e configuração do multer
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limite de 2 MB
});

export default upload;
