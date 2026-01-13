import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      {/* 导航栏 */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center font-bold text-white text-lg">
              H3
            </div>
            <span className="font-semibold text-lg">Human 3.0</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="btn-secondary">
              登录
            </Link>
            <Link href="/login?mode=signup" className="btn-primary">
              开始评估
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero 区域 */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* 标签 */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-[var(--text-secondary)] mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            基于 Human 3.0 发展框架
          </div>

          {/* 主标题 */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            发现你的
            <span className="gradient-text">元类型</span>
            <br />
            开启人生升级
          </h1>

          {/* 副标题 */}
          <p className="text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed">
            通过智能自适应访谈，评估你在心智、身体、精神、使命四个象限的发展状态，
            获取个性化的转变策略，成为"多维度升级"的自己。
          </p>

          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login?mode=signup" className="btn-primary text-lg px-8 py-4">
              免费开始评估
            </Link>
            <Link href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
              了解更多
            </Link>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">4</div>
              <div className="text-sm text-[var(--text-secondary)]">生命象限</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">3</div>
              <div className="text-sm text-[var(--text-secondary)]">意识等级</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">9+</div>
              <div className="text-sm text-[var(--text-secondary)]">发展阶段</div>
            </div>
          </div>
        </div>
      </main>

      {/* 四象限介绍 */}
      <section id="how-it-works" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            四个生命象限
          </h2>
          <p className="text-[var(--text-secondary)] text-center mb-12 max-w-2xl mx-auto">
            Human 3.0 模型将人生发展分为四个相互关联的象限，真正的成长需要整合发展
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mind */}
            <div className="card quadrant-card-mind animate-slide-up" style={{ animationDelay: '0s' }}>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">心智 Mind</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                个人心理世界：思想、情感、信念、世界观、元认知能力
              </p>
            </div>

            {/* Body */}
            <div className="card quadrant-card-body animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">身体 Body</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                个人物理世界：健康、体能、营养、睡眠、精力管理
              </p>
            </div>

            {/* Spirit */}
            <div className="card quadrant-card-spirit animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">精神 Spirit</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                集体心理世界：关系、意义、社群、归属感、文化连接
              </p>
            </div>

            {/* Vocation */}
            <div className="card quadrant-card-vocation animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">使命 Vocation</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                集体物理世界：事业、价值创造、影响力、贡献与遗产
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 三个等级 */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            三个意识等级
          </h2>
          <p className="text-[var(--text-secondary)] text-center mb-12 max-w-2xl mx-auto">
            每个象限都有从从众者到整合者的发展路径，更高等级不是抛弃而是超越并包含
          </p>

          <div className="space-y-6">
            {/* Level 1 */}
            <div className="card flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-gray-400">1.0</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">从众者 Conformist</h3>
                <p className="text-[var(--text-secondary)]">
                  遵循权威和传统，非黑即白的思维。基于外部验证生活，
                  像游戏中的 NPC，按照预设脚本运行。
                </p>
              </div>
            </div>

            {/* Level 2 */}
            <div className="card flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-purple-400">2.0</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">个体者 Individualist</h3>
                <p className="text-[var(--text-secondary)]">
                  拒绝从众，追求个人目标。相信自己发现的方式是正确的，
                  成为选择自己故事线的主角，但可能把对立当作智慧。
                </p>
              </div>
            </div>

            {/* Level 3 */}
            <div className="card flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-yellow-400">3.0</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">整合者 Synthesist</h3>
                <p className="text-[var(--text-secondary)]">
                  整合多元视角，在悖论和复杂中识别真理。创造新游戏而非玩现有游戏，
                  拥有程序员级别的现实建构意识。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass p-12 rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              准备好发现你的元类型了吗？
            </h2>
            <p className="text-[var(--text-secondary)] mb-8">
              免费完成评估，获取你的个性化发展报告和转变策略
            </p>
            <Link href="/login?mode=signup" className="btn-primary text-lg px-8 py-4 inline-block">
              开始我的评估
            </Link>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="relative z-10 px-6 py-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center font-bold text-white text-sm">
              H3
            </div>
            <span className="text-[var(--text-secondary)]">Human 3.0 发展评估</span>
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            © 2024 Human 3.0. 保留所有权利。
          </div>
        </div>
      </footer>
    </div>
  );
}
