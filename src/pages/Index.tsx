import Hero from "@/components/Hero";
import IngredientInput from "@/components/IngredientInput";
import RecipeCards from "@/components/RecipeCards";
import Features from "@/components/Features";
import SmartPantry from "@/components/SmartPantry";
import AIRecipeGenerator from "@/components/AIRecipeGenerator";
import MealPlanner from "@/components/MealPlanner";
import Gamification from "@/components/Gamification";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <IngredientInput />
      <AIRecipeGenerator />
      <RecipeCards />
      <SmartPantry />
      <MealPlanner />
      <Gamification />
      <Features />
    </div>
  );
};

export default Index;
