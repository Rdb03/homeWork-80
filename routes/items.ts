import {Router} from "express";
import fileDb from "../fileDb";
import {ItemsWithOutID,} from "../type";
import {imagesUpload} from "../multer";

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

itemsRouter.delete('/:id', async (req, res) => {
    try {
        const items = await fileDb.getItems();
        const item = items.find(m => m.id === req.params.id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const deleteItem = await fileDb.deleteItem(item.id);
        res.send(deleteItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

itemsRouter.post('/', imagesUpload.single('image'), async (req, res) => {

    const { nameItems, description, idCategory, idPlaces } = req.body;
    const image = req.file ? req.file.filename : '';

    if (!nameItems || !idCategory || !idPlaces) {
        return res.status(400).json({ error: 'Item cannot be empty' });
    }

    try {
        const category = await fileDb.getCategoryById(idCategory);
        const place = await fileDb.getPlaceById(idPlaces);

        if (!category) {
            return res.status(400).json({ error: 'Category does not exist' });
        }

        if (!place) {
            return res.status(400).json({ error: 'Place does not exist' });
        }

        const newItem: ItemsWithOutID = {
            nameItems: nameItems,
            description: description,
            idCategory: idCategory,
            idPlaces: idPlaces,
            image: image,
        };

        const savedItem = await fileDb.addItem(newItem);
        res.send(savedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


itemsRouter.put('/:id', async (req, res) => {
    const resourceId = req.params.id;
    const newData = req.body;

    try {
        const updatedItem = await fileDb.updateItemById(resourceId, newData);

        if (!updatedItem) {
            return res.status(404).send({"error": "Item not found"});
        }

        res.send(updatedItem);
    } catch (error) {
        console.error("Error updating resource:", error);
        res.status(500).send({"error": "An error occurred while updating the resource"});
    }
});

export default itemsRouter;