export interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time_minutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: { step: number; instruction: string }[];
  tags: string[];
  tips?: string;
  rating?: number;
  image_url?: string;
  primary_ingredients: string[]; // Main ingredients used for matching
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export const hardcodedRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    title: 'Leftover Rice Fried Rice',
    description: 'Transform your leftover rice into a delicious and satisfying fried rice with whatever vegetables and proteins you have on hand.',
    prep_time_minutes: 15,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '2 cups cooked rice (preferably day-old)',
      '2 eggs, beaten',
      '2 tbsp vegetable oil',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '1/2 cup mixed vegetables (carrots, peas, corn)',
      '2 tbsp soy sauce',
      'Salt and pepper to taste',
      '2 green onions, chopped'
    ],
    instructions: [
      { step: 1, instruction: 'Heat 1 tablespoon of oil in a large pan or wok over medium-high heat.' },
      { step: 2, instruction: 'Add beaten eggs and scramble them. Remove from pan and set aside.' },
      { step: 3, instruction: 'Add remaining oil to the pan. Add onion and garlic, cook for 2 minutes.' },
      { step: 4, instruction: 'Add mixed vegetables and cook for 3-4 minutes until tender.' },
      { step: 5, instruction: 'Add the cold rice, breaking up any clumps. Stir-fry for 5 minutes.' },
      { step: 6, instruction: 'Return scrambled eggs to the pan, add soy sauce, salt, and pepper.' },
      { step: 7, instruction: 'Stir everything together and cook for another 2 minutes.' },
      { step: 8, instruction: 'Garnish with green onions and serve hot.' }
    ],
    tags: ['Quick', 'Easy', 'Leftover Rice', 'Asian', 'One-Pan'],
    tips: 'Day-old rice works best as it\'s less sticky. Feel free to add any leftover meat or different vegetables you have.',
    rating: 4.5,
    primary_ingredients: ['rice', 'eggs', 'onion', 'garlic'],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 10,
      fiber: 3
    }
  },
  {
    id: 'recipe-2',
    title: 'Cheesy Pasta Bake',
    description: 'A comforting pasta bake using leftover pasta and whatever cheese you have in your fridge.',
    prep_time_minutes: 30,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '3 cups cooked pasta (any shape)',
      '1 1/2 cups shredded cheese (cheddar, mozzarella, or mix)',
      '1 cup milk',
      '2 tbsp flour',
      '2 tbsp butter',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '1 can diced tomatoes (optional)',
      'Salt, pepper, and Italian herbs to taste',
      '1/4 cup breadcrumbs'
    ],
    instructions: [
      { step: 1, instruction: 'Preheat oven to 375°F (190°C). Grease a baking dish.' },
      { step: 2, instruction: 'In a large pan, melt butter and sauté onion and garlic until soft.' },
      { step: 3, instruction: 'Add flour and cook for 1 minute, then gradually add milk, stirring constantly.' },
      { step: 4, instruction: 'Add most of the cheese (save some for topping) and stir until melted.' },
      { step: 5, instruction: 'Mix in cooked pasta and diced tomatoes if using. Season well.' },
      { step: 6, instruction: 'Transfer to baking dish, top with remaining cheese and breadcrumbs.' },
      { step: 7, instruction: 'Bake for 20-25 minutes until golden and bubbly.' },
      { step: 8, instruction: 'Let cool for 5 minutes before serving.' }
    ],
    tags: ['Comfort Food', 'Baked', 'Cheesy', 'Family-Friendly', 'Leftover Pasta'],
    tips: 'Add any leftover vegetables or cooked meat to make it a complete meal. You can freeze portions for later.',
    rating: 4.7,
    primary_ingredients: ['pasta', 'cheese', 'onion', 'garlic', 'tomatoes'],
    nutrition: {
      calories: 380,
      protein: 18,
      carbs: 42,
      fat: 15,
      fiber: 2
    }
  },
  {
    id: 'recipe-3',
    title: 'Veggie Chicken Stir-fry',
    description: 'Quick and healthy stir-fry using leftover chicken and whatever vegetables you have available.',
    prep_time_minutes: 20,
    servings: 3,
    difficulty: 'Easy',
    ingredients: [
      '2 cups cooked chicken, diced',
      '2 tbsp vegetable oil',
      '1 onion, sliced',
      '1 bell pepper, sliced',
      '2 carrots, julienned',
      '1 cup broccoli florets',
      '3 cloves garlic, minced',
      '1 tbsp ginger, minced',
      '3 tbsp soy sauce',
      '1 tbsp oyster sauce (optional)',
      '1 tsp sesame oil',
      '2 tsp cornstarch mixed with 2 tbsp water'
    ],
    instructions: [
      { step: 1, instruction: 'Heat oil in a large wok or skillet over high heat.' },
      { step: 2, instruction: 'Add garlic and ginger, stir-fry for 30 seconds until fragrant.' },
      { step: 3, instruction: 'Add onion and carrots, stir-fry for 3-4 minutes.' },
      { step: 4, instruction: 'Add bell pepper and broccoli, cook for another 3 minutes.' },
      { step: 5, instruction: 'Add the leftover chicken and stir to combine and heat through.' },
      { step: 6, instruction: 'Mix soy sauce, oyster sauce, and sesame oil in a small bowl.' },
      { step: 7, instruction: 'Add sauce to the pan, then add cornstarch mixture to thicken.' },
      { step: 8, instruction: 'Stir everything together for 1-2 minutes until sauce coats everything.' }
    ],
    tags: ['Healthy', 'Quick', 'Protein-Rich', 'Asian', 'Low-Carb'],
    tips: 'Serve over rice or noodles. You can substitute any vegetables you have on hand - mushrooms, snap peas, or spinach work great.',
    rating: 4.6,
    primary_ingredients: ['chicken', 'bell peppers', 'broccoli', 'carrots', 'onion', 'garlic'],
    nutrition: {
      calories: 250,
      protein: 28,
      carbs: 12,
      fat: 10,
      fiber: 4
    }
  },
  {
    id: 'recipe-4',
    title: 'Egg Scramble Supreme',
    description: 'Perfect way to use up various leftover vegetables and create a protein-packed meal.',
    prep_time_minutes: 10,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '6 large eggs',
      '2 tbsp butter or oil',
      '1/4 cup milk or cream',
      '1/2 onion, diced',
      '1/2 bell pepper, diced',
      '1/2 cup leftover vegetables (spinach, mushrooms, tomatoes)',
      '1/4 cup cheese, shredded',
      'Salt and pepper to taste',
      'Fresh herbs (optional)'
    ],
    instructions: [
      { step: 1, instruction: 'Beat eggs with milk, salt, and pepper in a bowl.' },
      { step: 2, instruction: 'Heat butter in a non-stick pan over medium-low heat.' },
      { step: 3, instruction: 'Add onion and bell pepper, cook until softened, about 3 minutes.' },
      { step: 4, instruction: 'Add other leftover vegetables and cook for another 2 minutes.' },
      { step: 5, instruction: 'Pour in beaten eggs and let them set on the bottom for 30 seconds.' },
      { step: 6, instruction: 'Using a spatula, gently push eggs from edges toward center.' },
      { step: 7, instruction: 'Continue cooking and gently stirring until eggs are almost set.' },
      { step: 8, instruction: 'Add cheese and fresh herbs, fold gently, and serve immediately.' }
    ],
    tags: ['Breakfast', 'Quick', 'Protein-Rich', 'Vegetarian', 'Customizable'],
    tips: 'Don\'t overcook the eggs - they should be creamy. This recipe works with almost any leftover vegetables.',
    rating: 4.4,
    primary_ingredients: ['eggs', 'onion', 'bell peppers', 'cheese'],
    nutrition: {
      calories: 285,
      protein: 20,
      carbs: 8,
      fat: 20,
      fiber: 2
    }
  },
  {
    id: 'recipe-5',
    title: 'Hearty Potato Hash',
    description: 'Transform leftover potatoes into a crispy, satisfying hash with whatever proteins and vegetables you have.',
    prep_time_minutes: 25,
    servings: 3,
    difficulty: 'Medium',
    ingredients: [
      '3 cups cooked potatoes, diced',
      '3 tbsp vegetable oil',
      '1 large onion, diced',
      '1 bell pepper, diced',
      '1 cup leftover meat (bacon, ham, sausage, or chicken), diced',
      '3 cloves garlic, minced',
      '1 tsp paprika',
      '1/2 tsp dried thyme',
      'Salt and pepper to taste',
      '4 eggs (optional, for topping)',
      '1/4 cup fresh parsley, chopped'
    ],
    instructions: [
      { step: 1, instruction: 'Heat oil in a large cast-iron skillet over medium-high heat.' },
      { step: 2, instruction: 'Add diced potatoes in a single layer. Cook without stirring for 5-6 minutes.' },
      { step: 3, instruction: 'Flip potatoes and cook another 5 minutes until golden and crispy.' },
      { step: 4, instruction: 'Add onion and bell pepper, cook for 4-5 minutes until softened.' },
      { step: 5, instruction: 'Add leftover meat and garlic, cook for 2-3 minutes to heat through.' },
      { step: 6, instruction: 'Season with paprika, thyme, salt, and pepper. Mix everything together.' },
      { step: 7, instruction: 'If using eggs, make wells in the hash and crack eggs into them.' },
      { step: 8, instruction: 'Cover and cook for 3-5 minutes until egg whites are set. Garnish with parsley.' }
    ],
    tags: ['Hearty', 'Breakfast', 'One-Pan', 'Crispy', 'Filling'],
    tips: 'Let the potatoes get really crispy before flipping. You can make this vegetarian by omitting the meat and adding more vegetables.',
    rating: 4.8,
    primary_ingredients: ['potatoes', 'onion', 'bell peppers', 'eggs'],
    nutrition: {
      calories: 340,
      protein: 15,
      carbs: 28,
      fat: 18,
      fiber: 4
    }
  },
  {
    id: 'recipe-6',
    title: 'Mediterranean Bread Salad',
    description: 'Give stale bread new life with this fresh and flavorful Mediterranean-inspired salad.',
    prep_time_minutes: 15,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '4 cups stale bread, cubed',
      '3 large tomatoes, chopped',
      '1 cucumber, diced',
      '1/2 red onion, thinly sliced',
      '1/4 cup olives, sliced',
      '1/4 cup fresh basil, chopped',
      '3 tbsp olive oil',
      '2 tbsp red wine vinegar',
      '1 clove garlic, minced',
      'Salt and pepper to taste',
      '1/2 cup feta cheese, crumbled (optional)'
    ],
    instructions: [
      { step: 1, instruction: 'If bread is not stale enough, toast cubes in oven at 400°F for 8-10 minutes.' },
      { step: 2, instruction: 'In a large bowl, combine tomatoes, cucumber, onion, and olives.' },
      { step: 3, instruction: 'In a small bowl, whisk together olive oil, vinegar, garlic, salt, and pepper.' },
      { step: 4, instruction: 'Add bread cubes to the vegetable mixture.' },
      { step: 5, instruction: 'Pour dressing over everything and toss well to combine.' },
      { step: 6, instruction: 'Let sit for 10-15 minutes to allow bread to absorb flavors.' },
      { step: 7, instruction: 'Add fresh basil and feta cheese if using.' },
      { step: 8, instruction: 'Toss gently and serve immediately.' }
    ],
    tags: ['Mediterranean', 'Fresh', 'No-Cook', 'Vegetarian', 'Summer'],
    tips: 'This salad is best eaten within an hour of making. You can add any leftover vegetables like peppers or carrots.',
    rating: 4.3,
    primary_ingredients: ['bread', 'tomatoes', 'onion', 'garlic'],
    nutrition: {
      calories: 220,
      protein: 6,
      carbs: 35,
      fat: 8,
      fiber: 4
    }
  },
  {
    id: 'recipe-7',
    title: 'Creamy Mushroom Risotto',
    description: 'Transform leftover rice and mushrooms into a luxurious, creamy risotto-style dish.',
    prep_time_minutes: 35,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      '2 cups cooked rice',
      '1 lb mixed mushrooms, sliced',
      '3 tbsp butter',
      '1 onion, finely diced',
      '3 cloves garlic, minced',
      '1/2 cup white wine (optional)',
      '2 cups warm chicken or vegetable broth',
      '1/2 cup heavy cream',
      '1/2 cup Parmesan cheese, grated',
      '2 tbsp fresh parsley, chopped',
      'Salt and pepper to taste'
    ],
    instructions: [
      { step: 1, instruction: 'Heat 2 tbsp butter in a large pan over medium-high heat.' },
      { step: 2, instruction: 'Add mushrooms and cook until golden and liquid evaporates, about 8 minutes.' },
      { step: 3, instruction: 'Remove mushrooms and set aside. Add remaining butter to pan.' },
      { step: 4, instruction: 'Add onion and garlic, cook until softened, about 3 minutes.' },
      { step: 5, instruction: 'Add wine if using, cook until mostly evaporated.' },
      { step: 6, instruction: 'Add cooked rice and stir to coat with the aromatics.' },
      { step: 7, instruction: 'Gradually add warm broth, stirring frequently, until rice is creamy.' },
      { step: 8, instruction: 'Stir in cream, mushrooms, Parmesan, and parsley. Season and serve hot.' }
    ],
    tags: ['Creamy', 'Elegant', 'Comfort Food', 'Italian', 'Vegetarian'],
    tips: 'Stir frequently to release the starches and create creaminess. You can add any leftover vegetables or proteins.',
    rating: 4.9,
    primary_ingredients: ['rice', 'mushrooms', 'onion', 'garlic', 'cheese'],
    nutrition: {
      calories: 420,
      protein: 12,
      carbs: 48,
      fat: 18,
      fiber: 3
    }
  },
  {
    id: 'recipe-8',
    title: 'Asian Lettuce Wraps',
    description: 'Light and fresh lettuce wraps using leftover ground meat and fresh vegetables.',
    prep_time_minutes: 20,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      '1 lb leftover ground meat (beef, turkey, or chicken)',
      '1 head butter lettuce, leaves separated',
      '2 tbsp vegetable oil',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '1 tbsp fresh ginger, minced',
      '1/4 cup soy sauce',
      '2 tbsp rice vinegar',
      '1 tbsp sesame oil',
      '1 tsp chili garlic sauce',
      '1/4 cup green onions, chopped',
      '1/4 cup peanuts, chopped',
      '1 carrot, julienned'
    ],
    instructions: [
      { step: 1, instruction: 'Wash and dry lettuce leaves, arrange on a serving platter.' },
      { step: 2, instruction: 'Heat oil in a large skillet over medium-high heat.' },
      { step: 3, instruction: 'Add onion, garlic, and ginger, cook for 2-3 minutes until fragrant.' },
      { step: 4, instruction: 'Add leftover ground meat and break up, cooking until heated through.' },
      { step: 5, instruction: 'In a small bowl, mix soy sauce, rice vinegar, sesame oil, and chili sauce.' },
      { step: 6, instruction: 'Pour sauce over meat and stir to coat evenly.' },
      { step: 7, instruction: 'Remove from heat and stir in green onions and carrots.' },
      { step: 8, instruction: 'Serve hot with lettuce cups, let everyone make their own wraps.' }
    ],
    tags: ['Light', 'Asian', 'Low-Carb', 'Interactive', 'Fresh'],
    tips: 'Serve with extra sauce on the side. You can substitute the meat with leftover chicken or even tofu for a vegetarian version.',
    rating: 4.5,
    primary_ingredients: ['ground beef', 'onion', 'garlic', 'carrots'],
    nutrition: {
      calories: 280,
      protein: 25,
      carbs: 10,
      fat: 16,
      fiber: 3
    }
  }
];

