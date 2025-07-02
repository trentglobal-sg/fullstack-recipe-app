const express = require('express');
const router = express.Router();
const pool = require("../../database");
const recipeDataLayer = require('../../dataLayer/recipeDataLayer')

router.get('/', async function (req, res) {
    // pool.query is an ASYNCHRONOUS FUNCTION
    const results = await pool.query(`SELECT recipes.*, cuisines.name AS cuisine_name, categories.name AS category_name, GROUP_CONCAT(tags.name) AS tags FROM recipes 
                                        LEFT JOIN cuisines
                                            ON recipes.cuisine_id = cuisines.cuisine_id
                                        LEFT JOIN categories
                                            ON recipes.category_id = categories.category_id
                                        LEFT JOIN recipes_tags
                                            ON recipes.recipe_id = recipes_tags.recipe_id
                                        LEFT JOIN tags
                                            ON recipes_tags.tag_id = tags.tag_id
                                        GROUP BY recipes.recipe_id`);
    // pool.query is usually a NON-BLOCKING CALL (i.e instructions 
    //  after the pool.query will execute normally without waiting for pool.query to finish)
    // if we put await, it becomes a BLOCKING CALL ()
    // other lines in the function must wait for pool.query to finish
    // before running

    // pool.query returns an array 
    // index 0 - the rows from the table 
    // index 1 - metedata of the request
    const rows = results[0];
    res.json({
        'recipes': rows
    })
});

// HTTP VERBS
// POST is for adding new data to the database
// An endpoint contract refers the keys that have to be a request body
/*
  { 
     "name":  string, name of the recipe
     "description": string, description of the recipe,
     "cooking_time": int, number of minutes,
     "ingredients": string, comma delimited list of ingredients (eg "chicken,rice,flour"),
     "steps" string, delimited by newlines (ie. each instruction step is on its on line),
     "cuisine_id": integer, id of the cuisine that the recipe belongs to,
     "category_id": integer, id of the cuisine that the recipe belongs to
     "tags": array of integer, id of the tags that the recipe will associate with
   }

*/
router.post('/', async function (req, res) {
    
    const newRecipeId = await recipeDataLayer.createRecipe(req.body);
    if (newRecipeId) {
        res.json({
            'message':'New recipe has been created successfully!',
            'recipeId': newRecipeId
        }) 
    } else {
        res.status(500).json({
            'message':'Unable to create new recipe'
        })
    }

})

// :id => request parameters, it's a wildcard, it can match any string
// /api/recipes/3 will match 
// /api/recipes/4 will match

router.put('/:id', async function (req, res) {
    const recipeId = req.params.id;
    let connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const bindings = [
            req.body.name,
            req.body.description,
            req.body.cooking_time,
            req.body.ingredients,
            req.body.steps,
            req.body.cuisine_id,
            req.body.category_id,
            recipeId
        ];
        const results = await connection.query(`
                UPDATE recipes SET name=?, description=?, cooking_time=?, ingredients=?, steps=?, cuisine_id=?, category_id=?
                 WHERE recipe_id = ?            
            `, bindings);

        // update the M:N relationship with tags
        // 1. delete all existing tags
        await connection.query(`DELETE FROM recipes_tags WHERE recipe_id = ?`, [recipeId]);

        // 2. reinsert the tags according to req.body.tags
        req.body.tags.forEach(async function (tagId) {
            const bindings = [recipeId, tagId];
            await connection.query(`INSERT INTO recipes_tags (recipe_id, tag_id) VALUES (?, ?)`, bindings);
        })

        await connection.commit();
        res.json({
            "message": "Recipe has been updated"
        })

    } catch (e) {
        console.error(e);
        await connection.rollback()
        res.status(500).json({
            'error': "Error  updating the recipe"
        })
    } finally {
        await connection.release(); // release the connection back to the pool so that it can be managed by the pool
    }
})

// DELETE
router.delete('/:recipeId', async function (req, res) {
    const recipeId = req.params.recipeId;
    let connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // delete the recipe's relationships with tags
        await connection.query("DELETE FROM recipes_tags WHERE recipe_id = ?", [recipeId]);
        await connection.commit();

        // delete the row from the recipes table
        await connection.query("DELETE FROM recipes WHERE recipe_id = ?", [recipeId]);



        res.json({
            'message': 'Recipe has been deleted'
        })

    } catch (e) {
        console.error(e);
        await connection.rollback();
        res.sendStatus(500);
    } finally {
        await connection.release();
    }
})

module.exports = router;