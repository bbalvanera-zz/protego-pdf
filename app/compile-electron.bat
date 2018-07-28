cd ..\
rd /S /Q built
cd publish
electron-packager .\ --app-copyright "Copyright (c) 2018 Bernardo Balvanera" --app-version "1.0.0" --arch x64 --build-version "1.0.0" --icon ..\publish\favicon.ico --platform win32 --asar --extra-resource extras --ignore extras --out ..\built
pause