import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateRecipeNutrition } from '@/lib/nutrition-calculator';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    // 全てのレシピを取得
    const { data: recipes, error: fetchError } = await supabaseAdmin
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return NextResponse.json(
        { error: 'レシピの取得に失敗しました' },
        { status: 500 }
      );
    }

    if (!recipes || recipes.length === 0) {
      return NextResponse.json({
        success: true,
        message: '更新対象のレシピがありません',
        updated: 0
      });
    }

    let updatedCount = 0;
    const errors = [];

    // 各レシピの栄養情報を計算・更新
    for (const recipe of recipes) {
      try {
        // 材料データの構造を正規化
        const normalizedIngredients = (recipe.ingredients || []).map((ingredient: any) => {
          // displayText形式の場合は、nameとamountに分解
          if (ingredient.displayText) {
            // displayTextから材料名と分量を抽出
            const parts = ingredient.displayText.split(' ');
            const name = parts[0] || ingredient.name || '不明な材料';
            
            // gramsフィールドがある場合はそれを使用、なければdisplayTextから抽出
            let amount;
            if (ingredient.grams && ingredient.grams > 0) {
              amount = `${ingredient.grams}g`;
            } else {
              amount = parts.slice(1).join(' ') || ingredient.unit || '適量';
            }
            
            return {
              name: name,
              amount: amount
            };
          }
          
          // 既存の形式の場合はそのまま使用
          return {
            name: ingredient.name || ingredient.ingredient_name || '不明な材料',
            amount: ingredient.amount || ingredient.quantity || ingredient.unit || '適量'
          };
        });

        // 栄養価を計算
        let nutritionInfo = {
          calories: 0,
          protein: 0,
          fat: 0,
          carbs: 0,
          fiber: 0,
          calculated_at: new Date().toISOString()
        };

        if (normalizedIngredients && normalizedIngredients.length > 0) {
          try {
            console.log(`Calculating nutrition for recipe: ${recipe.title}`);
            console.log('Normalized ingredients:', normalizedIngredients);
            
            const calculatedNutrition = await calculateRecipeNutrition(normalizedIngredients);
            nutritionInfo = {
              ...calculatedNutrition,
              calculated_at: new Date().toISOString()
            };
            
            console.log('Calculated nutrition:', nutritionInfo);
          } catch (error) {
            console.error(`Nutrition calculation failed for recipe ${recipe.title}:`, error);
            // 栄養価計算に失敗してもデフォルト値を使用
          }
        }

        // データベースを更新
        const { error: updateError } = await supabaseAdmin
          .from('recipes')
          .update({ nutrition_info: nutritionInfo })
          .eq('id', recipe.id);

        if (updateError) {
          console.error(`Failed to update nutrition for recipe ${recipe.title}:`, updateError);
          errors.push({
            recipeId: recipe.id,
            recipeTitle: recipe.title,
            error: updateError.message
          });
        } else {
          updatedCount++;
          console.log(`Successfully updated nutrition for recipe: ${recipe.title}`);
        }

      } catch (error) {
        console.error(`Error processing recipe ${recipe.title}:`, error);
        errors.push({
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `栄養情報の更新が完了しました`,
      updated: updatedCount,
      total: recipes.length,
      errors: errors
    });

  } catch (error) {
    console.error('栄養情報更新エラー:', error);
    return NextResponse.json(
      { error: '栄養情報の更新に失敗しました' },
      { status: 500 }
    );
  }
}
