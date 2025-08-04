import express from 'express';
import dotenv from 'dotenv';
import Routes from './routes/index.js';
import { dbConnection } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import path from 'path';
dotenv.config();

const app = express();  // cria uma instância do express

const PORT = process.env.PORT || 4000;


// const __dirname = path.resolve();

app.use(express.json()); 
app.use(cookieParser());
app.use('/api', Routes) 
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

// Configura o Express para servir arquivos estáticos da pasta build do frontend
// Isso permite que o servidor sirva arquivos CSS, JS, imagens e outros recursos do React
// app.use(express.static(path.join(__dirname, '/front/dist'))) // middleware para servir arquivos estáticos da pasta build do frontend

// Rota catch-all que serve o index.html para todas as rotas não encontradas
// Isso é necessário para aplicações SPA (Single Page Application) como React
// Permite que o React Router funcione corretamente no lado do cliente
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'front', 'dist', 'index.html'))
// })

app.listen(PORT, () => { // inicia o servidor na porta especificada  
    dbConnection(); // conecta ao banco de dados
    console.log(`Server is running on port ${PORT}`); // loga a porta em que o servidor está rodando
})