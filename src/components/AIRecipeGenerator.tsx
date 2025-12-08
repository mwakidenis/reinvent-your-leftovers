import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, Users, ChefHat, Loader2, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { findMatchingRecipes, Recipe } from "@/data/hardcodedRecipes";
import { Rating } from "@/components/ui/rating";
import ShoppingListGenerator from "@/components/ShoppingListGenerator";
import RecipeReviews from "@/components/RecipeReviews";

// Use the Recipe interface from hardcodedRecipes

const AIRecipeGenerator = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please add at least one ingredient to generate a recipe",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const matchingRecipes = findMatchingRecipes(
        ingredients,
        difficulty,
        prepTime ? parseInt(prepTime) : undefined,
        dietaryRestrictions
      );

      if (matchingRecipes.length === 0) {
        toast({
          title: "No recipes found",
          description: "Try different ingredients or adjust your filters",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Select the best matching recipe (first in the sorted array)
      const selectedRecipe = matchingRecipes[0];
      setGeneratedRecipe(selectedRecipe);
      
      toast({
        title: "Recipe generated!",
        description: `Found a great recipe: ${selectedRecipe.title}`,
      });
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async () => {
    if (!generatedRecipe || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('recipes')
        .insert({
          title: generatedRecipe.title,
          description: generatedRecipe.description,
          prep_time_minutes: generatedRecipe.prep_time_minutes,
          servings: generatedRecipe.servings,
          difficulty: generatedRecipe.difficulty,
          ingredients: generatedRecipe.ingredients,
          instructions: generatedRecipe.instructions,
          tags: generatedRecipe.tags,
          rating: generatedRecipe.rating || 4.5,
          image_url: generatedRecipe.image_url,
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Recipe saved!",
        description: "Your AI-generated recipe has been added to the database",
      });

      // Clear the form
      setGeneratedRecipe(null);
      setIngredients([]);
      setDietaryRestrictions("");
      setDifficulty("");
      setPrepTime("");
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="py-16 bg-muted/30" data-section="ai-generator">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">AI Recipe Generator</h2>
          <p className="text-xl text-muted-foreground">
            Let AI create unique recipes from your leftover ingredients
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Recipe Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ingredients Input */}
                <div className="space-y-3">
                  <Label>Your Ingredients</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      placeholder="Enter an ingredient..."
                      onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                    />
                    <Button onClick={addIngredient} variant="outline">
                      Add
                    </Button>
                  </div>
                  
                  {ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {ingredients.map((ingredient) => (
                        <Badge
                          key={ingredient}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-smooth"
                          onClick={() => removeIngredient(ingredient)}
                        >
                          {ingredient} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Difficulty Level</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Prep Time (minutes)</Label>
                    <Select value={prepTime} onValueChange={setPrepTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Dietary Restrictions (optional)</Label>
                  <Textarea
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    placeholder="E.g., vegetarian, gluten-free, dairy-free..."
                    rows={2}
                  />
                </div>

                <Button 
                  onClick={generateRecipe} 
                  disabled={loading || ingredients.length === 0}
                  className="w-full"
                  variant="hero"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Recipe...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Recipe
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Recipe Display */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Generated Recipe</CardTitle>
              </CardHeader>
              <CardContent>
                {!generatedRecipe ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Add ingredients and generate your first AI recipe!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Recipe Header */}
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{generatedRecipe.title}</h3>
                      <p className="text-muted-foreground">{generatedRecipe.description}</p>
                    </div>

                    {/* Recipe Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-accent" />
                          {generatedRecipe.prep_time_minutes} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-secondary-warm" />
                          {generatedRecipe.servings} servings
                        </div>
                        <div className="flex items-center gap-1">
                          <ChefHat className="w-4 h-4 text-primary" />
                          {generatedRecipe.difficulty}
                        </div>
                      </div>
                      {generatedRecipe.rating && (
                        <div className="flex items-center gap-2">
                          <Rating value={generatedRecipe.rating} readOnly size="sm" />
                          <span className="text-sm text-muted-foreground">
                            {generatedRecipe.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {generatedRecipe.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Ingredients */}
                    <div>
                      <h4 className="font-semibold mb-2">Ingredients:</h4>
                      <ul className="space-y-1">
                        {generatedRecipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="text-sm">• {ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h4 className="font-semibold mb-2">Instructions:</h4>
                      <ol className="space-y-2">
                        {generatedRecipe.instructions.map((instruction) => (
                          <li key={instruction.step} className="text-sm">
                            <span className="font-medium">{instruction.step}.</span> {instruction.instruction}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Nutrition Info */}
                    {generatedRecipe.nutrition && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Nutrition Information (per serving):</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                          <div className="text-center">
                            <div className="font-medium text-lg text-green-700 dark:text-green-300">{generatedRecipe.nutrition.calories}</div>
                            <div className="text-green-600 dark:text-green-400">Calories</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-lg text-green-700 dark:text-green-300">{generatedRecipe.nutrition.protein}g</div>
                            <div className="text-green-600 dark:text-green-400">Protein</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-lg text-green-700 dark:text-green-300">{generatedRecipe.nutrition.carbs}g</div>
                            <div className="text-green-600 dark:text-green-400">Carbs</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-lg text-green-700 dark:text-green-300">{generatedRecipe.nutrition.fat}g</div>
                            <div className="text-green-600 dark:text-green-400">Fat</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-lg text-green-700 dark:text-green-300">{generatedRecipe.nutrition.fiber}g</div>
                            <div className="text-green-600 dark:text-green-400">Fiber</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tips */}
                    {generatedRecipe.tips && (
                      <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                        <h4 className="font-semibold mb-1 text-accent">Chef's Tips:</h4>
                        <p className="text-sm text-muted-foreground">{generatedRecipe.tips}</p>
                      </div>
                    )}

                    {/* Save Button */}
                    {user && (
                      <Button 
                        onClick={saveRecipe} 
                        disabled={saving}
                        className="w-full"
                        variant="fresh"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving Recipe...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Recipe to Database
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shopping List Generator */}
            {generatedRecipe && (
              <ShoppingListGenerator 
                recipe={generatedRecipe} 
                userIngredients={ingredients}
              />
            )}

            {/* Recipe Reviews */}
            {generatedRecipe && (
              <RecipeReviews recipe={generatedRecipe} />
            )}
          </div>
        </div>

        {!user && (
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="text-center py-6">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Sign in to save your recipes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create an account to save your AI-generated recipes and access them anytime.
              </p>
              <Button variant="warm" onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default AIRecipeGenerator;