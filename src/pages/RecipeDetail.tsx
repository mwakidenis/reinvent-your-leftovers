import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  Users, 
  Leaf, 
  Star, 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck,
  ChefHat 
} from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: any;
  instructions: any;
  prep_time_minutes: number;
  servings: number;
  difficulty: string;
  rating: number;
  image_url: string;
  tags: string[];
}

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecipe();
    if (user) {
      checkIfSaved();
    }
  }, [id, user]);

  const fetchRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Ensure ingredients and instructions are arrays
      const processedData = {
        ...data,
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        instructions: Array.isArray(data.instructions) ? data.instructions : [],
        tags: Array.isArray(data.tags) ? data.tags : []
      };
      
      setRecipe(processedData);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      toast({
        title: "Error",
        description: "Failed to load recipe",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('saved_recipes')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', id)
        .single();

      setIsSaved(!!data);
    } catch (error) {
      // Recipe not saved, which is fine
    }
  };

  const handleSaveRecipe = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save recipes",
      });
      navigate('/auth');
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await supabase
          .from('saved_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', id);
        
        setIsSaved(false);
        toast({
          title: "Recipe unsaved",
          description: "Recipe removed from your collection",
        });
      } else {
        await supabase
          .from('saved_recipes')
          .insert({
            user_id: user.id,
            recipe_id: id
          });
        
        setIsSaved(true);
        toast({
          title: "Recipe saved!",
          description: "Recipe added to your collection",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-12 h-12 animate-bounce text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Recipe not found</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recipe Image and Basic Info */}
          <div className="space-y-6">
            <div className="relative">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-soft"
              />
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-background/90">
                  <Star className="w-3 h-3 mr-1 fill-current text-secondary-warm" />
                  {recipe.rating}
                </Badge>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {recipe.prep_time_minutes} min
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {recipe.servings} servings
              </div>
              <div className="flex items-center">
                <Leaf className="w-5 h-5 mr-2" />
                {recipe.difficulty}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Save Button */}
            <Button 
              onClick={handleSaveRecipe}
              disabled={saving}
              variant={isSaved ? "secondary" : "outline"}
              className="w-full"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 mr-2" />
              ) : (
                <Bookmark className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : isSaved ? 'Saved to Collection' : 'Save Recipe'}
            </Button>
          </div>

          {/* Recipe Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-3">{recipe.title}</h1>
              <p className="text-lg text-muted-foreground">{recipe.description}</p>
            </div>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 mt-1">
                        {index + 1}
                      </span>
                      <span className="pt-1">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;