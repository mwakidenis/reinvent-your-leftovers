import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Star, Leaf, DollarSign, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface UserStats {
  recipesUsed: number;
  foodSaverPoints: number;
  moneySaved: number;
  co2Saved: number;
  level: number;
  streak: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requirement: number;
  current: number;
  unlocked: boolean;
  category: 'recipes' | 'savings' | 'environmental' | 'streak';
}

const Gamification = () => {
  const [stats, setStats] = useState<UserStats>({
    recipesUsed: 0,
    foodSaverPoints: 0,
    moneySaved: 0,
    co2Saved: 0,
    level: 1,
    streak: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      calculateUserStats();
      initializeAchievements();
    }
  }, [user]);

  const calculateUserStats = async () => {
    if (!user) return;

    try {
      // Get saved recipes count
      const { data: savedRecipes } = await supabase
        .from('saved_recipes')
        .select('id')
        .eq('user_id', user.id);

      // Get pantry items count (simulating usage)
      const { data: pantryItems } = await supabase
        .from('user_ingredients')
        .select('id')
        .eq('user_id', user.id);

      const recipesUsed = (savedRecipes?.length || 0) * 2; // Multiply by 2 for demo
      const foodSaverPoints = recipesUsed * 10 + (pantryItems?.length || 0) * 5;
      const moneySaved = recipesUsed * 3.50; // Average $3.50 saved per recipe
      const co2Saved = recipesUsed * 0.8; // Average 0.8kg CO2 saved per recipe
      const level = Math.floor(foodSaverPoints / 100) + 1;
      const streak = Math.min(recipesUsed, 30); // Max 30 day streak for demo

      setStats({
        recipesUsed,
        foodSaverPoints,
        moneySaved,
        co2Saved,
        level,
        streak
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const initializeAchievements = () => {
    const achievementsList: Achievement[] = [
      {
        id: '1',
        title: 'First Steps',
        description: 'Save your first recipe',
        icon: <Star className="w-5 h-5" />,
        requirement: 1,
        current: stats.recipesUsed,
        unlocked: stats.recipesUsed >= 1,
        category: 'recipes'
      },
      {
        id: '2',
        title: 'Recipe Explorer',
        description: 'Use 10 different recipes',
        icon: <Trophy className="w-5 h-5" />,
        requirement: 10,
        current: stats.recipesUsed,
        unlocked: stats.recipesUsed >= 10,
        category: 'recipes'
      },
      {
        id: '3',
        title: 'Master Chef',
        description: 'Use 50 different recipes',
        icon: <Award className="w-5 h-5" />,
        requirement: 50,
        current: stats.recipesUsed,
        unlocked: stats.recipesUsed >= 50,
        category: 'recipes'
      },
      {
        id: '4',
        title: 'Money Saver',
        description: 'Save $50 by using leftovers',
        icon: <DollarSign className="w-5 h-5" />,
        requirement: 50,
        current: Math.floor(stats.moneySaved),
        unlocked: stats.moneySaved >= 50,
        category: 'savings'
      },
      {
        id: '5',
        title: 'Eco Warrior',
        description: 'Prevent 10kg of CO₂ emissions',
        icon: <Leaf className="w-5 h-5" />,
        requirement: 10,
        current: Math.floor(stats.co2Saved),
        unlocked: stats.co2Saved >= 10,
        category: 'environmental'
      },
      {
        id: '6',
        title: 'Streak Master',
        description: 'Use recipes for 7 days straight',
        icon: <Target className="w-5 h-5" />,
        requirement: 7,
        current: stats.streak,
        unlocked: stats.streak >= 7,
        category: 'streak'
      }
    ];

    setAchievements(achievementsList);
  };

  useEffect(() => {
    initializeAchievements();
  }, [stats]);

  const getLevelProgress = () => {
    const currentLevelPoints = stats.foodSaverPoints % 100;
    return (currentLevelPoints / 100) * 100;
  };

  const getNextLevelPoints = () => {
    return 100 - (stats.foodSaverPoints % 100);
  };

  if (!user) {
    return null;
  }

  return (
    <section className="py-16 bg-background" data-section="gamification">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Your Food Saver Journey</h2>
          <p className="text-xl text-muted-foreground">
            Track your impact and unlock achievements
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center shadow-soft hover:shadow-glow transition-smooth">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-primary">
                  <Trophy className="w-5 h-5" />
                  Level {stats.level}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">{stats.foodSaverPoints}</p>
                  <p className="text-sm text-muted-foreground">Food Saver Points</p>
                  <Progress value={getLevelProgress()} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    {getNextLevelPoints()} points to next level
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft hover:shadow-glow transition-smooth">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-secondary-warm">
                  <Star className="w-5 h-5" />
                  Recipes Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-secondary-warm">{stats.recipesUsed}</p>
                <p className="text-sm text-muted-foreground">Leftover transformations</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft hover:shadow-glow transition-smooth">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-accent">
                  <DollarSign className="w-5 h-5" />
                  Money Saved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-accent">${stats.moneySaved.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">By using leftovers</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft hover:shadow-glow transition-smooth">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-primary-glow">
                  <Leaf className="w-5 h-5" />
                  CO₂ Saved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary-glow">{stats.co2Saved.toFixed(1)}kg</p>
                <p className="text-sm text-muted-foreground">Environmental impact</p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-smooth ${
                      achievement.unlocked
                        ? 'bg-primary/5 border-primary/20 shadow-glow'
                        : 'bg-muted/30 border-border/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        achievement.unlocked 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${
                            achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {achievement.title}
                          </h4>
                          {achievement.unlocked && (
                            <Badge variant="secondary" className="text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{achievement.current}/{achievement.requirement}</span>
                            <span>{Math.min((achievement.current / achievement.requirement) * 100, 100).toFixed(0)}%</span>
                          </div>
                          <Progress 
                            value={Math.min((achievement.current / achievement.requirement) * 100, 100)} 
                            className="h-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Gamification;