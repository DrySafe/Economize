@echo off
start chrome.exe http://localhost:3500
node server.js 

"MSG * O servidor está rodando em http://localhost:3500
Para acessar em outros dispositivos digite http://10.127.130.9:3500"

