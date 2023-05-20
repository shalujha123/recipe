import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"

import {userRouter} from './routes/users.js';
import {recipesRouter} from './routes/recipes.js';

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.use('/auth', userRouter);
app.use('/recipes', recipesRouter);

const port = process.env.PORT || 3001

mongoose.connect(process.env.MONGODB_URL).then(() => {
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log("Mogodb is connected");
  })
}).catch((error) => console.log(`${error} did not connect`))

