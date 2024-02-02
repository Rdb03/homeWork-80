import {Router} from "express";
import fileDb from "../fileDb";
import {PlacesWithOutID,} from "../type";
import itemsRouter from "./items";

const placesRouter = Router();

placesRouter.get('/', async (req, res) => {
    const places = await fileDb.getPlaces();

    res.send(places);
});

placesRouter.get('/:id', async (req, res) => {
    const places = await fileDb.getPlaces();
    const place = places.find(m => m.id === req.params.id);

    if (!place) {
        return res.status(404).json({ error: 'Place not found' });
    }

    res.send(place);
});

placesRouter.put('/:id', async (req, res) => {
    const places = await fileDb.getPlaces();
    const place = places.find(m => m.id === req.params.id);
    res.send(place);
});

placesRouter.delete('/:id', async (req, res) => {
    try {
        const places = await fileDb.getPlaces();
        const place = places.find(m => m.id === req.params.id);

        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        const deletedPlaces = await fileDb.deletePlace(place.id);
        res.send(deletedPlaces);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

placesRouter.post('/',async (req, res) => {

    const { namePlace, description } = req.body;

    if (!namePlace) {
        return res.status(400).json({ error: 'Place cannot be empty' });
    }

    const newPlace: PlacesWithOutID = {
        namePlace: namePlace,
        description: description,
    };

    try {
        const savedPlaces = await fileDb.addPlace(newPlace);
        res.send(savedPlaces);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

placesRouter.put('/:id', async (req, res) => {
    const resourceId = req.params.id;
    const newData = req.body;

    try {
        const updatedPlace = await fileDb.updatePlaceById(resourceId, newData);

        if (!updatedPlace) {
            return res.status(404).send({"error": "Place not found"});
        }

        res.send(updatedPlace);
    } catch (error) {
        console.error("Error updating resource:", error);
        res.status(500).send({"error": "An error occurred while updating the resource"});
    }
});

export default placesRouter;