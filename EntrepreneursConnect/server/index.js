const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const PORT = process.env.PORT;
const userRoutes = require('./routes/user.routes');
const productsRoutes = require('./routes/Product.routes');
const likeRoutes = require('./routes/like.routes');
const commentRoutes = require('./routes/comments.routes');
const refrealsRoutes = require('./routes/refreals.routes');
const groupRoutes = require('./routes/group.routes');
const notificationRoutes = require('./routes/notification.routes');
const subscriptionRoutes = require('./routes/subscription.routes')
const boostRoutes = require('./routes/boost.routes')
const myDb = require('./db');
const { verifyJWT } = require('./middleware/auth.middleware')
const { getSuscribedUsers, getAllUser } = require('./utils/promotoinalEmails')
const { sendPromotionalEmail } = require('./utils/email')
const cron = require('node-cron');

const Server = http.createServer(app);

console.log(PORT);

app.use(express.json());


// const corsOptions = {
//     origin: ['https://entrepreneursconnect.vercel.app', 'http://localhost:3000'],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     optionsSuccessStatus: 200,
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     maxAge: 3600,

//     error: (err) => {
//         console.log(err)
//         return res.status(403).json({ error: 'CORS request is not allowed.' });
//     },
// };

app.use(cors());

Server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

myDb.myDb();
app.use('/uploads', express.static('uploads'));
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/likes', likeRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/refreals', refrealsRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/subscription', verifyJWT, subscriptionRoutes);
app.use('/api/v1/boost', verifyJWT, boostRoutes);

app.set('view engine', 'ejs');






let TopUsers = ''
getSuscribedUsers().then((res) => {

    TopUsers = res

}).catch(() => {
    console.log("error")
})


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


cron.schedule('0 12 * * *', async () => {
    console.log('Running a task every minute');
    const users = await getAllUser();
    const suscribedUsers = await getSuscribedUsers();
    const suscribedUsersEmail = suscribedUsers.map((user) => user.email);
    const usersEmail = users.map((user) => user.email);
    const emailList = [...suscribedUsersEmail, ...usersEmail];
    const uniqueEmailList = [...new Set(emailList)];
    console.log(uniqueEmailList);
    shuffleArray(uniqueEmailList);
    const usersToSendEmail = uniqueEmailList.slice(0, 10);
    usersToSendEmail.forEach((email) => {
        sendPromotionalEmail(email, TopUsers);
    });
});


app.get('/', (req, res) => {
    res.render('index');
});
