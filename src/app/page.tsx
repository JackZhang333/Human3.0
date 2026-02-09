'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import {
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Rocket,
  Clock,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function HomePage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle Google OAuth callback redirect error
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      window.location.href = `/auth/callback?code=${code}&redirect=/assess`;
    }
  }, [searchParams]);

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Navigation */}
      <header className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[var(--border-subtle)] bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Human 3.0" className="h-8 sm:h-10 w-auto" />
            <span className="font-bold text-xl tracking-tight hidden xs:block">HUMAN 3.0</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            <LanguageSwitcher />

            {loading ? (
              <div className="w-20 h-10 bg-[var(--bg-subtle)] animate-pulse rounded-xl" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link href="/history">
                  <Button variant="secondary" size="sm" className="hidden sm:flex rounded-full px-6">
                    {language === 'zh' ? '我的评估' : 'My Assessments'}
                  </Button>
                </Link>
                <Link href="/assess">
                  <Button size="sm" className="rounded-full px-6">
                    {language === 'zh' ? '开始' : 'Start'}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-[var(--text-secondary)]">
                  {language === 'zh' ? '退出' : 'Logout'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-transparent hover:text-[var(--accent-primary)]">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link href="/login?mode=signup">
                  <Button size="sm" className="rounded-full px-6 sm:px-8 shadow-lg shadow-[var(--accent-primary)]/20">
                    {language === 'zh' ? '加入我们' : 'Join Now'}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 lg:py-32 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[var(--accent-primary)]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto w-full relative z-10">
          <div className="flex justify-center mb-10 translate-y-[-10px] animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--accent-subtle)] text-[var(--accent-primary)] rounded-full text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              {t('hero.badge')}
            </div>
          </div>

          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tighter text-balance">
              {t('hero.title')}
              <span className="block mt-4 bg-gradient-to-r from-[var(--accent-primary)] to-red-400 bg-clip-text text-transparent">
                {t('hero.titleAccent')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-medium mb-12 px-4">
              {t('hero.subtitle')}
              <span className="text-[var(--text-primary)] font-bold decoration-[var(--accent-primary)]/30 decoration-4 underline-offset-4 underline">
                {t('hero.quadrants')}
              </span>
              {t('hero.subtitleEnd')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <Link href="/login?mode=signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-12 h-14 text-lg font-bold shadow-xl shadow-[var(--accent-primary)]/30 hover:scale-[1.02] active:scale-[0.98]">
                {t('hero.ctaPrimary')}
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://letters.thedankoe.com/p/human-30-a-map-to-reach-the-top-1"
              className="w-full sm:w-auto"
            >
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-10 h-14 text-lg font-bold border-2 bg-white/50 backdrop-blur-sm">
                {t('hero.ctaSecondary')}
              </Button>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-3xl mx-auto pt-16 border-t border-[var(--border-subtle)] animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black mb-2 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">4</div>
              <div className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">{t('hero.statQuadrants')}</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">{t('hero.statQuadrantsDesc')}</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black mb-2 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">3</div>
              <div className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">{t('hero.statLevels')}</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">{t('hero.statLevelsDesc')}</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black mb-2 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">∞</div>
              <div className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">{t('hero.statPotential')}</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">{t('hero.statPotentialDesc')}</div>
            </div>
          </div>
        </div>
      </main>

      {/* Value Proposition */}
      <section className="py-24 bg-white border-y border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="relative group">
              <div className="w-16 h-16 bg-[var(--accent-subtle)] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <CheckCircle2 className="w-8 h-8 text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('value.precise')}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {t('value.preciseDesc')}
              </p>
            </div>
            <div className="relative group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('value.insight')}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {t('value.insightDesc')}
              </p>
            </div>
            <div className="relative group">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Rocket className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('value.growth')}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {t('value.growthDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Four Quadrants Section */}
      <section id="how-it-works" className="px-6 py-32 bg-[var(--bg-subtle)]" aria-labelledby="quadrants-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 id="quadrants-heading" className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              {t('quadrants.heading')}
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-medium">
              {t('quadrants.subheading')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Mind */}
            <Card className="p-8 border-t-4 border-t-[var(--quadrant-mind)] hover:translate-y-[-8px] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--quadrant-mind)] shadow-lg shadow-[var(--quadrant-mind)]/20 flex items-center justify-center mb-6 text-white">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('quadrants.mind')}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {t('quadrants.mindDesc')}
              </p>
            </Card>

            {/* Body */}
            <Card className="p-8 border-t-4 border-t-[var(--quadrant-body)] hover:translate-y-[-8px] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--quadrant-body)] shadow-lg shadow-[var(--quadrant-body)]/20 flex items-center justify-center mb-6 text-white">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('quadrants.body')}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {t('quadrants.bodyDesc')}
              </p>
            </Card>

            {/* Spirit */}
            <Card className="p-8 border-t-4 border-t-[var(--quadrant-spirit)] hover:translate-y-[-8px] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--quadrant-spirit)] shadow-lg shadow-[var(--quadrant-spirit)]/20 flex items-center justify-center mb-6 text-white">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('quadrants.spirit')}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {t('quadrants.spiritDesc')}
              </p>
            </Card>

            {/* Vocation */}
            <Card className="p-8 border-t-4 border-t-[var(--quadrant-vocation)] hover:translate-y-[-8px] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--quadrant-vocation)] shadow-lg shadow-[var(--quadrant-vocation)]/20 flex items-center justify-center mb-6 text-white">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('quadrants.vocation')}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {t('quadrants.vocationDesc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Consciousness Levels Section */}
      <section className="px-6 py-32 bg-white" aria-labelledby="levels-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 id="levels-heading" className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              {t('levels.heading')}
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-medium">
              {t('levels.subheading')}
            </p>
          </div>

          <div className="space-y-6">
            <Card className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8 hover:bg-[var(--bg-subtle)] transition-colors border-l-8 border-l-[var(--border-subtle)]">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black text-[var(--text-tertiary)]">1.0</span>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">{t('levels.conformist')}</h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  {t('levels.conformistDesc')}
                </p>
              </div>
            </Card>

            <Card className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8 border-l-8 border-l-[var(--accent-primary)] bg-[var(--accent-subtle)]/30 hover:bg-[var(--accent-subtle)] transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)] text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-[var(--accent-primary)]/20">
                <span className="text-2xl font-black">2.0</span>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2 text-[var(--accent-primary)]">{t('levels.individualist')}</h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                  {t('levels.individualistDesc')}
                </p>
              </div>
            </Card>

            <Card className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8 border-l-8 border-l-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-[var(--text-primary)] text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-2xl font-black text-white">3.0</span>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">{t('levels.synthesist')}</h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  {t('levels.synthesistDesc')}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black z-0">
          <div className="absolute inset-0 bg-[var(--accent-primary)]/10 animate-pulse" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tighter">
            {t('cta.heading')}
          </h2>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto font-medium">
            {t('cta.subheading')}
          </p>
          <Link href="/login?mode=signup">
            <Button size="lg" className="rounded-full px-12 h-16 text-xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all">
              {t('cta.button')}
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-white border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Link href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="Human 3.0" className="h-10 w-auto" />
                <span className="font-bold text-xl tracking-tight">HUMAN 3.0</span>
              </Link>
              <p className="text-sm text-[var(--text-secondary)] font-medium max-w-xs text-center md:text-left">
                {language === 'zh' ? '开启你的维度级跨越。停止平庸，开始进化。' : 'Unlock your multidimensional potential. Stop conforming, start evolving.'}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              <Link href="/privacy" className="hover:text-[var(--accent-primary)] transition-colors">{language === 'zh' ? '隐私政策' : 'Privacy'}</Link>
              <Link href="/terms" className="hover:text-[var(--accent-primary)] transition-colors">{language === 'zh' ? '服务条款' : 'Terms'}</Link>
              <Link
                href="https://letters.thedankoe.com/p/human-30-a-map-to-reach-the-top-1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-primary)] transition-colors"
                aria-label="Human 3.0 framework by Dan Koe"
              >
                {language === 'zh' ? 'Dan Koe 框架' : 'Dan Koe Framework'}
              </Link>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--border-subtle)] text-center">
            <span className="text-xs text-[var(--text-tertiary)] font-bold tracking-widest">© 2024 HUMAN 3.0. BUILT FOR EVOLUTION.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Loading fallback component
function HomePageLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-subtle)] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="h-10 sm:h-12 w-32 bg-[var(--bg-subtle)] animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-20 h-8 bg-[var(--bg-subtle)] animate-pulse rounded-lg" />
          </div>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full animate-spin" />
      </main>
    </div>
  );
}

// Wrap in Suspense to handle useSearchParams
export default function HomePageWrapper() {
  return (
    <Suspense fallback={<HomePageLoading />}>
      <HomePage />
    </Suspense>
  );
}
