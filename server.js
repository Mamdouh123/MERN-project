const express = require('express');
const app = express();
const connectDB = require('./config/db');
// middleware to parse json post body
app.use(express.json());

connectDB();
const PORT = process.env.PORT || 5000;

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.get('/', (req,res)=> console.log("resquest recieved"));
app.listen(PORT, ()=>console.log('listening on port' + PORT));