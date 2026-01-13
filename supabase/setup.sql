-- ============================================
-- Human 3.0 Assessment System - 数据库初始化脚本
-- ============================================
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本
-- 地址: https://supabase.com/dashboard → 选择项目 → SQL Editor → New Query
-- ============================================

-- 1. 创建 assessments 表
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation JSONB NOT NULL DEFAULT '[]'::jsonb,
    result JSONB,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 创建索引以加速查询
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON public.assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at DESC);

-- 3. 启用行级安全策略 (RLS)
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- 4. 删除现有策略（如果存在）避免冲突
DROP POLICY IF EXISTS "Users can view own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can insert own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can update own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can delete own assessments" ON public.assessments;

-- 5. 创建 RLS 策略 - 用户只能访问自己的数据
CREATE POLICY "Users can view own assessments"
    ON public.assessments
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
    ON public.assessments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments"
    ON public.assessments
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments"
    ON public.assessments
    FOR DELETE
    USING (auth.uid() = user_id);

-- 6. 创建自动更新 updated_at 的函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. 创建触发器
DROP TRIGGER IF EXISTS update_assessments_updated_at ON public.assessments;
CREATE TRIGGER update_assessments_updated_at
    BEFORE UPDATE ON public.assessments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 验证脚本执行成功
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ assessments 表创建成功';
    RAISE NOTICE '✅ 索引创建成功';
    RAISE NOTICE '✅ RLS 策略配置成功';
    RAISE NOTICE '✅ 触发器配置成功';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 数据库初始化完成！';
END $$;

-- 查看表结构（可选，取消注释查看）
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'assessments';
