require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const env = require("./envalid");
const verifyJWTAccessToken = require("./JWTmiddleware");

const app = express();

const allowedOrigins = [
	'http://localhost:3000',
	'http://lopez:5173',
	"http://localhost:5173",
	"http://127.0.0.1:5173",
]
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // postman
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
// app.use(cors({ origin: true, credentials: true}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// console.log(`API: ${env.API}`);

// app.use(verifyJWTAccessToken);

app.use(env.API, routes);

app.use((req, res, next) => {
    res.status(404).send("Not found");
});


app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});
