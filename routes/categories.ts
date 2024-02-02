import {Router} from "express";
import fileDb from "../fileDb";
import {CategoryWithOutID} from "../type";

const categoriesRouter = Router();

categoriesRouter.get('/', async (req, res) => {
    const categories = await fileDb.getCategories();

    res.send(categories);
});

categoriesRouter.get('/:id', async (req, res) => {
    const categories = await fileDb.getCategories();
    const category = categories.find(m => m.id === req.params.id);

    if (!category) {
        return res.status(404).json({ error: 'Category not found' });
    }

    res.send(category);
});

categoriesRouter.delete('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        const itemsWithCategory = await fileDb.getItemsByCategoryId(categoryId);
        if (itemsWithCategory.length > 0) {
            return res.status(400).json({ error: 'Cannot delete category with associated items' });
        }

        const categories = await fileDb.getCategories();
        const category = categories.find(m => m.id === categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const deleteCategory = await fileDb.deleteCategory(category.id);
        res.send(deleteCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


categoriesRouter.post('/',async (req, res) => {

    const { nameCategory, description } = req.body;

    if (!nameCategory) {
        return res.status(400).json({ error: 'Category cannot be empty' });
    }

    const newCategory: CategoryWithOutID = {
        nameCategory: nameCategory,
        description: description,
    };

    try {
        const savedPlace = await fileDb.addCategory(newCategory);
        res.send(savedPlace);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

categoriesRouter.put('/:id', async (req, res) => {
    const resourceId = req.params.id;
    const newData = req.body;

    try {
        const updatedCategory = await fileDb.updateCategoryById(resourceId, newData);

        if (!updatedCategory) {
            return res.status(404).send({"error": "Category not found"});
        }

        res.send(updatedCategory);
    } catch (error) {
        console.error("Error updating resource:", error);
        res.status(500).send({"error": "An error occurred while updating the resource"});
    }
});

export default categoriesRouter;