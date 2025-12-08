-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',
  prep_time_minutes INTEGER,
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  rating DECIMAL(2,1) DEFAULT 0,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_ingredients table (pantry tracking)
CREATE TABLE public.user_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  quantity TEXT,
  expiry_date DATE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, ingredient_name)
);

-- Create saved_recipes table (user bookmarks)
CREATE TABLE public.saved_recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for recipes
CREATE POLICY "Anyone can view recipes" ON public.recipes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create recipes" ON public.recipes
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own recipes" ON public.recipes
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own recipes" ON public.recipes
  FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for user_ingredients
CREATE POLICY "Users can manage their own ingredients" ON public.user_ingredients
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for saved_recipes
CREATE POLICY "Users can manage their own saved recipes" ON public.saved_recipes
  FOR ALL USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample recipes
INSERT INTO public.recipes (title, description, ingredients, instructions, prep_time_minutes, servings, difficulty, rating, image_url, tags) VALUES
('Leftover Rice Fried Rice', 'Transform your leftover rice into a delicious, restaurant-quality fried rice.', 
 '["2 cups leftover rice", "2 eggs", "1 cup mixed vegetables", "2 tbsp soy sauce", "1 tsp sesame oil", "2 cloves garlic"]',
 '["Heat oil in a large pan", "Scramble eggs and set aside", "Stir-fry vegetables", "Add rice and soy sauce", "Combine with eggs and serve"]',
 15, 4, 'Easy', 4.8, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', 
 '{"Quick", "Asian", "Vegetarian"}'),

('Chicken & Vegetable Stir Fry', 'A colorful and nutritious way to use up your leftover vegetables and protein.',
 '["1 lb leftover chicken", "2 bell peppers", "1 onion", "3 cloves garlic", "2 tbsp olive oil", "Salt and pepper"]',
 '["Cut chicken and vegetables", "Heat oil in wok", "Stir-fry chicken first", "Add vegetables and seasonings", "Cook until tender"]',
 20, 3, 'Easy', 4.6, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
 '{"Healthy", "Protein", "Quick"}'),

('Cheesy Pasta Bake', 'A comforting pasta bake that perfect for using up leftover cheese and vegetables.',
 '["3 cups cooked pasta", "2 cups mixed cheese", "1 can tomatoes", "1 cup leftover vegetables", "Fresh herbs"]',
 '["Preheat oven to 375°F", "Mix pasta with vegetables", "Add tomatoes and half the cheese", "Top with remaining cheese", "Bake for 25 minutes"]',
 35, 6, 'Medium', 4.9, 'https://images.unsplash.com/photo-1621996346565-e3dbc350d617?w=400&h=300&fit=crop',
 '{"Comfort", "Family", "Cheesy"}');