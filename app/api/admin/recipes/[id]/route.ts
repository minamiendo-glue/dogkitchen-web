import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadToR2, generateSafeFileName, getContentTypeFromFileName } from '@/lib/cloudflare-r2';
import { calculateRecipeNutrition } from '@/lib/nutrition-calculator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const recipeId = resolvedParams.id;

    if (!recipeId) {
      return NextResponse.json(
        { error: 'レシピIDが必要です' },
        { status: 400 }
      );
    }

    // Supabaseからレシピを取得
    const { data: recipe, error } = await supabaseAdmin
      ?.from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single();

    if (error) {
      console.error('Recipe fetch error:', error);
      return NextResponse.json(
        { error: 'レシピの取得に失敗しました' },
        { status: 500 }
      );
    }

    if (!recipe) {
      return NextResponse.json(
        { error: 'レシピが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      recipe: {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        status: recipe.status,
        createdAt: recipe.created_at,
        updatedAt: recipe.updated_at,
        cookingTime: recipe.cooking_time,
        servings: recipe.servings,
        lifeStage: recipe.life_stage,
        proteinType: recipe.protein_type,
        mealScene: recipe.meal_scene,
        difficulty: recipe.difficulty,
        healthConditions: recipe.health_conditions || [],
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        nutritionInfo: recipe.nutrition_info || {
          calories: 0,
          protein: 0,
          fat: 0,
          carbs: 0,
          fiber: 0,
          calculated_at: null
        },
        thumbnailUrl: recipe.thumbnail_url,
        mainVideoId: recipe.main_video_id,
        mainVideoUrl: recipe.main_video_url
      }
    });

  } catch (error) {
    console.error('Recipe detail API error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const recipeId = resolvedParams.id;

    if (!recipeId) {
      return NextResponse.json(
        { error: 'レシピIDが必要です' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    
    // ファイルアップロード処理（新規アップロードがある場合）
    const thumbnailFile = formData.get('thumbnail') as File;
    const mainVideoId = formData.get('mainVideoId')?.toString();
    const mainVideoUrl = formData.get('mainVideoUrl')?.toString();
    
    let thumbnailUrl = formData.get('thumbnailUrl') as string || '';
    
    // 新しいサムネイル画像の処理
    if (thumbnailFile && thumbnailFile.size > 0) {
      const fileBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const fileName = generateSafeFileName(thumbnailFile.name, 'recipes/thumbnails/');
      const contentType = getContentTypeFromFileName(thumbnailFile.name);
      
      const uploadResult = await uploadToR2(fileBuffer, fileName, contentType);
      thumbnailUrl = uploadResult.url;
    }
    
    // 手順の動画ファイルを処理
    const instructions = JSON.parse(formData.get('instructions') as string || '[]');
    const processedInstructions = [];
    
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      const instructionVideoFile = formData.get(`instructionVideo_${i}`) as File;
      
      if (instructionVideoFile && instructionVideoFile.size > 0) {
        const fileBuffer = Buffer.from(await instructionVideoFile.arrayBuffer());
        const fileName = generateSafeFileName(instructionVideoFile.name, 'recipes/instructions/');
        const contentType = getContentTypeFromFileName(instructionVideoFile.name);
        
        const uploadResult = await uploadToR2(fileBuffer, fileName, contentType);
        instruction.videoUrl = uploadResult.url;
      }
      
      processedInstructions.push(instruction);
    }
    
    // フォームデータを解析
    const ingredients = JSON.parse(formData.get('ingredients') as string || '[]');
    
    // 材料データの構造を正規化
    const normalizedIngredients = ingredients.map((ingredient: any) => {
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
    
    console.log('Original ingredients:', ingredients);
    console.log('Normalized ingredients:', normalizedIngredients);
    
    // 栄養価を再計算
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
        console.log('Recalculating nutrition for normalized ingredients:', normalizedIngredients);
        const calculatedNutrition = await calculateRecipeNutrition(normalizedIngredients);
        nutritionInfo = {
          ...calculatedNutrition,
          calculated_at: new Date().toISOString()
        };
        console.log('Recalculated nutrition:', nutritionInfo);
      } catch (error) {
        console.error('Nutrition recalculation failed:', error);
        // 栄養価計算に失敗してもレシピ更新は続行
      }
    }

    const updateData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      cooking_time: parseInt(formData.get('cookingTime') as string),
      servings: formData.get('servings') as string,
      life_stage: formData.get('lifeStage') as string,
      protein_type: formData.get('proteinType') as string,
      meal_scene: formData.get('mealScene') as string,
      difficulty: formData.get('difficulty') as string,
      health_conditions: JSON.parse(formData.get('healthConditions') as string || '[]'),
      ingredients: ingredients,
      instructions: processedInstructions,
      nutrition_info: nutritionInfo,
      status: formData.get('status') as 'draft' | 'published',
      thumbnail_url: thumbnailUrl,
      main_video_id: mainVideoId,
      main_video_url: mainVideoUrl,
      updated_at: new Date().toISOString()
    };

    // バリデーション
    if (!updateData.title || !updateData.description || !updateData.cooking_time) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    // Supabaseでレシピを更新
    const { data: updatedRecipe, error: updateError } = await supabaseAdmin
      .from('recipes')
      .update(updateData)
      .eq('id', recipeId)
      .select()
      .single();

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json(
        { error: 'レシピの更新に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      recipe: updatedRecipe,
      message: 'レシピが正常に更新されました'
    });

  } catch (error) {
    console.error('Recipe update error:', error);
    return NextResponse.json(
      { error: 'レシピの更新に失敗しました' },
      { status: 500 }
    );
  }
}
