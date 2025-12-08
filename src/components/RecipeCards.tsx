import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Leaf, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time_minutes: number;
  servings: number;
  difficulty: string;
  rating: number;
  image_url: string;
  tags: string[];
}

const RecipeCards = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .limit(6)
        .order('rating', { ascending: false });

      if (error) throw error;

      const processedRecipes = data?.map(recipe => ({
        ...recipe,
        tags: Array.isArray(recipe.tags) ? recipe.tags : []
      })) || [];

      setRecipes(processedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30" data-section="recipes">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Loading delicious recipes...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30" data-section="recipes">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Suggested Recipes</h2>
          <p className="text-xl text-muted-foreground">
            Based on your available ingredients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden shadow-soft hover:shadow-glow transition-smooth hover:-translate-y-1">
              {/* Recipe Image */}
              <div className="relative h-48 bg-muted">
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-background/90 text-foreground">
                    <Star className="w-3 h-3 mr-1 fill-current text-secondary-warm" />
                    {recipe.rating}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-4">
                <CardTitle className="text-xl mb-2">{recipe.title}</CardTitle>
                <p className="text-muted-foreground text-sm">{recipe.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Recipe Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {recipe.prep_time_minutes} min
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {recipe.servings} servings
                  </div>
                  <div className="flex items-center">
                    <Leaf className="w-4 h-4 mr-1" />
                    {recipe.difficulty}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>


                {/* Action Button */}
                <Button 
                  variant="warm" 
                  className="w-full"
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  View Recipe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/auth')}
          >
            Sign Up to Save Recipes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecipeCards;