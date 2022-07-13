# ElectronOAuth
This app is a Proof of concept for authorizing an electron app through github Oauth2.

This was taken from a scrapped app for json menu editor for a website hosted on github pages.

Electron app, asks for authorization using the systems default browser.
Redirects to electron app through url protocol handler

### Note
#### Only Works when app is installed. ( so it can use custom url protocol handler )
#### Currently only tested on pop-os (.deb) installations

# Instructions
1. Clone repo into new directory. 
    `git clone https://github.com/robert-hamilton36/ElectronOAuth.git`
2. `npm i`
3. Create an .env file based of .env-example: `cp .env-example .env`
4. Create an OAuth App on your github profile. [Instructions here](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)  <br> Set Authoirzation callback url to: 
    `electron-auth://`
5. Copy client_id and client_secret to .env file
6. Bundle src/main and src/renderer into main.js and renderer.js <br>
  `npm run dev`
7. Create distributable <br>
  `npm run make`
8. Distributable is outputted into /out/make
9. Install distributable
10. Open app with terminal: `xdg-open electron-auth://`
