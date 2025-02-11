import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Express } from 'express';
import router from './routes';
import mongoose from 'mongoose';

const port = process.env.PORT || 8001;
// initialize express app
const app: Express = express();

// set up default mongoose connection
const mongoDbUrl = process.env.DB_URI;

mongoose.connect(mongoDbUrl ?? '');

const database = mongoose.connection;
database.on('error', console.error.bind(console, 'MongoDB Connection Error: '));

// middleware
// TODO: add hosted frontend domain here

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000'];
// only allows requests coming in from allowed origins
app.use(
  cors({
    credentials: true,
    // origin: true,
    origin: function (origin, callback) {
      console.log(origin);
      console.log({ origin });
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// enabled parsing of http only cookies
app.use(cookieParser());

// middlewares for mongoose
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/service-status', (req, res) => {
  res.json({
    user_service: 'OK',
  });
});

// routes
app.use('/', router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
