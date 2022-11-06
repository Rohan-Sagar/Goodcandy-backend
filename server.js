const { auth, requiresAuth } = require('express-openid-connect');
const express = require('express');
const Reviews =require("./review-schema.js");
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 9000;

const config = {
  authRequired: false,        // Controls whether authentication is required for all routes
  auth0Logout: true,          // Uses Auth0 logout feature
  baseURL: process.env.BASE_URL, //The URL where the application is served
  clientID: process.env.CLIENT_ID, // The Client ID of the application
  issuerBaseURL: process.env.ISSUER_BASE_URL, // The base URL of the Auth0 issuer
  secret: process.env.SECRET // A long, random string used to encrypt the session cookie
};

app.use(auth(config));

app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.get('/logout', (req, res) => {
  req.oidc.logout();
  res.redirect('/');
});

app.use(express.json());
app.use(cors());

const connection_url = "mongodb+srv://GoodCandy-db:1PS6UwEsCyzCBvvy@cluster0.keipgix.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', () => {
    console.log('DB connected');
})

    app.get('/get-reviews', (req, res) => {
        Reviews.find((err, data) => { 
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(data)
            }
        })
    })

    app.post('/post-reviews', (req, res) => {
        const dbReview = req.body;
        Reviews.create(dbReview, (err, data) => {
            if (err) {
                res.status(500).send(err);
            }else{
                res.status(201).send(data);
            }
        })
    })

app.get('/get-reviews', (req, res) => {
    Reviews.find((err, data) => { 
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.post('/post-reviews', (req, res) => {
    const dbReview = req.body;

    Reviews.create(dbReview, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));



