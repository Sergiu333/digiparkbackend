const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const allowedCors = [
    'http://localhost:5173',
    'http://localhost:3000/ro',
    'http://localhost:80',
    'app.devcom.uno',
    'https://app.devcom.uno',
    '185.104.45.132',
    'https://digipark-front.vercel.app',
    'digipark-front.vercel.app',
    'https://i-vama.vercel.app'
]

var corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedCors.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
};

//middleware
app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//routers

const routerCamioane = require('./routes/camionRouter.js');
const routerAgent = require('./routes/agentRouter.js');
const routerAdmin = require('./routes/adminRouter.js');
const routerAuth = require('./routes/authRoutes.js');
const routerPuncteDeDevamare = require('./routes/puncteDeDevamareRouter.js')
const routerPuncteDeTrecere = require('./routes/puncteDeTrecereRouter.js')
const routerIstoric = require('./routes/istoricRoutes.js');
const routerUser = require('./routes/userRouter.js');

app.use('/api/Camioane', routerCamioane);
app.use('/api/Agenti', routerAgent);
app.use('/api/Admin', routerAdmin);
app.use('/api/Auth', routerAuth);
app.use('/api/PuncteDeDevamare', routerPuncteDeDevamare);
app.use('/api/PuncteDeTrecere', routerPuncteDeTrecere);
app.use('/api/Istoric',routerIstoric);
// app.use('/api/User',routerUser);

//testing api
app.get('/', (req, res) => {
    res.json({ message: "hello from DigiPark" });
})

const PORT = process.env.PORT || 3000;



// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server is running on port ${PORT}`);
// });
app.listen(3000, () => console.log("Server ready on port 3000."));
