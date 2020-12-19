# talk-at-me-api

**********

[TalkAtMe Client](https://talkatme.herokuapp.com/)

**********

This is the server-side code for the TalkAtMe project.

Code is written in Node.js using Express

Database uses MongoDB with Mongoose

Main logic is handled in the server.js file

The /controllers folder contains a user.js and post.js to handle appropriate requests.

Mongoose schema are modeled in the /models file and also contain a user.js and post.js file.

Authentication is handled with JSONWebTokens and passwords are salted and hashed with Bcrypt.
