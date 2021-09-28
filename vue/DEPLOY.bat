
rmdir /s /q ..\ChromeStore\vue\dist
REM rmdir /s /q ..\ChromeStore\vue\src
REM rmdir /s /q ..\ChromeStore\vue\public

xcopy /e /y dist ..\ChromeStore\vue\dist\
REM xcopy /e /y src ..\ChromeStore\vue\src\
REM xcopy /e /y public ..\ChromeStore\vue\public\

powershell compress-archive ..\ChromeStore\host ..\ChromeStore\host.zip -Force

powershell compress-archive ..\ChromeStore ..\ChromeStore.zip -Force

