const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const helmet = require('helmet')
const movieList = require('./movieList.json')



const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

function handleMovieRequest(req, res){
    const { genre, country, avg_vote } = req.query;

    let currentMovies = movieList.slice(0);

    if(genre) {
        currentMovies = currentMovies.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
    }

    if(country) {
        currentMovies = currentMovies.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
    }

    if(avg_vote) {
        currentMovies = currentMovies.filter(movie => movie.avg_vote >= avg_vote);
    }

    res.send(currentMovies)
}

app.get('/movie', handleMovieRequest)


module.exports = app;