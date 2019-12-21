require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movieList = require('./movieList.json');


const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
});

app.use(function validateBearerToken(req, res, next){
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next();
})



function handleMovieRequest(req, res){
    const { genre, country, avg_vote } = req.query;

    let currentMovies = movieList.slice(0);

    if(genre) {
        currentMovies = currentMovies.filter(movie => 
            movie.genre.toLowerCase().includes(genre.toLowerCase()));
    }

    if(country) {
        currentMovies = currentMovies.filter(movie => 
            movie.country.toLowerCase().includes(country.toLowerCase()));
    }

    if(avg_vote) {
        currentMovies = currentMovies.filter(movie => 
            movie.avg_vote >= Number(avg_vote));
    }

    res.send(currentMovies)
}

app.get('/movie', handleMovieRequest)


module.exports = app;