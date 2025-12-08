import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const commonIngredients = [
  "Rice", "Chicken", "Eggs", "Onions", "Garlic", "Tomatoes", 
  "Cheese", "Bread", "Potatoes", "Pasta", "Spinach", "Bell Peppers",
  "Carrots", "Mushrooms", "Broccoli", "Ground Beef", "Salmon", "Beans"
];

const IngredientInput = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  const addCustomIngredient = () => {
    if (searchTerm.trim() && !selectedIngredients.includes(searchTerm.trim())) {
      setSelectedIngredients([...selectedIngredients, searchTerm.trim()]);
      setSearchTerm("");
    }
  };

  const filteredIngredients = commonIngredients.filter(ingredient =>
    ingredient.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedIngredients.includes(ingredient)
  );

  const handleFindRecipes = () => {
    if (selectedIngredients.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please select at least one ingredient to find recipes",
        variant: "destructive"
      });
      return;
    }

    // First try AI generation, then scroll to recipes
    const aiSection = document.querySelector('[data-section="ai-generator"]');
    if (aiSection) {
      aiSection.scrollIntoView({ behavior: 'smooth' });
      
      // Populate AI generator with selected ingredients
      const event = new CustomEvent('populateIngredients', { 
        detail: { ingredients: selectedIngredients } 
      });
      window.dispatchEvent(event);
    } else {
      // Fallback to recipe section
      const recipeSection = document.querySelector('[data-section="recipes"]');
      recipeSection?.scrollIntoView({ behavior: 'smooth' });
    }

    toast({
      title: `Ready to generate recipes!`,
      description: `Using your selected ingredients: ${selectedIngredients.join(', ')}`,
    });
  };

  return (
    <section className="py-16 bg-background" data-section="ingredients">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What's in Your Kitchen?</h2>
            <p className="text-xl text-muted-foreground">
              Select ingredients you have available and we'll find perfect recipes for you
            </p>
          </div>

          <Card className="p-8 shadow-soft">
            {/* Search Input */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search or add custom ingredient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomIngredient()}
                />
              </div>
              <Button onClick={addCustomIngredient} variant="fresh">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Selected Ingredients */}
            {selectedIngredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Selected Ingredients:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredients.map((ingredient) => (
                    <Badge
                      key={ingredient}
                      variant="secondary"
                      className="text-sm px-3 py-1 cursor-pointer hover:bg-secondary-warm transition-smooth"
                      onClick={() => removeIngredient(ingredient)}
                    >
                      {ingredient}
                      <X className="w-3 h-3 ml-2" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Common Ingredients */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Common Ingredients:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredIngredients.map((ingredient) => (
                  <Button
                    key={ingredient}
                    variant="outline"
                    size="sm"
                    onClick={() => addIngredient(ingredient)}
                    className="justify-start hover:bg-accent/10 hover:border-accent transition-smooth"
                  >
                    {ingredient}
                  </Button>
                ))}
              </div>
            </div>

            {/* Find Recipes Button */}
            {selectedIngredients.length > 0 && (
              <div className="text-center">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="px-12"
                  onClick={handleFindRecipes}
                >
                  Find {selectedIngredients.length > 1 ? 'Recipes' : 'Recipe'} 
                  ({selectedIngredients.length} ingredient{selectedIngredients.length > 1 ? 's' : ''})
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default IngredientInput;