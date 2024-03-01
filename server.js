// defining the server port
const port = 5000

// initializing installed dependencies
import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import cors from 'cors'

dotenv.config()
const app = express()
app.use(cors())

const API_URL = 'https://api.watchmode.com/v1/'

// listening for port 5000
app.listen(5000, ()=> console.log(`Server is running on ${port}` ))

// API request
app.get('/', (req,res)=>{   
    const options = {
        method: 'GET',
        url: API_URL + req.query.endpoint + '?apiKey=' + process.env.VITE_API_KEY + '&' + req.query.query,
   };
   
    axios.request(options).then(function (response) {
       res.json(response.data);
    }).catch(function (error) {
        console.error(error);
    });
});