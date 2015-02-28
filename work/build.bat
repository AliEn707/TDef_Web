@for /F "delims=" %%I in ("%~dp0") do @set root=%%~dI

@set PATH=%root%\devel\flex_sdk_4.6\bin;%PATH%

mxmlc ExternalInterfaceExample.as -static-link-runtime-shared-libraries -o ../public/javascripts/tdef/game/connector.swf
pause