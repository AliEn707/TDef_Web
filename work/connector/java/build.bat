@for /F "delims=" %%I in ("%~dp0") do @set root=%%~dI
@for /F "delims=" %%I in ("%~dp0") do @set folder=%%~fI

@set PATH=%root%\devel\jdk1.8.0_60\bin;%folder%\..\..\..\..\..\devel\jdk1.8.0_60\bin;%PATH%
@set CLASSPATH=classpath1;classpath2

javac *.java -Xlint:unchecked -d ./
jar -cf connector.jar *.class
del *.class
@rem ../../../app/assets/other/
pause