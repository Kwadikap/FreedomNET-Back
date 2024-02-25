const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const conversationRoute = require('./routes/conversations');
const messageRoute = require('./routes/messages');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

app.use(cors({
    origin: 'https://643ffda81b996f352c844118--freedomnet-social.netlify.app/',
    credentials: true,
    optionSuccessStatus: 200,
}));


dotenv.config();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, () => {
    console.log('Connected to database ✅')
});

app.use('/images', express.static(path.join(__dirname, 'public/images')))

// MIDDLEWARE
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({ storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        return res.status(200).json('File uploaded successfully.');
    } catch (err) {
        console.log(err)
    }
})



app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);



const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log("Backend server is running...");
}); 
