import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Bookmark, 
  Clock, 
  Users, 
  Leaf, 
  Star,
  LogOut,
  Settings
} from 'lucide-react';

interface SavedRecipe {
  id: string;
  recipe_id: string;
  recipes: {
    id: string;
    title: string;
    description: string;
    prep_time_minutes: number;
    servings: number;
    difficulty: string;
    rating: number;
    image_url: string;
    tags: string[];
  };
}

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchProfile();
    fetchSavedRecipes();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchSavedRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select(`
          id,
          recipe_id,
          recipes (
            id,
            title,
            description,
            prep_time_minutes,
            servings,
            difficulty,
            rating,
            image_url,
            tags
          )
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      setSavedRecipes(data || []);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      toast({
        title: "Error",
        description: "Failed to load saved recipes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveRecipe = async (savedRecipeId: string) => {
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', savedRecipeId);

      if (error) throw error;

      setSavedRecipes(prev => prev.filter(item => item.id !== savedRecipeId));
      toast({
        title: "Recipe removed",
        description: "Recipe removed from your collection",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile?.display_name || 'Your Profile'}</h1>
                <p className="text-muted-foreground">{profile?.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Saved Recipes ({savedRecipes.length})
            </TabsTrigger>
            <TabsTrigger value="ingredients" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              My Pantry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading saved recipes...</p>
              </div>
            ) : savedRecipes.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No saved recipes yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start saving recipes you love to see them here
                  </p>
                  <Button onClick={() => navigate('/')} variant="fresh">
                    Browse Recipes
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((item) => (
                  <Card key={item.id} className="overflow-hidden shadow-soft hover:shadow-glow transition-smooth">
                    <div className="relative h-48">
                      <img
                        src={item.recipes.image_url}
                        alt={item.recipes.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-background/90">
                          <Star className="w-3 h-3 mr-1 fill-current text-secondary-warm" />
                          {item.recipes.rating}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">{item.recipes.title}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.recipes.description}
                      </p>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {item.recipes.prep_time_minutes}m
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {item.recipes.servings}
                        </div>
                        <div className="flex items-center">
                          <Leaf className="w-4 h-4 mr-1" />
                          {item.recipes.difficulty}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.recipes.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="warm" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/recipe/${item.recipes.id}`)}
                        >
                          View Recipe
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUnsaveRecipe(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ingredients">
            <Card className="text-center py-12">
              <CardContent>
                <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Pantry Management Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Track your ingredients and get notified before they expire
                </p>
                <Button variant="outline" disabled>
                  Add Ingredients
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;