# How to manage databases

* To see all databases in a server: `SHOW DATABASES;`
* To create a new database, we use `CREATE DATABASE recipes;`
    * Table names and column names are case sensitive
* Set the active database: `USE recipes`

# Table (DDL - Data Definition Language)
* SQL stores data in tables
* To store a recipe
   * Name of the recipe
   * Descrfiption of the recipe
   * Steps in the recipe
   * Ingredients in the recipe
   * Cuisine - store the cuisine in a different table
   * Category - store the categories in a different table
   * Tags - store the tags in a different table
* Create a table:
    ```
    CREATE TABLE cuisines (
      cuisine_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL
    ) ENGINE = INNODB;
    ```
* Show all tables in a database: `SHOW TABLES`

```
CREATE TABLE categories (
  category_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
) ENGINE = INNODB;

CREATE TABLE tags (
    tag_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
) ENGINE = INNODB;

```

# Table DML (DML - Data Manipulation Language)
* perform CUD operations on tables
    * C = Create (i.e, create new data in the database or data storage)    
    * U = Update (i.e update data in the database)
    * D = Delete (i.e, delete data in the database)
* Inserting new rows into our tables (we don't have to provide data for primary key - because it's AUTO_INCREMENT)
    ```
        INSERT INTO categories (name) VALUES ('Main');
        INSERT INTO categories (name) VALUES ('Snack');

    ```
* It's possible to insert MANY rows at one time
```
        INSERT INTO cuisines (name) VALUES ("Chinese"),("Indian"),("Japanese"),("Mexician"),("Malay"),("Western");
        INSERT INTO tags (name) VALUES ("Healthy"),("Fried"),("Vegetarian"),("Unhealthy"),("Sweet"),("Savory"),("Grilled");

``

# DQL (Data Query Language)
* R = Read (i.e, get data from database)
    * Eg: `SELECT * FROM categories;`

# Foreign Keys
* Foreign keys allows us associate one row in a table with another row in a table
  * One row in the recipe table can associate itself with the "Chinese" row in the cuisine table (i.e this recipe's cuisine is Chinese)
  * For the case of the recipe, it has the following relationship:
    * belongs to one category (btw, a category can have many recipes, aka a category has a 1:M relationship with recipe)
    * belongs to one cuisine 
    * a recipe can have many tags, a tag can also be associated with many recipes ==> M:N relationship

```
CREATE TABLE recipes (
    recipe_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cooking_time INT UNSIGNED DEFAULT 0,
    ingredients VARCHAR(1000) NOT NULL,
    steps TEXT NOT NULL,
    cuisine_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (cuisine_id) REFERENCES cuisines(cuisine_id),
    category_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (category_id) REfERENCES categories(category_id)
) ENGINE = INNODB;

```
```
INSERT INTO recipes (name, description, cooking_time, ingredients, steps, cuisine_id, category_id)
    VALUES ("Chicken Rice", "Singapore's famous hainanese chicken rice", 90, "Chicken, rice, chicken broth", "Cook rice, Cook chicken", 1, 1);
```

# Many to Many Relationships

* Create a join table (pivot table) to represent the relationship between tags and recipes
* The table name is usually a combination of both tables in the relationship, with a `_`, in alphabetical order
    ```
    CREATE TABLE recipes_tags (
        recipe_tag_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
        recipe_id INT UNSIGNED NOT NULL,
            FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
        tag_id INT UNSIGNED NOT NULL,
            FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
    ) ENGINE = INNODB;
```
* Associate the chicken rice recipe with the corresponding tags
    ```
    INSERT INTO recipes_tags (recipe_id, tag_id) VALUES (1, 4), (1, 6);
    ```