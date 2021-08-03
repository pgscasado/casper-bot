# Casper Bot

O Casper é um chatbot para Facebook Messenger, feito para a avaliação como primeiro Mini-Projeto para a E-Life.
Esse repositório concentra todo o código TypeScript/JavaScript do bot, tanto front-end quanto back-end.

## Instalação

Defina as variáveis de ambiente:
```
DB_URISTRING=mongodb+srv://<user>:<pass>@url.de.cluster.mongodb/bancoDeDados
API_SECRET=************
API_PASSWORD=****(4 dígitos)
PORT=*****(número)
```

Do diretório do bot, execute os seguintes comandos:
```bash
npm install
npm run build
npm start
```

## Como acessar:

Abra um navegador de web moderno (Chrome, Safari, Opera, EdgeChrome) e acesse o endereço de [loopback](http://127.0.0.1:3000/) do seu computador na porta 3000 (ou na porta definida na variável de ambiente PORT)