-- 管理設定テーブルの作成
CREATE TABLE IF NOT EXISTS admin_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 更新日時を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_admin_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーの作成
DROP TRIGGER IF EXISTS update_admin_settings_updated_at ON admin_settings;
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_settings_updated_at();

-- 初期設定データを挿入
INSERT INTO admin_settings (key, value) VALUES 
('system_settings', '{
  "siteName": "DOG KITCHEN",
  "siteDescription": "愛犬のためのヘルシーレシピサイト",
  "maintenanceMode": false,
  "maintenanceMessage": "現在メンテナンス中です。しばらくお待ちください。",
  "maxFileSize": 10,
  "maxVideoSize": 500,
  "sessionTimeout": 30,
  "loginAttempts": 5,
  "enableTwoFactor": false,
  "enableIpRestriction": false,
  "allowedIps": [],
  "featuredVideo": {
    "src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  }
}')
ON CONFLICT (key) DO NOTHING;