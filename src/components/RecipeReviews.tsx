import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Star, ThumbsUp, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Rating } from "@/components/ui/rating";
import { Recipe } from "@/data/hardcodedRecipes";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

interface RecipeReviewsProps {
  recipe: Recipe | null;
}

// Mock reviews data for demonstration
const mockReviews: Record<string, Review[]> = {
  'recipe-1': [
    {
      id: 'review-1',
      userId: 'user-1',
      userName: 'Sarah Chen',
      rating: 5,
      comment: 'This fried rice recipe is amazing! Used leftover jasmine rice and added some frozen peas and carrots. Perfect for a quick weeknight dinner.',
      createdAt: '2024-01-15T10:30:00Z',
      helpful: 8
    },
    {
      id: 'review-2',
      userId: 'user-2',
      userName: 'Mike Johnson',
      rating: 4,
      comment: 'Great recipe! I added some leftover chicken and it turned out delicious. The tips about using day-old rice really make a difference.',
      createdAt: '2024-01-12T15:45:00Z',
      helpful: 5
    }
  ],
  'recipe-2': [
    {
      id: 'review-3',
      userId: 'user-3',
      userName: 'Emily Rodriguez',
      rating: 5,
      comment: 'Perfect comfort food! Made this with leftover penne and added some spinach. My whole family loved it. Will definitely make again!',
      createdAt: '2024-01-10T18:20:00Z',
      helpful: 12
    }
  ],
  'recipe-3': [
    {
      id: 'review-4',
      userId: 'user-4',
      userName: 'David Kim',
      rating: 4,
      comment: 'Quick and healthy! I substituted the chicken with tofu for a vegetarian version and it was still delicious. Great way to use up vegetables.',
      createdAt: '2024-01-08T12:15:00Z',
      helpful: 6
    }
  ]
};

const RecipeReviews: React.FC<RecipeReviewsProps> = ({ recipe }) => {
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  if (!recipe) {
    return null;
  }

  const reviews = mockReviews[recipe.id] || [];

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a review",
        variant: "destructive"
      });
      return;
    }

    if (userRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating",
        variant: "destructive"
      });
      return;
    }

    if (userComment.trim().length < 10) {
      toast({
        title: "Comment too short",
        description: "Please write at least 10 characters",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your feedback",
      });

      // Reset form
      setUserRating(0);
      setUserComment("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : recipe.rating || 0;

  return (
    <Card className="mt-4 shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Reviews & Ratings
          </div>
          <div className="flex items-center gap-2">
            <Rating value={averageRating} readOnly size="sm" />
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Write Review Section */}
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium">Write a Review</h4>
          
          {user ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Rating</label>
                <Rating 
                  value={userRating} 
                  onChange={setUserRating} 
                  size="md" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Review</label>
                <Textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Share your experience with this recipe..."
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleSubmitReview}
                disabled={isSubmitting || userRating === 0 || userComment.trim().length < 10}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-3">Sign in to write a review</p>
              <Button variant="outline" onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium">Community Reviews</h4>
            {reviews.map((review) => (
              <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {review.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-sm">{review.userName}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <Rating value={review.rating} readOnly size="sm" />
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                    
                    <div className="flex items-center gap-3 pt-1">
                      <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No reviews yet. Be the first to review this recipe!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeReviews;