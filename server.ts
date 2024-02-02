import express from 'express';
import cors from 'cors';
import fileDb from "./fileDb";
import categoriesRouter from "./routes/categories";
import placesRouter from "./routes/places";
import itemsRouter from "./routes/items";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);
app.use('/items', itemsRouter);


const run = async () => {
    await fileDb.init();

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

void run();