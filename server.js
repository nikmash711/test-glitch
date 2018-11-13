const express = require('express');
// you'll need to use `queryString` in your `gateKeeper` middleware function
const queryString = require('query-string');


const app = express();

// For this challenge, we're hard coding a list of users, because
// we haven't learned about databases yet. Normally, you'd store
// user data in a database, and query the database to find
// a particular user.
//
// ALSO, for this challenge, we're storing user passwords as
// plain text. This is something you should NEVER EVER EVER 
// do in a real app. Instead, always use cryptographic
// password hashing best practices (aka, the tried and true
// ways to keep user passwords as secure as possible).
// You can learn more about password hashing later
// here: https://crackstation.net/hashing-security.htm
const USERS = [
  {id: 1,
   firstName: 'Joe',
   lastName: 'Schmoe',
   userName: 'joeschmoe@business.com',
   position: 'Sr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 2,
   firstName: 'Sally',
   lastName: 'Student',
   userName: 'sallystudent@business.com',
   position: 'Jr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 3,
   firstName: 'Lila',
   lastName: 'LeMonde',
   userName: 'lila@business.com',
   position: 'Growth Hacker',
   isAdmin: false,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 4,
   firstName: 'Freddy',
   lastName: 'Fun',
   userName: 'freddy@business.com',
   position: 'Community Manager',
   isAdmin: false,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  }
];


// write a `gateKeeper` middleware function that:
//  1. looks for a 'x-username-and-password' request header - use the req.get('x-username-and-password') to retrieve the header value
//  2. parses values sent for `user` and `pass` from 'x-username-and-password' header (since the string looks like user=ellen&pass=superSecretPassword, Use queryString (already imported at the top of server.js) to parse the values for user and pass from the request header. Specifically, use the queryString.parse method, which is designed for parsing URL query params. For instance, queryString.parse('catName=george&dogName=georgette') would produce {catName: 'george', dogName: 'georgette'}.
//  3. looks for a user object in the USERS array matching the sent username and password values (use .find) 
//  4. if matching user found, add the user object to the request object. If not, req.user should be undefined or null (but dont explictitly set that...) 
//     (aka, `req.user = matchedUser`)
  //NOTE: All requests that go through this middleware should have a req.user property, but only requests with valid user credentials should have a user object as the value for req.user.

function gateKeeper(req, res, next) {
  const header = req.get('x-username-and-password');
  const userObj = queryString.parse(header);
  console.log(userObj);
  req.user = USERS.find(user=> user.userName===userObj.user && user.password ===userObj.pass);
  next();
}

//we want to use this for every request so every request gets a request.user
app.use(gateKeeper);


// this endpoint returns a json object representing the user making the request,
// IF they supply valid user credentials. This endpoint assumes that `gateKeeper` 
// adds the user object to the request if valid credentials were supplied. (The /api/users/me route will look for a user object on the request, which only exists because of our middleware) 
app.get("/api/users/me", (req, res) => {
  // send an error message if no or wrong credentials sent
  if (req.user === undefined) {
    return res.status(403).json({message: 'Must supply valid user credentials'});
  }
  // we're only returning a subset of the properties
  // from the user object. Notably, we're *not*
  // sending `password` or `isAdmin`.
  const {firstName, lastName, id, userName, position} = req.user;
  return res.json({firstName, lastName, id, userName, position});
});

app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});


