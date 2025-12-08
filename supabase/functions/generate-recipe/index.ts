import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients, dietaryRestrictions, difficulty, prepTime } = await req.json();

    if (!ingredients || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one ingredient is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a detailed prompt for recipe generation
    const prompt = `Create a detailed recipe using these leftover ingredients: ${ingredients.join(', ')}.

Requirements:
- Dietary restrictions: ${dietaryRestrictions || 'None'}
- Difficulty level: ${difficulty || 'Medium'}
- Maximum prep time: ${prepTime || '30'} minutes
- Focus on reducing food waste and using leftovers creatively
- Make it delicious and practical for home cooking

Please provide the response in this exact JSON format:
{
  "title": "Recipe name",
  "description": "Brief appetizing description",
  "prep_time_minutes": number,
  "servings": number,
  "difficulty": "Easy|Medium|Hard",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": [
    {"step": 1, "instruction": "Step 1 description"},
    {"step": 2, "instruction": "Step 2 description"}
  ],
  "tags": ["tag1", "tag2"],
  "tips": "Helpful cooking tips or variations"
}`;

    console.log('Generating recipe with OpenAI for ingredients:', ingredients);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a creative chef specializing in transforming leftovers into delicious meals. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const recipeContent = data.choices[0].message.content;

    console.log('Raw OpenAI response:', recipeContent);

    // Parse the JSON response
    let recipe;
    try {
      recipe = JSON.parse(recipeContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      // Fallback recipe if JSON parsing fails
      recipe = {
        title: `Leftover ${ingredients[0]} Creation`,
        description: `A delicious recipe using ${ingredients.join(', ')}`,
        prep_time_minutes: parseInt(prepTime) || 30,
        servings: 4,
        difficulty: difficulty || 'Medium',
        ingredients: ingredients,
        instructions: [
          { step: 1, instruction: `Prepare your ${ingredients.join(', ')} by cleaning and chopping as needed.` },
          { step: 2, instruction: "Heat oil in a large pan and add your ingredients." },
          { step: 3, instruction: "Cook until heated through and flavors are combined." },
          { step: 4, instruction: "Season to taste and serve hot." }
        ],
        tags: ['leftovers', 'quick', 'easy'],
        tips: "Feel free to add your favorite seasonings and spices to enhance flavor!"
      };
    }

    // Ensure required fields are present and properly formatted
    recipe.rating = 4.0 + Math.random(); // Random rating between 4.0-5.0
    recipe.created_by = null; // AI generated
    recipe.image_url = `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80`; // Default food image

    console.log('Generated recipe:', recipe);

    return new Response(
      JSON.stringify({ recipe }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-recipe function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate recipe',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});