-- FAQテーブルの手動作成用SQLスクリプト
-- SupabaseのSQL Editorで実行してください

-- 1. テーブル作成
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. インデックス作成
CREATE INDEX IF NOT EXISTS idx_faqs_status ON faqs(status);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_created_at ON faqs(created_at);

-- 3. 更新日時の自動更新トリガー関数
CREATE OR REPLACE FUNCTION update_faqs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. トリガー作成
DROP TRIGGER IF EXISTS trigger_update_faqs_updated_at ON faqs;
CREATE TRIGGER trigger_update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_faqs_updated_at();

-- 5. サンプルデータ挿入
INSERT INTO faqs (question, answer, display_order, status) VALUES
('DOG KITCHENとは何ですか？', 'DOG KITCHENは愛犬の健康をサポートする手作りご飯レシピサイトです。ライフステージや体の悩みに合わせた、栄養バランスの良いレシピを提供しています。', 1, 'published'),
('プレミアム機能にはどのようなものがありますか？', 'プレミアム機能では、愛犬の体重や年齢を入力するだけで最適な食材量を自動計算する機能や、詳細な栄養情報の表示、専用のレシピ動画などがご利用いただけます。', 2, 'published'),
('レシピの信頼性はどの程度ですか？', 'すべてのレシピは獣医師監修のもと、栄養バランスを考慮して作成されています。愛犬の健康を第一に考えた、安全で美味しいレシピをお届けしています。', 3, 'published'),
('アレルギー対応のレシピはありますか？', 'はい、アレルギー対応のレシピも豊富にご用意しています。レシピ検索で「アレルギー対応」を選択することで、お探しのレシピを見つけることができます。', 4, 'published'),
('プレミアムプランの料金はいくらですか？', 'プレミアムプランは月額500円でご利用いただけます。愛犬の健康管理をサポートする全機能を無制限でご利用いただけます。', 5, 'published'),
('レシピの保存はできますか？', 'はい、お気に入り機能でお気に入りのレシピを保存できます。ログイン後、レシピカードのハートマークをクリックして保存してください。', 6, 'published'),
('動画レシピの再生速度は変更できますか？', 'はい、動画プレイヤーの速度変更ボタンから、0.5倍速から2倍速までお好みの速度でご覧いただけます。', 7, 'published'),
('アカウントの削除はできますか？', 'はい、マイページの設定からアカウントを削除することができます。削除後はデータの復旧ができませんので、ご注意ください。', 8, 'published')
ON CONFLICT DO NOTHING;

-- 確認クエリ
SELECT COUNT(*) as faq_count FROM faqs;
SELECT * FROM faqs ORDER BY display_order LIMIT 3;
