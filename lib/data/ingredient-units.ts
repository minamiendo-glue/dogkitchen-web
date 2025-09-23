export interface IngredientUnit {
  name: string;
  displayName: string;
  grams: number;
}

export interface IngredientData {
  name: string;
  category: string;
  units: IngredientUnit[];
  commonUnits: string[]; // よく使われる単位のキー
}

// 食材データベース（ジャンル別・あいうえお順）
export const ingredientDatabase: IngredientData[] = [
  // 野菜類（あいうえお順）
  {
    name: 'アルファルファ',
    category: 'vegetable',
    commonUnits: ['大さじ1', '大さじ2', '10g'],
    units: [
      { name: '大さじ1', displayName: '大さじ1', grams: 5 },
      { name: '大さじ2', displayName: '大さじ2', grams: 10 },
      { name: '10g', displayName: '10g', grams: 10 },
      { name: '20g', displayName: '20g', grams: 20 },
    ]
  },
  {
    name: 'うど',
    category: 'vegetable',
    commonUnits: ['1本', '1/2本', '100g'],
    units: [
      { name: '1本', displayName: '1本', grams: 150 },
      { name: '1/2本', displayName: '1/2本', grams: 75 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'えのき',
    category: 'vegetable',
    commonUnits: ['1パック', '1/2パック', '50g'],
    units: [
      { name: '1パック', displayName: '1パック', grams: 100 },
      { name: '1/2パック', displayName: '1/2パック', grams: 50 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'オクラ',
    category: 'vegetable',
    commonUnits: ['5本', '10本', '50g'],
    units: [
      { name: '5本', displayName: '5本', grams: 50 },
      { name: '10本', displayName: '10本', grams: 100 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'かぼちゃ',
    category: 'vegetable',
    commonUnits: ['1/8個', '1/4個', '100g'],
    units: [
      { name: '1/8個', displayName: '1/8個', grams: 150 },
      { name: '1/4個', displayName: '1/4個', grams: 300 },
      { name: '1/2個', displayName: '1/2個', grams: 600 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'キャベツ',
    category: 'vegetable',
    commonUnits: ['1/4個', '1/2個', '100g'],
    units: [
      { name: '1/4個', displayName: '1/4個', grams: 200 },
      { name: '1/2個', displayName: '1/2個', grams: 400 },
      { name: '1個', displayName: '1個', grams: 800 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'きゅうり',
    category: 'vegetable',
    commonUnits: ['1本', '2本', '100g'],
    units: [
      { name: '1本', displayName: '1本', grams: 100 },
      { name: '2本', displayName: '2本', grams: 200 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'グリーンピース',
    category: 'vegetable',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 20 },
      { name: '大さじ4', displayName: '大さじ4', grams: 40 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'ケール',
    category: 'vegetable',
    commonUnits: ['2枚', '4枚', '50g'],
    units: [
      { name: '2枚', displayName: '2枚', grams: 50 },
      { name: '4枚', displayName: '4枚', grams: 100 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'こんにゃく',
    category: 'vegetable',
    commonUnits: ['1枚', '1/2枚', '100g'],
    units: [
      { name: '1枚', displayName: '1枚', grams: 200 },
      { name: '1/2枚', displayName: '1/2枚', grams: 100 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'さつまいも',
    category: 'vegetable',
    commonUnits: ['1本', '1/2本', '100g'],
    units: [
      { name: '1本', displayName: '1本', grams: 200 },
      { name: '1/2本', displayName: '1/2本', grams: 100 },
      { name: '2本', displayName: '2本', grams: 400 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'しらたき',
    category: 'vegetable',
    commonUnits: ['1袋', '1/2袋', '100g'],
    units: [
      { name: '1袋', displayName: '1袋', grams: 200 },
      { name: '1/2袋', displayName: '1/2袋', grams: 100 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'セロリ',
    category: 'vegetable',
    commonUnits: ['1本', '1/2本', '50g'],
    units: [
      { name: '1本', displayName: '1本', grams: 100 },
      { name: '1/2本', displayName: '1/2本', grams: 50 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: '大根',
    category: 'vegetable',
    commonUnits: ['1/4本', '1/2本', '100g'],
    units: [
      { name: '1/4本', displayName: '1/4本', grams: 200 },
      { name: '1/2本', displayName: '1/2本', grams: 400 },
      { name: '1本', displayName: '1本', grams: 800 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'タンポポ',
    category: 'vegetable',
    commonUnits: ['大さじ1', '大さじ2', '5g'],
    units: [
      { name: '大さじ1', displayName: '大さじ1', grams: 3 },
      { name: '大さじ2', displayName: '大さじ2', grams: 6 },
      { name: '5g', displayName: '5g', grams: 5 },
      { name: '10g', displayName: '10g', grams: 10 },
    ]
  },
  {
    name: 'チコリ',
    category: 'vegetable',
    commonUnits: ['1個', '1/2個', '50g'],
    units: [
      { name: '1個', displayName: '1個', grams: 100 },
      { name: '1/2個', displayName: '1/2個', grams: 50 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'トマト',
    category: 'vegetable',
    commonUnits: ['1個', '2個', '100g'],
    units: [
      { name: '1個', displayName: '1個', grams: 150 },
      { name: '2個', displayName: '2個', grams: 300 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'なす',
    category: 'vegetable',
    commonUnits: ['1本', '2本', '100g'],
    units: [
      { name: '1本', displayName: '1本', grams: 100 },
      { name: '2本', displayName: '2本', grams: 200 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'にんじん',
    category: 'vegetable',
    commonUnits: ['1本', '1/2本', '100g'],
    units: [
      { name: '1本', displayName: '1本', grams: 120 },
      { name: '1/2本', displayName: '1/2本', grams: 60 },
      { name: '2本', displayName: '2本', grams: 240 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'にんにく',
    category: 'vegetable',
    commonUnits: ['1片', '2片', '5g'],
    units: [
      { name: '1片', displayName: '1片', grams: 5 },
      { name: '2片', displayName: '2片', grams: 10 },
      { name: '5g', displayName: '5g', grams: 5 },
      { name: '10g', displayName: '10g', grams: 10 },
    ]
  },
  {
    name: 'ネギ',
    category: 'vegetable',
    commonUnits: ['1本', '2本', '50g'],
    units: [
      { name: '1本', displayName: '1本', grams: 50 },
      { name: '2本', displayName: '2本', grams: 100 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'パセリ',
    category: 'vegetable',
    commonUnits: ['大さじ2', '大さじ4', '10g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 6 },
      { name: '大さじ4', displayName: '大さじ4', grams: 12 },
      { name: '10g', displayName: '10g', grams: 10 },
      { name: '20g', displayName: '20g', grams: 20 },
    ]
  },
  {
    name: 'ビーツ',
    category: 'vegetable',
    commonUnits: ['1個', '1/2個', '100g'],
    units: [
      { name: '1個', displayName: '1個', grams: 200 },
      { name: '1/2個', displayName: '1/2個', grams: 100 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ブロッコリー',
    category: 'vegetable',
    commonUnits: ['1房', '1/2房', '100g'],
    units: [
      { name: '1房', displayName: '1房', grams: 200 },
      { name: '1/2房', displayName: '1/2房', grams: 100 },
      { name: '2房', displayName: '2房', grams: 400 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ほうれん草',
    category: 'vegetable',
    commonUnits: ['1束', '1/2束', '100g'],
    units: [
      { name: '1束', displayName: '1束', grams: 200 },
      { name: '1/2束', displayName: '1/2束', grams: 100 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: '里芋',
    category: 'vegetable',
    commonUnits: ['5個', '10個', '100g'],
    units: [
      { name: '5個', displayName: '5個', grams: 150 },
      { name: '10個', displayName: '10個', grams: 300 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'レタス',
    category: 'vegetable',
    commonUnits: ['1/2個', '1個', '100g'],
    units: [
      { name: '1/2個', displayName: '1/2個', grams: 200 },
      { name: '1個', displayName: '1個', grams: 400 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'レンコン',
    category: 'vegetable',
    commonUnits: ['1節', '2節', '100g'],
    units: [
      { name: '1節', displayName: '1節', grams: 150 },
      { name: '2節', displayName: '2節', grams: 300 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },

  // 果物類（あいうえお順）
  {
    name: 'アボカド',
    category: 'fruit',
    commonUnits: ['1/2個', '1個', '100g'],
    units: [
      { name: '1/2個', displayName: '1/2個', grams: 100 },
      { name: '1個', displayName: '1個', grams: 200 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'いちご',
    category: 'fruit',
    commonUnits: ['5粒', '10粒', '100g'],
    units: [
      { name: '5粒', displayName: '5粒', grams: 75 },
      { name: '10粒', displayName: '10粒', grams: 150 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'オレンジ',
    category: 'fruit',
    commonUnits: ['1個', '1/2個', '100g'],
    units: [
      { name: '1個', displayName: '1個', grams: 200 },
      { name: '1/2個', displayName: '1/2個', grams: 100 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'キウイ',
    category: 'fruit',
    commonUnits: ['1個', '2個', '100g'],
    units: [
      { name: '1個', displayName: '1個', grams: 100 },
      { name: '2個', displayName: '2個', grams: 200 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'グレープフルーツ',
    category: 'fruit',
    commonUnits: ['1/2個', '1個', '100g'],
    units: [
      { name: '1/2個', displayName: '1/2個', grams: 150 },
      { name: '1個', displayName: '1個', grams: 300 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'さくらんぼ',
    category: 'fruit',
    commonUnits: ['10粒', '20粒', '100g'],
    units: [
      { name: '10粒', displayName: '10粒', grams: 50 },
      { name: '20粒', displayName: '20粒', grams: 100 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'すいか',
    category: 'fruit',
    commonUnits: ['1/8個', '1/4個', '200g'],
    units: [
      { name: '1/8個', displayName: '1/8個', grams: 400 },
      { name: '1/4個', displayName: '1/4個', grams: 800 },
      { name: '200g', displayName: '200g', grams: 200 },
      { name: '300g', displayName: '300g', grams: 300 },
    ]
  },
  {
    name: 'すもも',
    category: 'fruit',
    commonUnits: ['2個', '4個', '100g'],
    units: [
      { name: '2個', displayName: '2個', grams: 120 },
      { name: '4個', displayName: '4個', grams: 240 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'なし',
    category: 'fruit',
    commonUnits: ['1個', '1/2個', '100g'],
    units: [
      { name: '1個', displayName: '1個', grams: 250 },
      { name: '1/2個', displayName: '1/2個', grams: 125 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'バナナ',
    category: 'fruit',
    commonUnits: ['1本', '1/2本', '100g'],
    units: [
      { name: '1本', displayName: '1本', grams: 120 },
      { name: '1/2本', displayName: '1/2本', grams: 60 },
      { name: '2本', displayName: '2本', grams: 240 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'パイナップル',
    category: 'fruit',
    commonUnits: ['1/4個', '1/2個', '100g'],
    units: [
      { name: '1/4個', displayName: '1/4個', grams: 150 },
      { name: '1/2個', displayName: '1/2個', grams: 300 },
      { name: '1個', displayName: '1個', grams: 600 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'ぶどう',
    category: 'fruit',
    commonUnits: ['1房', '1/2房', '100g'],
    units: [
      { name: '1房', displayName: '1房', grams: 200 },
      { name: '1/2房', displayName: '1/2房', grams: 100 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ブルーベリー',
    category: 'fruit',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 20 },
      { name: '大さじ4', displayName: '大さじ4', grams: 40 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'りんご',
    category: 'fruit',
    commonUnits: ['1個', '1/2個', '100g'],
    units: [
      { name: '1個', displayName: '1個', grams: 200 },
      { name: '1/2個', displayName: '1/2個', grams: 100 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'レモン',
    category: 'fruit',
    commonUnits: ['1個', '1/2個', '50g'],
    units: [
      { name: '1個', displayName: '1個', grams: 100 },
      { name: '1/2個', displayName: '1/2個', grams: 50 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },

  // 肉類（あいうえお順）
  {
    name: 'アヒル肉',
    category: 'meat',
    commonUnits: ['100g', '150g', '200g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'イノシシ肉',
    category: 'meat',
    commonUnits: ['100g', '150g', '200g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'うさぎ肉',
    category: 'meat',
    commonUnits: ['100g', '150g', '200g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'エミュー肉',
    category: 'meat',
    commonUnits: ['100g', '150g', '200g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'カンガルー肉',
    category: 'meat',
    commonUnits: ['100g', '150g', '200g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: '鶏ささみ',
    category: 'meat',
    commonUnits: ['1本', '2本', '100g'],
    units: [
      { name: '1本', displayName: '1本', grams: 40 },
      { name: '2本', displayName: '2本', grams: 80 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: '鶏砂肝',
    category: 'meat',
    commonUnits: ['1個', '2個', '50g'],
    units: [
      { name: '1個', displayName: '1個', grams: 30 },
      { name: '2個', displayName: '2個', grams: 60 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: '鶏手羽',
    category: 'meat',
    commonUnits: ['2本', '4本', '100g'],
    units: [
      { name: '2本', displayName: '2本', grams: 80 },
      { name: '4本', displayName: '4本', grams: 160 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: '鶏むね肉',
    category: 'meat',
    commonUnits: ['1枚', '100g', '200g'],
    units: [
      { name: '1枚', displayName: '1枚', grams: 150 },
      { name: '1/2枚', displayName: '1/2枚', grams: 75 },
      { name: '2枚', displayName: '2枚', grams: 300 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: '鶏もも肉',
    category: 'meat',
    commonUnits: ['1枚', '100g', '200g'],
    units: [
      { name: '1枚', displayName: '1枚', grams: 200 },
      { name: '1/2枚', displayName: '1/2枚', grams: 100 },
      { name: '2枚', displayName: '2枚', grams: 400 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: '鶏レバー',
    category: 'meat',
    commonUnits: ['50g', '100g', '150g'],
    units: [
      { name: '30g', displayName: '30g', grams: 30 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: '牛肉',
    category: 'meat',
    commonUnits: ['100g', '150g', '200g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '80g', displayName: '80g', grams: 80 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: '牛の心臓',
    category: 'meat',
    commonUnits: ['50g', '100g', '150g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: '牛の肝臓',
    category: 'meat',
    commonUnits: ['50g', '100g', '150g'],
    units: [
      { name: '30g', displayName: '30g', grams: 30 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: '七面鳥肉',
    category: 'meat',
    commonUnits: ['100g', '150g', '200g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: '豚肉',
    category: 'meat',
    commonUnits: ['100g', '150g', '200g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '80g', displayName: '80g', grams: 80 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: '豚の心臓',
    category: 'meat',
    commonUnits: ['50g', '100g', '150g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: '豚の肝臓',
    category: 'meat',
    commonUnits: ['50g', '100g', '150g'],
    units: [
      { name: '30g', displayName: '30g', grams: 30 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: '馬肉',
    category: 'meat',
    commonUnits: ['100g', '150g', '200g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'ラム肉',
    category: 'meat',
    commonUnits: ['100g', '150g', '200g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: '羊の心臓',
    category: 'meat',
    commonUnits: ['50g', '100g', '150g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'マトン',
    category: 'meat',
    commonUnits: ['100g', '150g', '200g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },

  // 魚類（あいうえお順）
  {
    name: 'アジ',
    category: 'fish',
    commonUnits: ['1尾', '2尾', '100g'],
    units: [
      { name: '1尾', displayName: '1尾', grams: 80 },
      { name: '2尾', displayName: '2尾', grams: 160 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'アサリ',
    category: 'fish',
    commonUnits: ['50g', '100g', '150g'],
    units: [
      { name: '30g', displayName: '30g', grams: 30 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'イワシ',
    category: 'fish',
    commonUnits: ['2尾', '4尾', '100g'],
    units: [
      { name: '2尾', displayName: '2尾', grams: 80 },
      { name: '4尾', displayName: '4尾', grams: 160 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ウナギ',
    category: 'fish',
    commonUnits: ['1/2尾', '1尾', '100g'],
    units: [
      { name: '1/2尾', displayName: '1/2尾', grams: 100 },
      { name: '1尾', displayName: '1尾', grams: 200 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'エビ',
    category: 'fish',
    commonUnits: ['5尾', '10尾', '50g'],
    units: [
      { name: '5尾', displayName: '5尾', grams: 50 },
      { name: '10尾', displayName: '10尾', grams: 100 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'カレイ',
    category: 'fish',
    commonUnits: ['1尾', '1/2尾', '100g'],
    units: [
      { name: '1尾', displayName: '1尾', grams: 200 },
      { name: '1/2尾', displayName: '1/2尾', grams: 100 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'かつお節',
    category: 'fish',
    commonUnits: ['大さじ1', '大さじ2', '10g'],
    units: [
      { name: '大さじ1', displayName: '大さじ1', grams: 5 },
      { name: '大さじ2', displayName: '大さじ2', grams: 10 },
      { name: '10g', displayName: '10g', grams: 10 },
      { name: '20g', displayName: '20g', grams: 20 },
    ]
  },
  {
    name: 'カニ',
    category: 'fish',
    commonUnits: ['1杯', '1/2杯', '50g'],
    units: [
      { name: '1杯', displayName: '1杯', grams: 100 },
      { name: '1/2杯', displayName: '1/2杯', grams: 50 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'キンメダイ',
    category: 'fish',
    commonUnits: ['1切れ', '2切れ', '100g'],
    units: [
      { name: '1切れ', displayName: '1切れ', grams: 80 },
      { name: '2切れ', displayName: '2切れ', grams: 160 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: '鯉',
    category: 'fish',
    commonUnits: ['1切れ', '2切れ', '100g'],
    units: [
      { name: '1切れ', displayName: '1切れ', grams: 100 },
      { name: '2切れ', displayName: '2切れ', grams: 200 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'サバ',
    category: 'fish',
    commonUnits: ['1切れ', '2切れ', '100g'],
    units: [
      { name: '1切れ', displayName: '1切れ', grams: 80 },
      { name: '2切れ', displayName: '2切れ', grams: 160 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: '鮭',
    category: 'fish',
    commonUnits: ['1切れ', '100g', '150g'],
    units: [
      { name: '1切れ', displayName: '1切れ', grams: 80 },
      { name: '2切れ', displayName: '2切れ', grams: 160 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '80g', displayName: '80g', grams: 80 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'シジミ',
    category: 'fish',
    commonUnits: ['50g', '100g', '150g'],
    units: [
      { name: '30g', displayName: '30g', grams: 30 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'シラス',
    category: 'fish',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 10 },
      { name: '大さじ4', displayName: '大さじ4', grams: 20 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'スズキ',
    category: 'fish',
    commonUnits: ['1切れ', '2切れ', '100g'],
    units: [
      { name: '1切れ', displayName: '1切れ', grams: 100 },
      { name: '2切れ', displayName: '2切れ', grams: 200 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'タコ',
    category: 'fish',
    commonUnits: ['50g', '100g', '150g'],
    units: [
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
      { name: '200g', displayName: '200g', grams: 200 },
    ]
  },
  {
    name: 'タイ',
    category: 'fish',
    commonUnits: ['1切れ', '2切れ', '100g'],
    units: [
      { name: '1切れ', displayName: '1切れ', grams: 100 },
      { name: '2切れ', displayName: '2切れ', grams: 200 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'タラ',
    category: 'fish',
    commonUnits: ['1切れ', '2切れ', '100g'],
    units: [
      { name: '1切れ', displayName: '1切れ', grams: 80 },
      { name: '2切れ', displayName: '2切れ', grams: 160 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ちりめんじゃこ',
    category: 'fish',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 10 },
      { name: '大さじ4', displayName: '大さじ4', grams: 20 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'ツナ',
    category: 'fish',
    commonUnits: ['1缶', '1/2缶', '50g'],
    units: [
      { name: '1缶', displayName: '1缶', grams: 80 },
      { name: '1/2缶', displayName: '1/2缶', grams: 40 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'トビウオ',
    category: 'fish',
    commonUnits: ['1尾', '2尾', '100g'],
    units: [
      { name: '1尾', displayName: '1尾', grams: 100 },
      { name: '2尾', displayName: '2尾', grams: 200 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ナマズ',
    category: 'fish',
    commonUnits: ['1切れ', '2切れ', '100g'],
    units: [
      { name: '1切れ', displayName: '1切れ', grams: 100 },
      { name: '2切れ', displayName: '2切れ', grams: 200 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ハマチ',
    category: 'fish',
    commonUnits: ['1切れ', '2切れ', '100g'],
    units: [
      { name: '1切れ', displayName: '1切れ', grams: 80 },
      { name: '2切れ', displayName: '2切れ', grams: 160 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ヒラメ',
    category: 'fish',
    commonUnits: ['1切れ', '2切れ', '100g'],
    units: [
      { name: '1切れ', displayName: '1切れ', grams: 100 },
      { name: '2切れ', displayName: '2切れ', grams: 200 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ブリ',
    category: 'fish',
    commonUnits: ['1切れ', '2切れ', '100g'],
    units: [
      { name: '1切れ', displayName: '1切れ', grams: 80 },
      { name: '2切れ', displayName: '2切れ', grams: 160 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ホタテ',
    category: 'fish',
    commonUnits: ['2個', '4個', '50g'],
    units: [
      { name: '2個', displayName: '2個', grams: 50 },
      { name: '4個', displayName: '4個', grams: 100 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'マグロ',
    category: 'fish',
    commonUnits: ['1切れ', '2切れ', '100g'],
    units: [
      { name: '1切れ', displayName: '1切れ', grams: 80 },
      { name: '2切れ', displayName: '2切れ', grams: 160 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ムール貝',
    category: 'fish',
    commonUnits: ['5個', '10個', '50g'],
    units: [
      { name: '5個', displayName: '5個', grams: 50 },
      { name: '10個', displayName: '10個', grams: 100 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'メバル',
    category: 'fish',
    commonUnits: ['1尾', '2尾', '100g'],
    units: [
      { name: '1尾', displayName: '1尾', grams: 100 },
      { name: '2尾', displayName: '2尾', grams: 200 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: '牡蠣',
    category: 'fish',
    commonUnits: ['3個', '5個', '50g'],
    units: [
      { name: '3個', displayName: '3個', grams: 45 },
      { name: '5個', displayName: '5個', grams: 75 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: '蛤',
    category: 'fish',
    commonUnits: ['3個', '5個', '50g'],
    units: [
      { name: '3個', displayName: '3個', grams: 45 },
      { name: '5個', displayName: '5個', grams: 75 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: '白身魚',
    category: 'fish',
    commonUnits: ['1切れ', '100g', '150g'],
    units: [
      { name: '1切れ', displayName: '1切れ', grams: 100 },
      { name: '2切れ', displayName: '2切れ', grams: 200 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '80g', displayName: '80g', grams: 80 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },

  // 穀物類（あいうえお順）
  {
    name: 'アマランサス',
    category: 'grain',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 20 },
      { name: '大さじ4', displayName: '大さじ4', grams: 40 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'キヌア',
    category: 'grain',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 20 },
      { name: '大さじ4', displayName: '大さじ4', grams: 40 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'キビ',
    category: 'grain',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 20 },
      { name: '大さじ4', displayName: '大さじ4', grams: 40 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'オートミール',
    category: 'grain',
    commonUnits: ['大さじ3', '1/2カップ', '50g'],
    units: [
      { name: '大さじ1', displayName: '大さじ1', grams: 8 },
      { name: '大さじ3', displayName: '大さじ3', grams: 24 },
      { name: '1/2カップ', displayName: '1/2カップ', grams: 40 },
      { name: '1カップ', displayName: '1カップ', grams: 80 },
      { name: '30g', displayName: '30g', grams: 30 },
      { name: '50g', displayName: '50g', grams: 50 },
    ]
  },
  {
    name: '玄米',
    category: 'grain',
    commonUnits: ['1合', '1/2合', '100g'],
    units: [
      { name: '1合', displayName: '1合', grams: 150 },
      { name: '1/2合', displayName: '1/2合', grams: 75 },
      { name: '2合', displayName: '2合', grams: 300 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: '白米',
    category: 'grain',
    commonUnits: ['1合', '1/2合', '100g'],
    units: [
      { name: '1合', displayName: '1合', grams: 150 },
      { name: '1/2合', displayName: '1/2合', grams: 75 },
      { name: '2合', displayName: '2合', grams: 300 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: '雑穀米',
    category: 'grain',
    commonUnits: ['1合', '1/2合', '100g'],
    units: [
      { name: '1合', displayName: '1合', grams: 150 },
      { name: '1/2合', displayName: '1/2合', grams: 75 },
      { name: '2合', displayName: '2合', grams: 300 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'そば',
    category: 'grain',
    commonUnits: ['1束', '1/2束', '100g'],
    units: [
      { name: '1束', displayName: '1束', grams: 100 },
      { name: '1/2束', displayName: '1/2束', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: '大麦',
    category: 'grain',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 20 },
      { name: '大さじ4', displayName: '大さじ4', grams: 40 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'とうもろこし',
    category: 'grain',
    commonUnits: ['1/2本', '1本', '100g'],
    units: [
      { name: '1/2本', displayName: '1/2本', grams: 100 },
      { name: '1本', displayName: '1本', grams: 200 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ひえ',
    category: 'grain',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 20 },
      { name: '大さじ4', displayName: '大さじ4', grams: 40 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'もち米',
    category: 'grain',
    commonUnits: ['1合', '1/2合', '100g'],
    units: [
      { name: '1合', displayName: '1合', grams: 150 },
      { name: '1/2合', displayName: '1/2合', grams: 75 },
      { name: '2合', displayName: '2合', grams: 300 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ライ麦',
    category: 'grain',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 20 },
      { name: '大さじ4', displayName: '大さじ4', grams: 40 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },

  // その他（あいうえお順）
  {
    name: 'アーモンド',
    category: 'other',
    commonUnits: ['10粒', '20粒', '30g'],
    units: [
      { name: '10粒', displayName: '10粒', grams: 15 },
      { name: '20粒', displayName: '20粒', grams: 30 },
      { name: '30g', displayName: '30g', grams: 30 },
      { name: '50g', displayName: '50g', grams: 50 },
    ]
  },
  {
    name: '亜麻仁',
    category: 'other',
    commonUnits: ['大さじ1', '大さじ2', '10g'],
    units: [
      { name: '大さじ1', displayName: '大さじ1', grams: 7 },
      { name: '大さじ2', displayName: '大さじ2', grams: 14 },
      { name: '10g', displayName: '10g', grams: 10 },
      { name: '20g', displayName: '20g', grams: 20 },
    ]
  },
  {
    name: '亜麻仁油',
    category: 'other',
    commonUnits: ['小さじ1', '大さじ1', '5ml'],
    units: [
      { name: '小さじ1', displayName: '小さじ1', grams: 4 },
      { name: '大さじ1', displayName: '大さじ1', grams: 12 },
      { name: '5ml', displayName: '5ml', grams: 4 },
      { name: '10ml', displayName: '10ml', grams: 8 },
    ]
  },
  {
    name: 'エゴマ油',
    category: 'other',
    commonUnits: ['小さじ1', '大さじ1', '5ml'],
    units: [
      { name: '小さじ1', displayName: '小さじ1', grams: 4 },
      { name: '大さじ1', displayName: '大さじ1', grams: 12 },
      { name: '5ml', displayName: '5ml', grams: 4 },
      { name: '10ml', displayName: '10ml', grams: 8 },
    ]
  },
  {
    name: 'オイル（オリーブ）',
    category: 'other',
    commonUnits: ['小さじ1', '大さじ1', '5ml'],
    units: [
      { name: '小さじ1', displayName: '小さじ1', grams: 4 },
      { name: '大さじ1', displayName: '大さじ1', grams: 12 },
      { name: '5ml', displayName: '5ml', grams: 4 },
      { name: '10ml', displayName: '10ml', grams: 8 },
    ]
  },
  {
    name: 'かぼちゃの種',
    category: 'other',
    commonUnits: ['大さじ1', '大さじ2', '20g'],
    units: [
      { name: '大さじ1', displayName: '大さじ1', grams: 10 },
      { name: '大さじ2', displayName: '大さじ2', grams: 20 },
      { name: '20g', displayName: '20g', grams: 20 },
      { name: '30g', displayName: '30g', grams: 30 },
    ]
  },
  {
    name: 'キドニービーン',
    category: 'other',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 30 },
      { name: '大さじ4', displayName: '大さじ4', grams: 60 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'キャロブパウダー',
    category: 'other',
    commonUnits: ['小さじ1', '大さじ1', '5g'],
    units: [
      { name: '小さじ1', displayName: '小さじ1', grams: 3 },
      { name: '大さじ1', displayName: '大さじ1', grams: 9 },
      { name: '5g', displayName: '5g', grams: 5 },
      { name: '10g', displayName: '10g', grams: 10 },
    ]
  },
  {
    name: 'クルミ',
    category: 'other',
    commonUnits: ['3粒', '6粒', '20g'],
    units: [
      { name: '3粒', displayName: '3粒', grams: 10 },
      { name: '6粒', displayName: '6粒', grams: 20 },
      { name: '20g', displayName: '20g', grams: 20 },
      { name: '30g', displayName: '30g', grams: 30 },
    ]
  },
  {
    name: 'ココナッツオイル',
    category: 'other',
    commonUnits: ['小さじ1', '大さじ1', '5g'],
    units: [
      { name: '小さじ1', displayName: '小さじ1', grams: 4 },
      { name: '大さじ1', displayName: '大さじ1', grams: 12 },
      { name: '5g', displayName: '5g', grams: 5 },
      { name: '10g', displayName: '10g', grams: 10 },
    ]
  },
  {
    name: 'ココナッツフレーク',
    category: 'other',
    commonUnits: ['大さじ2', '大さじ4', '20g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 10 },
      { name: '大さじ4', displayName: '大さじ4', grams: 20 },
      { name: '20g', displayName: '20g', grams: 20 },
      { name: '30g', displayName: '30g', grams: 30 },
    ]
  },
  {
    name: 'ごま（すりごま）',
    category: 'other',
    commonUnits: ['大さじ1', '大さじ2', '10g'],
    units: [
      { name: '大さじ1', displayName: '大さじ1', grams: 9 },
      { name: '大さじ2', displayName: '大さじ2', grams: 18 },
      { name: '10g', displayName: '10g', grams: 10 },
      { name: '20g', displayName: '20g', grams: 20 },
    ]
  },
  {
    name: 'サフラワー油',
    category: 'other',
    commonUnits: ['小さじ1', '大さじ1', '5ml'],
    units: [
      { name: '小さじ1', displayName: '小さじ1', grams: 4 },
      { name: '大さじ1', displayName: '大さじ1', grams: 12 },
      { name: '5ml', displayName: '5ml', grams: 4 },
      { name: '10ml', displayName: '10ml', grams: 8 },
    ]
  },
  {
    name: 'しそ油',
    category: 'other',
    commonUnits: ['小さじ1', '大さじ1', '5ml'],
    units: [
      { name: '小さじ1', displayName: '小さじ1', grams: 4 },
      { name: '大さじ1', displayName: '大さじ1', grams: 12 },
      { name: '5ml', displayName: '5ml', grams: 4 },
      { name: '10ml', displayName: '10ml', grams: 8 },
    ]
  },
  {
    name: 'シソの実',
    category: 'other',
    commonUnits: ['大さじ1', '大さじ2', '10g'],
    units: [
      { name: '大さじ1', displayName: '大さじ1', grams: 8 },
      { name: '大さじ2', displayName: '大さじ2', grams: 16 },
      { name: '10g', displayName: '10g', grams: 10 },
      { name: '20g', displayName: '20g', grams: 20 },
    ]
  },
  {
    name: 'チーズ（無塩）',
    category: 'other',
    commonUnits: ['20g', '30g', '50g'],
    units: [
      { name: '10g', displayName: '10g', grams: 10 },
      { name: '20g', displayName: '20g', grams: 20 },
      { name: '30g', displayName: '30g', grams: 30 },
      { name: '50g', displayName: '50g', grams: 50 },
    ]
  },
  {
    name: '豆腐',
    category: 'other',
    commonUnits: ['1/2丁', '1丁', '100g'],
    units: [
      { name: '1/4丁', displayName: '1/4丁', grams: 75 },
      { name: '1/2丁', displayName: '1/2丁', grams: 150 },
      { name: '1丁', displayName: '1丁', grams: 300 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
      { name: '150g', displayName: '150g', grams: 150 },
    ]
  },
  {
    name: 'ナッツ類',
    category: 'other',
    commonUnits: ['10粒', '20粒', '30g'],
    units: [
      { name: '10粒', displayName: '10粒', grams: 15 },
      { name: '20粒', displayName: '20粒', grams: 30 },
      { name: '30g', displayName: '30g', grams: 30 },
      { name: '50g', displayName: '50g', grams: 50 },
    ]
  },
  {
    name: 'にがり',
    category: 'other',
    commonUnits: ['数滴', '小さじ1/4', '1ml'],
    units: [
      { name: '数滴', displayName: '数滴', grams: 1 },
      { name: '小さじ1/4', displayName: '小さじ1/4', grams: 1 },
      { name: '1ml', displayName: '1ml', grams: 1 },
      { name: '2ml', displayName: '2ml', grams: 2 },
    ]
  },
  {
    name: 'はちみつ',
    category: 'other',
    commonUnits: ['小さじ1', '大さじ1', '10g'],
    units: [
      { name: '小さじ1', displayName: '小さじ1', grams: 6 },
      { name: '大さじ1', displayName: '大さじ1', grams: 18 },
      { name: '10g', displayName: '10g', grams: 10 },
      { name: '20g', displayName: '20g', grams: 20 },
    ]
  },
  {
    name: 'ピーナッツバター（無塩・無糖）',
    category: 'other',
    commonUnits: ['大さじ1', '大さじ2', '20g'],
    units: [
      { name: '大さじ1', displayName: '大さじ1', grams: 15 },
      { name: '大さじ2', displayName: '大さじ2', grams: 30 },
      { name: '20g', displayName: '20g', grams: 20 },
      { name: '30g', displayName: '30g', grams: 30 },
    ]
  },
  {
    name: 'ひまわりオイル',
    category: 'other',
    commonUnits: ['小さじ1', '大さじ1', '5ml'],
    units: [
      { name: '小さじ1', displayName: '小さじ1', grams: 4 },
      { name: '大さじ1', displayName: '大さじ1', grams: 12 },
      { name: '5ml', displayName: '5ml', grams: 4 },
      { name: '10ml', displayName: '10ml', grams: 8 },
    ]
  },
  {
    name: 'フラックスシード',
    category: 'other',
    commonUnits: ['大さじ1', '大さじ2', '10g'],
    units: [
      { name: '大さじ1', displayName: '大さじ1', grams: 7 },
      { name: '大さじ2', displayName: '大さじ2', grams: 14 },
      { name: '10g', displayName: '10g', grams: 10 },
      { name: '20g', displayName: '20g', grams: 20 },
    ]
  },
  {
    name: 'ベーキングパウダー',
    category: 'other',
    commonUnits: ['小さじ1/2', '小さじ1', '2g'],
    units: [
      { name: '小さじ1/2', displayName: '小さじ1/2', grams: 2 },
      { name: '小さじ1', displayName: '小さじ1', grams: 4 },
      { name: '2g', displayName: '2g', grams: 2 },
      { name: '5g', displayName: '5g', grams: 5 },
    ]
  },
  {
    name: 'マカデミアナッツ',
    category: 'other',
    commonUnits: ['5粒', '10粒', '20g'],
    units: [
      { name: '5粒', displayName: '5粒', grams: 10 },
      { name: '10粒', displayName: '10粒', grams: 20 },
      { name: '20g', displayName: '20g', grams: 20 },
      { name: '30g', displayName: '30g', grams: 30 },
    ]
  },
  {
    name: 'みそ',
    category: 'other',
    commonUnits: ['小さじ1', '大さじ1', '10g'],
    units: [
      { name: '小さじ1', displayName: '小さじ1', grams: 6 },
      { name: '大さじ1', displayName: '大さじ1', grams: 18 },
      { name: '10g', displayName: '10g', grams: 10 },
      { name: '20g', displayName: '20g', grams: 20 },
    ]
  },
  {
    name: '卵',
    category: 'other',
    commonUnits: ['1個', '2個', '3個'],
    units: [
      { name: '1個', displayName: '1個', grams: 50 },
      { name: '2個', displayName: '2個', grams: 100 },
      { name: '3個', displayName: '3個', grams: 150 },
      { name: '1/2個', displayName: '1/2個', grams: 25 },
    ]
  },
  {
    name: 'ヨーグルト（無糖無脂肪）',
    category: 'other',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 30 },
      { name: '大さじ4', displayName: '大さじ4', grams: 60 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'りんご酢',
    category: 'other',
    commonUnits: ['小さじ1', '大さじ1', '5ml'],
    units: [
      { name: '小さじ1', displayName: '小さじ1', grams: 5 },
      { name: '大さじ1', displayName: '大さじ1', grams: 15 },
      { name: '5ml', displayName: '5ml', grams: 5 },
      { name: '10ml', displayName: '10ml', grams: 10 },
    ]
  },
  {
    name: '甘酒（米麹）',
    category: 'other',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 30 },
      { name: '大さじ4', displayName: '大さじ4', grams: 60 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: '菜種油',
    category: 'other',
    commonUnits: ['小さじ1', '大さじ1', '5ml'],
    units: [
      { name: '小さじ1', displayName: '小さじ1', grams: 4 },
      { name: '大さじ1', displayName: '大さじ1', grams: 12 },
      { name: '5ml', displayName: '5ml', grams: 4 },
      { name: '10ml', displayName: '10ml', grams: 8 },
    ]
  },
  {
    name: '豆類',
    category: 'other',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 30 },
      { name: '大さじ4', displayName: '大さじ4', grams: 60 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'ひよこ豆',
    category: 'other',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 30 },
      { name: '大さじ4', displayName: '大さじ4', grams: 60 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  },
  {
    name: 'まだら豆',
    category: 'other',
    commonUnits: ['大さじ2', '大さじ4', '50g'],
    units: [
      { name: '大さじ2', displayName: '大さじ2', grams: 30 },
      { name: '大さじ4', displayName: '大さじ4', grams: 60 },
      { name: '50g', displayName: '50g', grams: 50 },
      { name: '100g', displayName: '100g', grams: 100 },
    ]
  }
];

// ユーティリティ関数
export function getIngredientByName(name: string): IngredientData | undefined {
  return ingredientDatabase.find(ingredient => ingredient.name === name);
}

export function getIngredientUnitByName(ingredientName: string, unitName: string): IngredientUnit | undefined {
  const ingredient = getIngredientByName(ingredientName);
  return ingredient?.units.find(unit => unit.name === unitName);
}

export function convertToGrams(ingredientName: string, unitName: string): number {
  const unit = getIngredientUnitByName(ingredientName, unitName);
  return unit?.grams || 0;
}

export function getCommonIngredients(): string[] {
  return ingredientDatabase.map(ingredient => ingredient.name);
}

export function getIngredientsByCategory(category: string): string[] {
  return ingredientDatabase
    .filter(ingredient => ingredient.category === category)
    .map(ingredient => ingredient.name);
}

// カテゴリ一覧
export const ingredientCategories = [
  { key: 'vegetable', label: '野菜類' },
  { key: 'fruit', label: '果物類' },
  { key: 'meat', label: '肉類' },
  { key: 'fish', label: '魚類' },
  { key: 'grain', label: '穀物類' },
  { key: 'other', label: 'その他' }
];
