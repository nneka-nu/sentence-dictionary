import path from 'path';
import express from 'express';
import fetch from 'isomorphic-fetch';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import methodOverride from 'method-override';
import objectAssign from 'object-assign';

import React from 'react';
import { renderToString } from 'react-dom/server';

import Main from './components/Main';
import config from './config';
import { handleResponse } from './helpers';

const server = express();
const MongoStore = connectMongo(session);

server.set('views', path.resolve(__dirname, 'views'));
server.set('view engine', 'pug');

server.use(express.static(path.resolve(__dirname, 'assets')));
server.use(bodyParser.urlencoded({extended: true}));
server.use(session({
  secret: process.env.SESSION_SECRET || config.session_secret,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ url: process.env.MONGO_URL || config.mongo_url }),
  cookie: {path: '/', httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 * 30}
}));
server.use(methodOverride('_method'));

server.get('/', function(req, res) {
  if (!req.session.recentSearches) {
    req.session.recentSearches = [];
  }

  const initialState = {
    status: req.session.status || 200,
    sentences: req.session.sentences || [],
    searchTerm: req.session.searchTerm || '',
    recentSearches: req.session.recentSearches
  };

  const mainString = renderToString(<Main {...initialState} />);

  res.render('index', {
    html: mainString,
    initialState
  });
})

server.post('/', function(req, res) {
  const searchTerm = req.body.search || req.query.search;
  const url = 'https://od-api.oxforddictionaries.com/api/v1/entries/en/' + searchTerm + '/sentences';
  const options = {
    'method': 'GET',
    'headers': {
      'Accept': 'application/json', 
      'app_id': process.env.APP_ID || config.app_id,
      'app_key': process.env.APP_KEY || config.app_key
    }
  };

  fetch(url, options)
    .then(function(response) {
        if (response.status === 404) {
          return '404';
        }

        if (response.status !== 200) {
          return '500';
        }
        
        return response.json();
    }).then(function(json) {
      if (json === '404' || json === '500') {
        req.session.status = json;
        req.session.searchTerm = searchTerm;
        req.session.sentences = [];
      } else {
        const index = req.session.recentSearches.indexOf(searchTerm);

        if (index > -1) {
          req.session.recentSearches.splice(index, 1);
        }

        req.session.status = 200;
        req.session.searchTerm = searchTerm;
        req.session.sentences = handleResponse(json).sentences;

        if (req.session.sentences.length !== 0) {
          req.session.recentSearches.unshift(searchTerm);
        }
      }

      res.redirect('/');
    }).catch((error) => {
      console.log(error);
    });
});

server.delete('/search/delete/:term', function(req, res) {
  const index = req.session.recentSearches.indexOf(req.params.term);

  if (index > -1) {
    req.session.recentSearches.splice(index, 1);
  }

  res.redirect('/');
});

server.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port 3000...');
})