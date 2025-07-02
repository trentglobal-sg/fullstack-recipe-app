const express = require('express');
const router = express.Router();
const pool = require('../../database');
const recipeDataLayer = require('../../dataLayer/recipeDataLayer')

router.get('/', async function(req,res){
    
    // pool.query will return an array, index 0 = results, index 1 = meta data
    // we can use ARRAY DESTRUCTURING in JavaScript to assign index from an array to a variable
    // i.e assign index 0 to the variable named results
    const [results] = await pool.query(`SELECT * FROM recipes`);
    
    // we can values to the hbs file when it is being rendered by
    // passing an obejct as the second parameter of res.render
    res.render('recipes', { 
        'recipes': results
    })

});

router.get('/create', async function(req,res){
    const [categories] = await pool.query("SELECT * FROM categories");
    const [cuisines] = await pool.query("SELECT * FROM cuisines");
    const [tags] = await pool.query("SELECT * FROM tags");


    res.render('admin/recipes/create', {
        categories, cuisines, tags
    })
})

router.post('/create', async function(req,res){

    const newRecipeId = await recipeDataLayer.createRecipe(req.body);
    if (newRecipeId) {
        res.redirect('/admin/recipes');
    } else {
        res.send("Error adding new recipe");
    }

})

module.exports = router;