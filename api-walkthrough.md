# Step 1: Initialize an Express Application with access to MySQL DB
```
npm init -y
npm install express mysql2
```

# Step 2: Create `index.js`
```
const express = require('express');
const mysql2 = require('mysql2/promise');

const app = express();

// enable express to use json for data communication
app.use(express.json());

app.get('/api/', function(req,res){
    res.json({
        'message':'API is ok'
    })
})

app.listen(3000, function(){
    console.log("Server has started");
})
```

# Step 3: Install `nodemon`
In the terminal, type `npm install -g nodemon`
* Have to do this for every new codespace
* Run with `nodemon`

# Step 4: Get all recipes
* Write a sample SQL to get all the recipes along with its cusine and category name
```
SELECT recipes.*, cuisines.name AS cuisine_name, categories.name AS category_name, tags.*, GROUP_CONCAT(tags.name) AS tags FROM recipes 
 JOIN cuisines
    ON recipes.cuisine_id = cuisines.cuisine_id
 JOIN categories
    ON recipes.category_id = categories.category_id
 JOIN recipes_tags
    ON recipes.recipe_id = recipes_tags.recipe_id
 JOIN tags
    ON recipes_tags.tag_id = tags.tag_id
 GROUP BY recipes.recipe_id
```