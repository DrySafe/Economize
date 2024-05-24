@echo off
setlocal

REM Variável para armazenar o PID
set PID=

REM Encontra o PID do processo Node.js
for /f "tokens=2 delims=," %%i in ('tasklist /FI "IMAGENAME eq node.exe" /FO CSV /NH') do (
    set PID=%%i
)

REM Verifica se o PID foi encontrado
if "%PID%"=="" (
    echo Nao foi encontrado nenhum processo Node.js em execucao.
    exit /b 1
)

REM Exibe o PID encontrado
echo PID do processo Node.js encontrado: %PID%

REM Envia o sinal para terminar o processo
echo Enviando sinal para terminar o processo Node.js com PID %PID%
taskkill /PID %PID% /F

REM Verifica se o processo foi terminado com sucesso
if %errorlevel%==0 (
    echo Processo Node.js terminado com sucesso.
) else (
    echo Falha ao terminar o processo Node.js.
)

endlocal
goto menu
