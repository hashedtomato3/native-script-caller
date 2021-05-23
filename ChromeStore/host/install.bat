
:: Change HKCU to HKLM if you want to install globally.
:: %~dp0 is the directory containing this bat script and ends with a backslash.
REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.node.native_script_caller" /ve /t REG_SZ /d "%~dp0manifest.json" /f
