const pool = require('../database');

async function createRecipe(recipeData) {
    let connection = await pool.getConnection();;
    let recipeId = null;
    try {

        await connection.beginTransaction(); // marks the start of an atomic operation
        const bindings = [
            recipeData.name,
            recipeData.description,
            recipeData.cooking_time,
            recipeData.ingredients,
            recipeData.steps,
            recipeData.cuisine_id,
            recipeData.category_id
        ]

        // pool.query returns an array
        // the useful data is in index 0
        // the meta data (rarely used) is in index 1
        const results = await connection.query(`
            INSERT INTO recipes (name, description, cooking_time, ingredients, steps, cuisine_id, category_id)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `, bindings); // <-- prepared statement, to prevent mysql injection

        recipeId = results[0].insertId;

        recipeData.tags.forEach(async function (tagId) {
            const bindings = [recipeId, tagId];
            await connection.query(`INSERT INTO recipes_tags (recipe_id, tag_id) VALUES (?, ?)`, bindings);
        })

        await connection.commit(); // all changes made to the database are finalized

    } catch (e) {
        // indicate error
        recipeId = false;
        await connection.rollback(); // revert all the changes to the database donce since beginTransaction
    } finally {
        await connection.release();
    }
    return recipeId;
}

module.exports = { createRecipe };