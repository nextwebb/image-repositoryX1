import express from 'express';
import createError from 'http-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: `${__dirname}/.env` });

import modules from './modules';

const app = express();
// temporary allow all origins to access this server
app.use(cors());
// console.log(process.env.TEST_DB_ENVIRONMENT);

// if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
//   mongoose.Promise = global.Promise;
//   mongoose
//     .connect('mongodb://localhost:27017/imagerepository', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//     })
//     .then(() => console.log('docker mongodb container conneted!'))
//     .catch((err: any) => console.log(err));
// } else {
//   const dbUri = process.env.DEV_DB_URI;
//   // mongoose connection
//   mongoose
//     .connect(dbUri, {
//       useFindAndModify: false,
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//     })
//     .then(() => console.log('database connected'))
//     .catch(() => console.log('database not connected'));
// }

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// register all routes
app.use('/api/v1', modules);

app.listen(5000, () => console.log(`Running on port ${5000}`));
