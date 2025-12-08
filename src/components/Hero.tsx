import { Button } from "@/components/ui/button";
import { Search, Leaf, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const navigate = useNavigate();

  const scrollToIngredients = () => {
    const ingredientSection = document.querySelector('[data-section="ingredients"]');
    ingredientSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-6 text-center text-primary-foreground">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your
            <span className="block bg-gradient-fresh bg-clip-text text-transparent">
              Leftovers into Magic
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Discover delicious recipes using ingredients you already have. 
            Reduce food waste, save money, and create amazing meals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={scrollToIngredients}
            >
              <Search className="mr-2" />
              Find Recipes Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate('/auth')}
            >
              <Leaf className="mr-2" />
              Learn More
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="w-8 h-8 text-accent-bright" />
              </div>
              <div className="text-2xl font-bold">50%</div>
              <div className="text-sm text-primary-foreground/80">Less Food Waste</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-8 h-8 text-accent-bright" />
              </div>
              <div className="text-2xl font-bold">15 min</div>
              <div className="text-sm text-primary-foreground/80">Average Prep Time</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-accent-bright" />
              </div>
              <div className="text-2xl font-bold">10k+</div>
              <div className="text-sm text-primary-foreground/80">Happy Cooks</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;