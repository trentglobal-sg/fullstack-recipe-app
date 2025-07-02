INSERT INTO categories (name) VALUES ('Main');
INSERT INTO categories (name) VALUES ('Snack');

INSERT INTO cuisines (name) VALUES ("Chinese"),("Indian"),("Japanese"),("Mexician"),("Malay"),("Western");
INSERT INTO tags (name) VALUES ("Healthy"),("Fried"),("Vegetarian"),("Unhealthy"),("Sweet"),("Savory"),("Grilled");

-- Recipe 1: Chicken Stir Fry (Chinese Main Dish)
INSERT INTO recipes (name, description, cooking_time, ingredients, steps, cuisine_id, category_id) VALUES (
  'Chicken Stir Fry',
  'A quick and flavorful Chinese stir fry with tender chicken and fresh vegetables',
  25,
  '2 chicken breasts, 1 bell pepper, 1 carrot, 2 cloves garlic, 1 tbsp ginger, 3 tbsp soy sauce, 1 tbsp oyster sauce, 2 tbsp vegetable oil',
  'Slice chicken into thin strips. Cut vegetables into even pieces. Heat oil in wok over high heat. Add chicken and cook until no longer pink. Remove chicken from wok. Add garlic and ginger, stir for 30 seconds. Add vegetables and stir fry for 2-3 minutes. Return chicken to wok. Add soy sauce and oyster sauce. Toss everything together and cook for another minute. Serve hot with rice.',
  1, 1
);

-- Recipe 2: Vegetable Samosas (Indian Snack)
INSERT INTO recipes (name, description, cooking_time, ingredients, steps, cuisine_id, category_id) VALUES (
  'Vegetable Samosas',
  'Crispy fried pastry pockets filled with spiced potatoes and peas',
  40,
  '2 cups flour, 4 tbsp oil, 1/2 cup water, 2 potatoes, 1/2 cup peas, 1 tsp cumin, 1 tsp coriander, 1/2 tsp turmeric, 1/2 tsp garam masala, 1 green chili, oil for frying',
  'Boil potatoes until tender, then dice. Mix flour and oil, add water to make dough. Knead until smooth, cover and rest for 30 minutes. Heat oil in pan, add cumin seeds until they splutter. Add diced potatoes, peas, and spices. Cook for 5 minutes, then cool. Divide dough into small balls, roll into circles. Cut each circle in half, form cones and fill with mixture. Seal edges with water. Heat oil for deep frying. Fry samosas until golden brown. Drain on paper towels.',
  2, 2
);

-- Recipe 3: Teriyaki Salmon (Japanese Main Dish)
INSERT INTO recipes (name, description, cooking_time, ingredients, steps, cuisine_id, category_id) VALUES (
  'Teriyaki Salmon',
  'Perfectly grilled salmon with sweet and savory teriyaki glaze',
  20,
  '2 salmon fillets, 1/4 cup soy sauce, 2 tbsp mirin, 2 tbsp sake, 1 tbsp sugar, 1 tsp grated ginger, 1 tbsp vegetable oil',
  'Pat salmon dry with paper towels. Mix soy sauce, mirin, sake, sugar and ginger in small bowl to make teriyaki sauce. Heat oil in pan over medium heat. Cook salmon skin-side down for 4 minutes. Flip and cook other side for 3 minutes. Pour teriyaki sauce over salmon. Cook until sauce thickens and glazes the salmon, about 2 more minutes. Serve immediately with steamed rice and vegetables.',
  3, 1
);

-- Recipe 4: Guacamole (Mexican Snack)
INSERT INTO recipes (name, description, cooking_time, ingredients, steps, cuisine_id, category_id) VALUES (
  'Guacamole',
  'Creamy avocado dip with fresh lime and cilantro',
  15,
  '3 ripe avocados, 1 lime, 1/2 red onion, 1 tomato, 1/4 cup cilantro, 1 jalapeño, salt to taste',
  'Cut avocados in half, remove pits and scoop flesh into bowl. Mash avocados with fork to desired consistency. Finely dice onion, tomato, and jalapeño. Chop cilantro. Add all ingredients to mashed avocado. Squeeze lime juice over mixture. Season with salt. Mix gently to combine. Serve immediately with tortilla chips.',
  4, 2
);

-- Recipe 5: Beef Burger (Western Main Dish)
INSERT INTO recipes (name, description, cooking_time, ingredients, steps, cuisine_id, category_id) VALUES (
  'Classic Beef Burger',
  'Juicy beef patty with all the traditional toppings',
  30,
  '1 lb ground beef, 1 egg, 1/4 cup breadcrumbs, 1 tsp Worcestershire sauce, 1/2 tsp garlic powder, salt and pepper, 4 burger buns, lettuce, tomato, onion, cheese slices, ketchup, mustard',
  'In large bowl, mix ground beef with egg, breadcrumbs, Worcestershire sauce and seasonings. Form into 4 equal patties. Heat grill or pan over medium-high heat. Cook patties for 4-5 minutes per side for medium. Add cheese during last minute to melt. Toast buns lightly. Assemble burgers with patties and desired toppings. Serve with fries or salad.',
  6, 1
);