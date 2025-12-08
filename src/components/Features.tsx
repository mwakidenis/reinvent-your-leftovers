import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Clock, Users, Target, Sparkles, TrendingUp } from "lucide-react";

const features = [
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Reduce Food Waste",
    description: "Turn ingredients destined for the trash into delicious meals. Every recipe helps reduce your environmental footprint.",
    color: "text-primary"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Quick & Easy",
    description: "Most recipes take 30 minutes or less. Perfect for busy weeknights when you need a fast solution.",
    color: "text-secondary"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Personalized Suggestions",
    description: "Get recipe recommendations based on your dietary preferences, skill level, and available time.",
    color: "text-accent"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Creative Combinations",
    description: "Discover unexpected flavor pairings and cooking techniques that transform simple leftovers.",
    color: "text-primary-glow"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community Driven",
    description: "Share your own leftover creations and learn from thousands of home cooks worldwide.",
    color: "text-secondary-warm"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Save Money",
    description: "Maximize your grocery budget by using every ingredient. Track your savings over time.",
    color: "text-accent-bright"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Leftover Magic?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            More than just recipes - we're helping you create a sustainable, creative, and economical kitchen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-soft hover:shadow-warm transition-smooth hover:-translate-y-2 border-border/50">
              <CardHeader className="pb-4">
                <div className={`inline-flex p-4 rounded-full bg-muted/50 ${feature.color} mb-4 mx-auto`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;