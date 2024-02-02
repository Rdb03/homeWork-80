import {promises as fs} from 'fs';
import {Category, CategoryWithOutID, Items, ItemsWithOutID, Place, PlacesWithOutID} from "./type";
import crypto from 'crypto';

const fileName = './db.json';

const initialCategories: Category[] = [];
const initialPlaces: Place[] = [];
const initialItems: Items[] = [];

let data = {
    categories: initialCategories,
    items: initialItems,
    places: initialPlaces
};

type ItemWithID = Category | Place | Items;

const addItemToArray = async (array: ItemWithID[], item: CategoryWithOutID | PlacesWithOutID | ItemsWithOutID) => {
    const id = crypto.randomUUID();
    const newItem = {id, ...item};
    array.push(newItem);
    console.log(array);
    await fileDb.save();
    return newItem;
};

const deleteItemFromArray = async (array: ItemWithID[], id: string) => {
    try {
        const updatedItems = array.filter(existingItem => existingItem.id !== id);

        if (updatedItems.length === array.length) {
            console.error('Item not found');
        } else {
            (data as any)[array === data.categories ? 'categories' : array === data.places ? 'places' : 'items'] = updatedItems;
            await fileDb.save();
        }

        return updatedItems;
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
};

const fileDb = {
    async init() {
        try {
            const fileContents = await fs.readFile(fileName);
            data = JSON.parse(fileContents.toString());
        } catch (e) {
            data = {
                categories: [],
                items: [],
                places: []
            };
        }
    },
    async getCategories() {
        return data.categories;
    },
    async getPlaces() {
        return data.places;
    },
    async getItems() {
        return data.items;
    },
    async addCategory(item: CategoryWithOutID) {
        return addItemToArray.call(this, data.categories, item);
    },
    async addPlace(item: PlacesWithOutID) {
        return addItemToArray.call(this, data.places, item);
    },
    async addItem(item: ItemsWithOutID) {
        return addItemToArray.call(this, data.items, item);
    },
    async deletePlace(id: string) {
        return deleteItemFromArray(data.places, id);
    },
    async deleteCategory(id: string) {
        return deleteItemFromArray(data.categories, id);
    },
    async deleteItem(id: string) {
        return deleteItemFromArray(data.items, id);
    },
    async save() {
        const dataToSave = {
            categories: data.categories,
            items: data.items,
            places: data.places,
        };
        return fs.writeFile(fileName, JSON.stringify(dataToSave, null, 2));
    }
};

export default fileDb;

