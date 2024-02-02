import {Router} from "express";
import fileDb from "../fileDb";
import {ItemsWithOutID,} from "../type";

const itemsRouter = Router();

itemsRouter.get('/', async (req, res) => {
    const items = await fileDb.getItems();

    res.send(items);
});

itemsRouter.get('/:id', async (req, res) => {
    const items = await fileDb.getItems();
    const item = items.find(m => m.id === req.params.id);

    if (!item) {
        return res.status(404).json({ error: 'Place not found' });
    }

    res.send(item);
});

itemsRouter.post('/',async (req, res) => {

    const { items } = req.body;

    if (!items) {
        return res.status(400).json({ error: 'Category cannot be empty' });
    }

    const newItem: ItemsWithOutID = {
        nameItems: req.body.nameCategory,
        description: req.body.description,
        idCategory: req.body.idCategory,
        idPlaces: req.body.idPlaces,
        image: req.body.image,
    };

    try {
        const savedCategory = await fileDb.addItem(newItem);
        res.send(savedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default itemsRouter;