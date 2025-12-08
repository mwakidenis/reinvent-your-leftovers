import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, Clock, Users, ChefHat, Leaf } from "lucide-react";

interface FilterOptions {
  maxPrepTime: number;
  maxServings: number;
  difficulty: string[];
  dietary: string[];
  tags: string[];
}

interface RecipeFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const difficultyOptions = [
  { id: 'Easy', label: 'Easy', icon: '👶' },
  { id: 'Medium', label: 'Medium', icon: '👨‍🍳' },
  { id: 'Hard', label: 'Hard', icon: '🏆' }
];

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
  { id: 'low-carb', label: 'Low-Carb', icon: '🥩' },
  { id: 'keto', label: 'Keto', icon: '🥑' }
];

const commonTags = [
  { id: 'quick', label: 'Quick', icon: '⚡' },
  { id: 'one-pot', label: 'One-Pot', icon: '🍲' },
  { id: 'healthy', label: 'Healthy', icon: '💚' },
  { id: 'comfort-food', label: 'Comfort Food', icon: '🤗' },
  { id: 'spicy', label: 'Spicy', icon: '🌶️' },
  { id: 'asian', label: 'Asian', icon: '🥢' },
  { id: 'italian', label: 'Italian', icon: '🍝' },
  { id: 'mexican', label: 'Mexican', icon: '🌮' }
];

const RecipeFilters: React.FC<RecipeFiltersProps> = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayFilter = (key: 'difficulty' | 'dietary' | 'tags', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters(key, newArray);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.maxPrepTime < 120) count++;
    if (filters.maxServings < 12) count++;
    if (filters.difficulty.length > 0) count++;
    if (filters.dietary.length > 0) count++;
    if (filters.tags.length > 0) count++;
    return count;
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Recipe Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {getActiveFiltersCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Less' : 'More'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time and Servings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <Label>Max Prep Time: {filters.maxPrepTime} min</Label>
            </div>
            <Slider
              value={[filters.maxPrepTime]}
              onValueChange={([value]) => updateFilters('maxPrepTime', value)}
              max={120}
              min={15}
              step={15}
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary-warm" />
              <Label>Max Servings: {filters.maxServings}</Label>
            </div>
            <Slider
              value={[filters.maxServings]}
              onValueChange={([value]) => updateFilters('maxServings', value)}
              max={12}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-primary" />
            <Label>Difficulty Level</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {difficultyOptions.map((option) => (
              <Button
                key={option.id}
                variant={filters.difficulty.includes(option.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleArrayFilter('difficulty', option.id)}
                className="flex items-center gap-1"
              >
                <span>{option.icon}</span>
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Dietary Preferences */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary-glow" />
                <Label>Dietary Preferences</Label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dietaryOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={filters.dietary.includes(option.id)}
                      onCheckedChange={() => toggleArrayFilter('dietary', option.id)}
                    />
                    <Label htmlFor={option.id} className="flex items-center gap-1 text-sm cursor-pointer">
                      <span>{option.icon}</span>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipe Tags */}
            <div className="space-y-3">
              <Label>Recipe Tags</Label>
              <div className="flex flex-wrap gap-2">
                {commonTags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant={filters.tags.includes(tag.id) ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => toggleArrayFilter('tags', tag.id)}
                    className="flex items-center gap-1"
                  >
                    <span>{tag.icon}</span>
                    {tag.label}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="space-y-2">
            <Label>Active Filters:</Label>
            <div className="flex flex-wrap gap-2">
              {filters.maxPrepTime < 120 && (
                <Badge variant="outline">≤ {filters.maxPrepTime} min</Badge>
              )}
              {filters.maxServings < 12 && (
                <Badge variant="outline">≤ {filters.maxServings} servings</Badge>
              )}
              {filters.difficulty.map(diff => (
                <Badge key={diff} variant="outline">{diff}</Badge>
              ))}
              {filters.dietary.map(diet => (
                <Badge key={diet} variant="outline">{diet}</Badge>
              ))}
              {filters.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeFilters;