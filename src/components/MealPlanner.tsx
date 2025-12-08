import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, ChefHat, RefreshCw, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MealPlan {
  day: string;
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
}

interface Recipe {
  id: string;
  title: string;
  prep_time_minutes: number;
  servings: number;
  difficulty: string;
  ingredients: string[];
  image_url: string;
}

const MealPlanner = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [userIngredients, setUserIngredients] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (user) {
      fetchUserIngredients();
      fetchAvailableRecipes();
      initializeMealPlan();
    }
  }, [user]);

  const fetchUserIngredients = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_ingredients')
        .select('ingredient_name')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserIngredients(data?.map(item => item.ingredient_name.toLowerCase()) || []);
    } catch (error) {
      console.error('Error fetching user ingredients:', error);
    }
  };

  const fetchAvailableRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .limit(20);

      if (error) throw error;

      const processedRecipes = data?.map(recipe => ({
        id: recipe.id,
        title: recipe.title || '',
        prep_time_minutes: recipe.prep_time_minutes || 30,
        servings: recipe.servings || 4,
        difficulty: recipe.difficulty || 'Medium',
        ingredients: Array.isArray(recipe.ingredients) 
          ? recipe.ingredients.map(ing => typeof ing === 'string' ? ing : String(ing))
          : [],
        image_url: recipe.image_url || ''
      })) || [];

      setAvailableRecipes(processedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const initializeMealPlan = () => {
    const today = new Date();
    const currentWeek = daysOfWeek.map((day, index) => {
      const date = new Date(today);
      const currentDay = today.getDay();
      const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
      date.setDate(today.getDate() + mondayOffset + index);
      
      return {
        day,
        date: date.toISOString().split('T')[0],
        breakfast: undefined,
        lunch: undefined,
        dinner: undefined
      };
    });
    
    setMealPlan(currentWeek);
  };

  const generateMealPlan = async () => {
    if (!user || availableRecipes.length === 0) return;
    
    setLoading(true);
    try {
      // Simple algorithm to assign recipes based on available ingredients
      const updatedMealPlan = mealPlan.map(day => {
        // Filter recipes that use user's ingredients
        const suitableRecipes = availableRecipes.filter(recipe => {
          const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
          return recipeIngredients.some(ing => 
            userIngredients.some(userIng => 
              userIng.includes(ing) || ing.includes(userIng)
            )
          );
        });

        // If no suitable recipes based on ingredients, use all recipes
        const recipesToUse = suitableRecipes.length > 0 ? suitableRecipes : availableRecipes;

        // Randomly assign recipes to meals
        const shuffled = [...recipesToUse].sort(() => 0.5 - Math.random());
        
        return {
          ...day,
          breakfast: shuffled[0] || null,
          lunch: shuffled[1] || null,
          dinner: shuffled[2] || null
        };
      });

      setMealPlan(updatedMealPlan);
      
      toast({
        title: "Meal plan generated!",
        description: "Your weekly leftover-based meal plan is ready",
      });
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate meal plan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async (recipeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_recipes')
        .insert({
          user_id: user.id,
          recipe_id: recipeId
        });

      if (error && error.code !== '23505') { // Ignore duplicate entries
        throw error;
      }

      toast({
        title: "Recipe saved!",
        description: "Added to your saved recipes",
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!user) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Meal Planner</h2>
            <p className="text-muted-foreground mb-4">Sign in to create personalized meal plans</p>
            <Button variant="warm" onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background" data-section="meal-planner">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Weekly Meal Planner</h2>
          <p className="text-xl text-muted-foreground">
            AI-generated meal plans based on your pantry ingredients
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-semibold">This Week's Plan</h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Week of {formatDate(mealPlan[0]?.date || '')}
              </Badge>
            </div>
            <Button 
              onClick={generateMealPlan} 
              disabled={loading}
              variant="hero"
              className="flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {loading ? 'Generating...' : 'Generate New Plan'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {mealPlan.map((day, dayIndex) => (
              <Card key={day.day} className="shadow-soft hover:shadow-glow transition-smooth">
                <CardHeader className="pb-4">
                  <CardTitle className="text-center">
                    <div className="text-lg font-bold">{day.day}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {formatDate(day.date)}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Breakfast */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-secondary-warm">Breakfast</h4>
                    {day.breakfast ? (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <h5 className="font-medium text-sm mb-1">{day.breakfast.title}</h5>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {day.breakfast.prep_time_minutes}min
                          <Users className="w-3 h-3" />
                          {day.breakfast.servings}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2 text-xs"
                          onClick={() => saveRecipe(day.breakfast!.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="p-3 bg-muted/10 rounded-lg text-center text-xs text-muted-foreground">
                        No meal planned
                      </div>
                    )}
                  </div>

                  {/* Lunch */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-accent">Lunch</h4>
                    {day.lunch ? (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <h5 className="font-medium text-sm mb-1">{day.lunch.title}</h5>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {day.lunch.prep_time_minutes}min
                          <Users className="w-3 h-3" />
                          {day.lunch.servings}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2 text-xs"
                          onClick={() => saveRecipe(day.lunch!.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="p-3 bg-muted/10 rounded-lg text-center text-xs text-muted-foreground">
                        No meal planned
                      </div>
                    )}
                  </div>

                  {/* Dinner */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-primary">Dinner</h4>
                    {day.dinner ? (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <h5 className="font-medium text-sm mb-1">{day.dinner.title}</h5>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {day.dinner.prep_time_minutes}min
                          <Users className="w-3 h-3" />
                          {day.dinner.servings}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2 text-xs"
                          onClick={() => saveRecipe(day.dinner!.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="p-3 bg-muted/10 rounded-lg text-center text-xs text-muted-foreground">
                        No meal planned
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {userIngredients.length === 0 && (
            <Card className="mt-8 bg-accent/5 border-accent/20">
              <CardContent className="text-center py-6">
                <ChefHat className="w-12 h-12 mx-auto mb-3 text-accent" />
                <h3 className="text-lg font-semibold mb-2">Add ingredients to your pantry</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  To get personalized meal plans based on your available ingredients, 
                  add some items to your smart pantry first.
                </p>
                <Button variant="fresh" onClick={() => {
                  const pantrySection = document.querySelector('[data-section="pantry"]');
                  pantrySection?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Go to Smart Pantry
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default MealPlanner;