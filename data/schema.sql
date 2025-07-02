CREATE TABLE cuisines (
      cuisine_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL
    ) ENGINE = INNODB;

CREATE TABLE categories (
  category_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
) ENGINE = INNODB;

CREATE TABLE tags (
    tag_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
) ENGINE = INNODB;

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

CREATE TABLE recipes_tags (
    recipe_tag_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    recipe_id INT UNSIGNED NOT NULL,
        FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
    tag_id INT UNSIGNED NOT NULL,
        FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
) ENGINE = INNODB;