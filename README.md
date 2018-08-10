# CoEdit

CoEdit is a desktop application that provides <b>real-time, collaborative rich text editing capabilities</b>.

Why?
Real time editing in the browser (eg: Google Docs) hogs memory and begins to slow down computers when multiple documents are open. CoEdit is
designed to provide be a clone of Google Docs (users; real-time, rich editing; access, edit, and share docs) but on the desktop. 

Technologies used: <b>React.js, Electron.js, Socket.io, Draft.js, MongoDB, Passport.js</b>.
Styling is done with Material UI.

The text editor is built with Draft.js and has the ability to format text (font-size, font-weight, font-color, text-align, etc.).
Document persistence is enabled with MongoDB.
The state of documents is managed with React in Electron. 
Real-time editing is achieved with Socket.io.
Login is handled by Passport.js.
