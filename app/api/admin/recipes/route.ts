import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadToR2, generateSafeFileName, getContentTypeFromFileName } from '@/lib/cloudflare-r2';
import { calculateRecipeNutrition } from '@/lib/nutrition-calculator';

// ファイルアップロード設定
const UPLOAD_CONFIG = {
  thumbnail: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    prefix: 'recipes/thumbnails/'
  },
  instructionVideo: {
    maxSize: 500 * 1024 * 1024, // 500MB
    allowedTypes: [
      'video/mp4', 
      'video/webm', 
      'video/quicktime',
      'video/x-msvideo', // AVI
      'video/avi',
      'video/x-ms-wmv', // WMV
      'video/x-flv', // FLV
      'video/3gpp', // 3GP
      'video/x-ms-asf', // ASF
      'video/x-matroska', // MKV
      'video/ogg', // OGV
      'video/x-m4v', // M4V
      'video/mov', // MOV
      'video/mpeg', // MPEG
      'video/x-ms-wm', // WMV
      'video/x-ms-wmx', // WMV
      'video/x-ms-wvx' // WMV
    ],
    prefix: 'recipes/instructions/'
  }
};

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    
    // ファイルアップロード処理
    const thumbnailFile = formData.get('thumbnail') as File;
    const mainVideoId = formData.get('mainVideoId')?.toString();
    const mainVideoUrl = formData.get('mainVideoUrl')?.toString();
    
    let thumbnailUrl = '';
    
    // サムネイル画像の処理（R2にアップロード）
    if (thumbnailFile && thumbnailFile.size > 0) {
      // ファイルサイズの検証
      if (thumbnailFile.size > UPLOAD_CONFIG.thumbnail.maxSize) {
        return NextResponse.json(
          { error: `サムネイル画像のサイズが大きすぎます。最大${UPLOAD_CONFIG.thumbnail.maxSize / (1024 * 1024)}MBまでです。` },
          { status: 400 }
        );
      }
      
      // ファイルタイプの検証
      const contentType = getContentTypeFromFileName(thumbnailFile.name);
      if (!UPLOAD_CONFIG.thumbnail.allowedTypes.includes(contentType)) {
        return NextResponse.json(
          { error: 'サムネイル画像の形式が正しくありません。JPEG、PNG、WebP形式のみ対応しています。' },
          { status: 400 }
        );
      }
      
      // ファイルをBufferに変換してR2にアップロード
      const fileBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const fileName = generateSafeFileName(thumbnailFile.name, UPLOAD_CONFIG.thumbnail.prefix);
      
      const uploadResult = await uploadToR2(fileBuffer, fileName, contentType);
      thumbnailUrl = uploadResult.url;
    }
    
    // メイン動画の処理（Cloudflare Streamの動画IDを使用）
    
    // 手順の動画ファイルを処理（R2にアップロード）
    const instructions = JSON.parse(formData.get('instructions') as string || '[]');
    const processedInstructions = [];
    
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      const instructionVideoFile = formData.get(`instructionVideo_${i}`) as File;
      
      if (instructionVideoFile && instructionVideoFile.size > 0) {
        // ファイルサイズの検証
        if (instructionVideoFile.size > UPLOAD_CONFIG.instructionVideo.maxSize) {
          return NextResponse.json(
            { error: `手順${i + 1}の動画サイズが大きすぎます。最大${UPLOAD_CONFIG.instructionVideo.maxSize / (1024 * 1024)}MBまでです。` },
            { status: 400 }
          );
        }
        
        // ファイルタイプの検証（MIMEタイプと拡張子の両方をチェック）
        const contentType = getContentTypeFromFileName(instructionVideoFile.name);
        const fileExtension = instructionVideoFile.name.toLowerCase().split('.').pop();
        const supportedExtensions = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'flv', '3gp', '3gpp', 'asf', 'mkv', 'ogv', 'ogg', 'm4v', 'mpeg', 'mpg', 'mpe', 'qt'];
        
        if (!UPLOAD_CONFIG.instructionVideo.allowedTypes.includes(contentType) && 
            !supportedExtensions.includes(fileExtension || '')) {
          return NextResponse.json(
            { error: `手順${i + 1}の動画形式が正しくありません。対応形式: MP4, WebM, MOV, AVI, WMV, FLV, 3GP, ASF, MKV, OGV, M4V, MPEG等` },
            { status: 400 }
          );
        }
        
        // ファイルをBufferに変換してR2にアップロード
        const fileBuffer = Buffer.from(await instructionVideoFile.arrayBuffer());
        const fileName = generateSafeFileName(instructionVideoFile.name, UPLOAD_CONFIG.instructionVideo.prefix);
        
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
        console.log('Calculating nutrition for normalized ingredients:', normalizedIngredients);
        const calculatedNutrition = await calculateRecipeNutrition(normalizedIngredients);
        nutritionInfo = {
          ...calculatedNutrition,
          calculated_at: new Date().toISOString()
        };
        console.log('Calculated nutrition:', nutritionInfo);
      } catch (error) {
        console.error('Nutrition calculation failed:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          ingredients: normalizedIngredients
        });
        // 栄養価計算に失敗してもレシピ作成は続行
        // デフォルト値を使用
        nutritionInfo = {
          calories: 0,
          protein: 0,
          fat: 0,
          carbs: 0,
          fiber: 0,
          calculated_at: new Date().toISOString()
        };
      }
    }

    const recipeData: any = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      cooking_time: parseInt(formData.get('cookingTime') as string),
      servings: formData.get('servings') as string,
      life_stage: formData.get('lifeStage') as string,
      protein_type: formData.get('proteinType') as string,
      meal_scene: formData.get('mealScene') as string,
      difficulty: formData.get('difficulty') as string,
      health_conditions: JSON.parse(formData.get('healthConditions') as string || '[]'),
      ingredients: ingredients, // 元の形式で保存
      instructions: processedInstructions,
      status: formData.get('status') as 'draft' | 'published',
      thumbnail_url: thumbnailUrl || formData.get('thumbnailUrl') as string || '',
      main_video_id: mainVideoId,
      main_video_url: mainVideoUrl,
      user_id: '00000000-0000-0000-0000-000000000001' // 仮のユーザーID（後で認証と連携）
    };

    // nutrition_infoカラムが存在する場合のみ追加
    // まずはnutrition_infoなしでレシピを作成して、後でカラムを追加
    console.log('Recipe data without nutrition_info:', recipeData);

    // バリデーション
    if (!recipeData.title || !recipeData.description || !recipeData.cooking_time) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    // Supabaseにレシピを保存
    const { data: newRecipe, error: insertError } = await supabaseAdmin
      .from('recipes')
      .insert(recipeData)
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      console.error('Recipe data being inserted:', JSON.stringify(recipeData, null, 2));
      return NextResponse.json(
        { 
          error: 'レシピの保存に失敗しました',
          details: insertError.message,
          code: insertError.code,
          hint: insertError.hint
        },
        { status: 500 }
      );
    }

    // レシピ作成成功後、nutrition_infoカラムが存在する場合は栄養情報を更新
    try {
      const { error: updateError } = await supabaseAdmin
        .from('recipes')
        .update({ nutrition_info: nutritionInfo })
        .eq('id', newRecipe.id);

      if (updateError) {
        console.warn('Nutrition info update failed (column may not exist):', updateError.message);
        // 栄養情報の更新に失敗してもレシピ作成は成功とする
      } else {
        console.log('Nutrition info updated successfully');
      }
    } catch (error) {
      console.warn('Nutrition info update failed:', error);
      // 栄養情報の更新に失敗してもレシピ作成は成功とする
    }

    return NextResponse.json({
      success: true,
      recipe: newRecipe,
      message: 'レシピが正常に保存されました'
    });

  } catch (error) {
    console.error('レシピ作成エラー:', error);
    return NextResponse.json(
      { error: 'レシピの作成に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    // Supabaseからレシピ一覧を取得
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
    
    return NextResponse.json({
      success: true,
      recipes: recipes || []
    });
  } catch (error) {
    console.error('レシピ取得エラー:', error);
    return NextResponse.json(
      { error: 'レシピの取得に失敗しました' },
      { status: 500 }
    );
  }
}
