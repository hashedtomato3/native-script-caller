@echo off

REM time /t >> "%~dp0\\log.txt"

REM SET FOLDER=node-v12.18.2-win-x64
REM SET PATH=%~dp0\%FOLDER%;%PATH%
REM set NODE_PATH=%~dp0\%FOLDER%\node_modules;%~dp0\%FOLDER%\node_modules\npm\node_modules

if exist .\set_env.cmd  call .\set_env.cmd

node "%~dp0\host.js"

REM echo exiting >> "%~dp0\\log.txt"
