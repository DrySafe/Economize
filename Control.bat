::::::::::::::::::::::::::::::::::::::::::::
:: Elevate.cmd - Version 4
:: Automatically check & get admin rights
::::::::::::::::::::::::::::::::::::::::::::
@echo off
CLS
ECHO.
ECHO =============================
ECHO Running Admin shell
ECHO =============================

:init
setlocal DisableDelayedExpansion
set cmdInvoke=1
set winSysFolder=System32
set "batchPath=%~0"
for %%k in (%0) do set batchName=%%~nk
set "vbsGetPrivileges=%temp%\OEgetPriv_%batchName%.vbs"
setlocal EnableDelayedExpansion

:checkPrivileges
NET FILE 1>NUL 2>NUL
if '%errorlevel%' == '0' ( goto gotPrivileges ) else ( goto getPrivileges )

:getPrivileges
if '%1'=='ELEV' (echo ELEV & shift /1 & goto gotPrivileges)
ECHO.
ECHO **************************************
ECHO Invoking UAC for Privilege Escalation
ECHO **************************************

ECHO Set UAC = CreateObject^("Shell.Application"^) > "%vbsGetPrivileges%"
ECHO args = "ELEV " >> "%vbsGetPrivileges%"
ECHO For Each strArg in WScript.Arguments >> "%vbsGetPrivileges%"
ECHO args = args ^& strArg ^& " "  >> "%vbsGetPrivileges%"
ECHO Next >> "%vbsGetPrivileges%"

if '%cmdInvoke%'=='1' goto InvokeCmd 

ECHO UAC.ShellExecute "!batchPath!", args, "", "runas", 1 >> "%vbsGetPrivileges%"
goto ExecElevation

:InvokeCmd
ECHO args = "/c """ + "!batchPath!" + """ " + args >> "%vbsGetPrivileges%"
ECHO UAC.ShellExecute "%SystemRoot%\%winSysFolder%\cmd.exe", args, "", "runas", 1 >> "%vbsGetPrivileges%"

:ExecElevation
"%SystemRoot%\%winSysFolder%\WScript.exe" "%vbsGetPrivileges%" %*
exit /B

:gotPrivileges
setlocal & cd /d %~dp0
if '%1'=='ELEV' (del "%vbsGetPrivileges%" 1>nul 2>nul  &  shift /1)

::::::::::::::::::::::::::::
::START
::::::::::::::::::::::::::::
REM Run shell as admin (example) - @echo off

Title Script .bat Com Menu

cls
color 1f

:menu
Date /t
Time /t
echo ******************************************
echo *                                        *
echo *               Menu Bat                 *
echo *                                        *
echo *     (1) Abrir controle                 *
echo *     (2) fechar servidor                *
echo *     (3) Sair                           *
echo *                                        *
echo *                                        *
echo *                                        *
echo *                                        *
echo ******************************************
echo.

set /p op= Digite sua Opcao:
if %op% equ 1 goto 1
if %op% equ 2 goto 2
if %op% equ 3 goto 3

:1
cd C:\Users\Micro\Documents\Economize\App Controle 2.0 Teste
start controle.bat
goto menu

:2
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

:3
exit %batchName% Arguments: P1=%1 P2=%2 P3=%3 P4=%4 P5=%5 P6=%6 P7=%7 P8=%8 P9=%9
cmd /k

