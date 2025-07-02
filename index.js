const express = require('express');
const pool = require('./database'); // require() will default to looking for the file in the `node_modules` folder
// ./ means SAME DIRECTORY AS THE CURRENT FILE

const app = express();

// enable express to use json for data communication
app.use(express.json());

app.get('/', function (req, res) {
    res.send("Please use /api to access the API endpoints");
})

app.get('/api/', function (req, res) {
    res.json({
        'message': 'API is ok'
    })
})

app.get('/api/recipes', async function (req, res) {
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
app.post('/api/recipes', async function (req, res) {
    let connection = await pool.getConnection();;
    try {

        await connection.beginTransaction(); // marks the start of an atomic operation
        const bindings = [
            req.body.name,
            req.body.description,
            req.body.cooking_time,
            req.body.ingredients,
            req.body.steps,
            req.body.cuisine_id,
            req.body.category_id
        ]

        // pool.query returns an array
        // the useful data is in index 0
        // the meta data (rarely used) is in index 1
        const results = await connection.query(`
            INSERT INTO recipes (name, description, cooking_time, ingredients, steps, cuisine_id, category_id)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `, bindings); // <-- prepared statement, to prevent mysql injection

        const recipeId = results[0].insertId;

        req.body.tags.forEach(async function (tagId) {
            const bindings = [recipeId, tagId];
            await connection.query(`INSERT INTO recipes_tags (recipe_id, tag_id) VALUES (?, ?)`, bindings);
        })

        await connection.commit(); // all changes made to the database are finalized

        res.json({
            'new_recipe_id': recipeId
        })

    } catch (e) {
        console.error(e);
        await connection.rollback(); // revert all the changes to the database donce since beginTransaction
    } finally {
        await connection.release();
    }

})

// :id => request parameters, it's a wildcard, it can match any string
// /api/recipes/3 will match 
// /api/recipes/4 will match

app.put('/api/recipes/:id', async function (req, res) {
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
            "message":"Recipe has been updated"
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
app.delete('/api/recipes/:recipeId', async function(req,res){
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
            'message':'Recipe has been deleted'
        })

    } catch (e) {
        console.error(e);
        await connection.rollback();
        res.sendStatus(500);
    } finally {
        await connection.release();
    }
})

app.listen(3000, function () {
    console.log("Server has started");
})