// Function to find matching recipes based on available ingredients
export const findMatchingRecipes = (
  availableIngredients: string[],
  difficulty?: string,
  maxPrepTime?: number,
  dietaryRestrictions?: string
): Recipe[] => {
  const normalizedIngredients = availableIngredients.map(ing => ing.toLowerCase().trim());
  
  let filteredRecipes = hardcodedRecipes.filter(recipe => {
    // Check if at least 2 of the primary ingredients match
    const matchingIngredients = recipe.primary_ingredients.filter(ingredient =>
      normalizedIngredients.some(available => 
        available.includes(ingredient.toLowerCase()) || 
        ingredient.toLowerCase().includes(available)
      )
    );
    
    return matchingIngredients.length >= 1; // At least 1 matching ingredient
  });

  // Filter by difficulty
  if (difficulty && difficulty !== '') {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty === difficulty);
  }

  // Filter by prep time
  if (maxPrepTime && maxPrepTime > 0) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.prep_time_minutes <= maxPrepTime);
  }

  // Filter by dietary restrictions (basic implementation)
  if (dietaryRestrictions && dietaryRestrictions.trim() !== '') {
    const restrictions = dietaryRestrictions.toLowerCase();
    if (restrictions.includes('vegetarian')) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        !recipe.primary_ingredients.some(ing => 
          ['chicken', 'beef', 'pork', 'fish', 'meat'].includes(ing.toLowerCase())
        )
      );
    }
    if (restrictions.includes('vegan')) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        !recipe.primary_ingredients.some(ing => 
          ['chicken', 'beef', 'pork', 'fish', 'meat', 'cheese', 'eggs'].includes(ing.toLowerCase())
        )
      );
    }
  }

  // Sort by number of matching ingredients (descending) and rating
  return filteredRecipes.sort((a, b) => {
    const aMatches = a.primary_ingredients.filter(ingredient =>
      normalizedIngredients.some(available => 
        available.includes(ingredient.toLowerCase()) || 
        ingredient.toLowerCase().includes(available)
      )
    ).length;
    
    const bMatches = b.primary_ingredients.filter(ingredient =>
      normalizedIngredients.some(available => 
        available.includes(ingredient.toLowerCase()) || 
        ingredient.toLowerCase().includes(available)
      )
    ).length;
    
    if (aMatches !== bMatches) {
      return bMatches - aMatches; // More matches first
    }
    
    return (b.rating || 0) - (a.rating || 0); // Higher rating first
  });
};