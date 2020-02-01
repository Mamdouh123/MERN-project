const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;
app.get('/', (req,res)=> console.log("resquest recieved"));
app.listen(PORT, ()=>console.log('listening on port' + PORT));