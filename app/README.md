# ProtegoPdf

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.3.

## What I learned
I leared a lot about Angular. I had the opportunity to work with my aspects of Angular programing as well as Electron programing. I learned and implemented:

* ValueAccess Components
* I18n as implemented by Angular
* Validators and AsyncValidators and how sometimes it is necessary to debounce their calls.
* I learned the differences between Template-drive Forms and Reactive Forms. Coming from a programming background, I have to say I prefer Reactive Forms because it feels more like programming than configuring which is what happens with Template Forms.
* Electron
  * Communicate between Main and Renderer process
* Winston logger
* Zxcvbn. I also investigated a little about password strength and entropy.
* I enabled communication between components using Binding and Events
* I learned about dynamic component loading.

In general it was a great experience to work with this application and also I learned a lot. Not to mention I really enjoyed.

## Development server

Run `gulp serve` to run the application from local folder. Requires electron 1.8.3 globally installed and gulp 4

## Publishing

Run `gulp publish` to have the application built using `prod` settings and copied to another location and have `npm install` run.
Then run `electron-packager` on the created folder to create a windows application ready for distribution.
