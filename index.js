const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const helmet = require('helmet')
const movieList = require('./movieList.json')



const app = express();

app.use(morgan('dev'));
app.use(cors())
app.use(helmet())

function handleMovieRequest(req, res){
    res.send(movieList)
}

app.get('/movie',handleMovieRequest)


module.exports = app;