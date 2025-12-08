import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Plus, Trash2, AlertTriangle, Refrigerator } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PantryItem {
  id: string;
  ingredient_name: string;
  quantity: string;
  expiry_date: string;
  added_at: string;
}

const SmartPantry = () => {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", expiryDate: new Date() });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPantryItems();
    }
  }, [user]);

  const fetchPantryItems = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_ingredients')
        .select('*')
        .eq('user_id', user.id)
        .order('expiry_date', { ascending: true });

      if (error) throw error;
      setPantryItems(data || []);
    } catch (error) {
      console.error('Error fetching pantry items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPantryItem = async () => {
    if (!user || !newItem.name.trim()) return;

    try {
      const { error } = await supabase
        .from('user_ingredients')
        .insert({
          user_id: user.id,
          ingredient_name: newItem.name.trim(),
          quantity: newItem.quantity.trim() || null,
          expiry_date: newItem.expiryDate.toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Item added to pantry!",
        description: `${newItem.name} added successfully`,
      });

      setNewItem({ name: "", quantity: "", expiryDate: new Date() });
      setOpen(false);
      fetchPantryItems();
    } catch (error) {
      console.error('Error adding pantry item:', error);
      toast({
        title: "Error",
        description: "Failed to add item to pantry",
        variant: "destructive"
      });
    }
  };

  const removePantryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_ingredients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Item removed",
        description: "Item removed from pantry",
      });

      fetchPantryItems();
    } catch (error) {
      console.error('Error removing pantry item:', error);
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryBadgeVariant = (days: number) => {
    if (days < 0) return "destructive";
    if (days <= 2) return "destructive";
    if (days <= 5) return "secondary";
    return "outline";
  };

  if (!user) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Refrigerator className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Smart Pantry</h2>
            <p className="text-muted-foreground mb-4">Sign in to track your ingredients and get expiry notifications</p>
            <Button variant="warm" onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30" data-section="pantry">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Your Smart Pantry</h2>
          <p className="text-xl text-muted-foreground">
            Track your ingredients and never let food expire again
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Current Ingredients</h3>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="fresh">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ingredient
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Ingredient</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Ingredient Name</Label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="e.g., Tomatoes, Chicken breast..."
                    />
                  </div>
                  <div>
                    <Label>Quantity (optional)</Label>
                    <Input
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      placeholder="e.g., 2 lbs, 500g, 1 bunch..."
                    />
                  </div>
                  <div>
                    <Label>Expiry Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(newItem.expiryDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newItem.expiryDate}
                          onSelect={(date) => date && setNewItem({ ...newItem, expiryDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button onClick={addPantryItem} className="w-full" variant="warm">
                    Add to Pantry
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading your pantry...</p>
            </div>
          ) : pantryItems.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Refrigerator className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Your pantry is empty</h3>
                <p className="text-muted-foreground mb-4">Start adding ingredients to track freshness and get recipe suggestions</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pantryItems.map((item) => {
                const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date);
                return (
                  <Card key={item.id} className="shadow-soft hover:shadow-glow transition-smooth">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.ingredient_name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePantryItem(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {item.quantity && (
                        <p className="text-sm text-muted-foreground">{item.quantity}</p>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <Badge variant={getExpiryBadgeVariant(daysUntilExpiry)} className="flex items-center gap-1">
                          {daysUntilExpiry < 0 ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : daysUntilExpiry <= 2 ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : null}
                          {daysUntilExpiry < 0 
                            ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                            : daysUntilExpiry === 0
                            ? "Expires today!"
                            : `${daysUntilExpiry} days left`
                          }
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Expires {format(new Date(item.expiry_date), "MMM dd, yyyy")}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SmartPantry;