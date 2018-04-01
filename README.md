# ProtegoPdf
A simple [electron](https://github.com/electron/electron) application to set a password to a PDF Document (windows only).

The UI was made with [electron](https://github.com/electron/electron). The use of `C#` was also necessary for PDF interaction.
Finally it manipulates PDF files with the help of [iText7](https://github.com/itext/itext7-dotnet).

I started this project as a way to learn to work with `Electron` and `Angular`. I also set myself the goal to actually finish a project becuase throughout the years, I've created a lot of POCs and a lot of small applications but I've never actually see a project from start to end. So here is a finished project.

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
