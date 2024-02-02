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
    await fileDb.save();
    return newItem;
};

const deleteItemFromArray = async (array: ItemWithID[], id: string) => {
    try {
        const updatedItems = array.filter(existingItem => existingItem.id !== id);

        if (updatedItems.length === array.length) {
            console.error('Item not found');
        } else {
            if (array === data.categories) {
                data.categories = updatedItems as Category[];
            } else if (array === data.places) {
                data.places = updatedItems as Place[];
            } else if (array === data.items) {
                data.items = updatedItems as Items[];
            }
            await fileDb.save();
        }

        return updatedItems;
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
};

const updateItemById = async (array: ItemWithID[], id: string, newData: any) => {
    const itemToUpdateIndex = array.findIndex(item => item.id === id);

    if (itemToUpdateIndex === -1) {
        return null;
    }

    array[itemToUpdateIndex] = {
        ...newData,
        id: id,
    };

    await fileDb.save();
    return array[itemToUpdateIndex];
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
    async updateItemById(id: string, newData: ItemsWithOutID) {
        return updateItemById(data.items, id, newData);
    },
    async updatePlaceById(id: string, newData: PlacesWithOutID) {
        return updateItemById(data.places, id, newData);
    },
    async updateCategoryById(id: string, newData: CategoryWithOutID) {
        return updateItemById(data.categories, id, newData);
    },
    async getCategoryById(id: string) {
        return data.categories.find(category => category.id === id);
    },
    async getPlaceById(id: string) {
        return data.places.find(place => place.id === id);
    },
    async getItemsByCategoryId(categoryId: string) {
        return data.items.filter(item => item.idCategory === categoryId);
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

