'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { LogIn, Rocket } from 'lucide-react';

function HomePage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle Google OAuth callback redirect error
  // Sometimes Supabase redirects to root instead of /auth/callback if configuration is incomplete
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      // Redirect to the auth callback route to complete the sign-in process
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
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-subtle)] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <img src="/logo.png" alt="Human 3.0" className="h-10 sm:h-12 w-auto" />
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile: Show language switcher */}
            <div className="block sm:hidden">
              <LanguageSwitcher />
            </div>

            {loading ? (
              <div className="w-16 sm:w-20 h-8 sm:h-9 bg-[var(--bg-subtle)] animate-pulse rounded-lg" />
            ) : user ? (
              <>
                <Link href="/history" className="btn-primary text-xs sm:text-sm px-3 sm:px-6 py-2">
                  {language === 'zh' ? '我的评估' : 'My Assessments'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs sm:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap"
                >
                  {language === 'zh' ? '退出' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-secondary px-3 sm:px-6 py-2"
                  aria-label={t('nav.login')}
                >
                  <LogIn className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline text-sm">{t('nav.login')}</span>
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="btn-primary px-3 sm:px-6 py-2"
                  aria-label={language === 'zh' ? '开始评估' : t('nav.startAssessment')}
                >
                  <Rocket className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline text-sm">{language === 'zh' ? '开始评估' : t('nav.startAssessment')}</span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto w-full">
          {/* Top Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-subtle)] text-[var(--accent-primary)] rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('hero.badge')}
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight tracking-tight">
              {t('hero.title')}
              <span className="block mt-2 text-[var(--accent-primary)]">{t('hero.titleAccent')}</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
              <strong className="text-[var(--text-primary)] font-medium">{t('hero.quadrants')}</strong>
              {t('hero.subtitleEnd')}
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/login?mode=signup" className="btn-primary text-base px-8 py-4 shadow-lg shadow-[var(--accent-primary)]/25 hover:shadow-xl hover:shadow-[var(--accent-primary)]/30 transition-all" aria-label="Start your Human 3.0 assessment">
              {t('hero.ctaPrimary')}
              <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://letters.thedankoe.com/p/human-30-a-map-to-reach-the-top-1" className="btn-secondary text-base px-8 py-4" aria-label="Learn about the assessment system">
              {t('hero.ctaSecondary')}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-8 md:gap-12 max-w-2xl mx-auto pt-12 border-t border-[var(--border-subtle)]">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold mb-2 text-[var(--text-primary)]">4</div>
              <div className="text-sm text-[var(--text-secondary)]">{t('hero.statQuadrants')}</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1">{t('hero.statQuadrantsDesc')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold mb-2 text-[var(--text-primary)]">3</div>
              <div className="text-sm text-[var(--text-secondary)]">{t('hero.statLevels')}</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1">{t('hero.statLevelsDesc')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold mb-2 text-[var(--text-primary)]">∞</div>
              <div className="text-sm text-[var(--text-secondary)]">{t('hero.statPotential')}</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-1">{t('hero.statPotentialDesc')}</div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-[var(--accent-subtle)] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">{t('value.precise')}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {t('value.preciseDesc')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-[var(--accent-subtle)] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">{t('value.insight')}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {t('value.insightDesc')}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-[var(--accent-subtle)] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">{t('value.growth')}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {t('value.growthDesc')}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Four Quadrants Section */}
      <section id="how-it-works" className="px-6 py-20 bg-[var(--bg-subtle)]" aria-labelledby="quadrants-heading">
        <div className="max-w-6xl mx-auto">
          <h2 id="quadrants-heading" className="text-3xl md:text-4xl font-semibold text-center mb-3">
            {t('quadrants.heading')}
          </h2>
          <p className="text-[var(--text-secondary)] text-center mb-16 max-w-2xl mx-auto">
            {t('quadrants.subheading')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mind */}
            <div className="card quadrant-card-mind">
              <div className="w-10 h-10 rounded-sm bg-[var(--quadrant-mind)]/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[var(--quadrant-mind)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Mind quadrant icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">{t('quadrants.mind')}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {t('quadrants.mindDesc')}
              </p>
            </div>

            {/* Body */}
            <div className="card quadrant-card-body">
              <div className="w-10 h-10 rounded-sm bg-[var(--quadrant-body)]/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[var(--quadrant-body)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">{t('quadrants.body')}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {t('quadrants.bodyDesc')}
              </p>
            </div>

            {/* Spirit */}
            <div className="card quadrant-card-spirit">
              <div className="w-10 h-10 rounded-sm bg-[var(--quadrant-spirit)]/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[var(--quadrant-spirit)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">{t('quadrants.spirit')}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {t('quadrants.spiritDesc')}
              </p>
            </div>

            {/* Vocation */}
            <div className="card quadrant-card-vocation">
              <div className="w-10 h-10 rounded-sm bg-[var(--quadrant-vocation)]/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[var(--quadrant-vocation)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">{t('quadrants.vocation')}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {t('quadrants.vocationDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consciousness Levels Section */}
      <section className="px-6 py-20" aria-labelledby="levels-heading">
        <div className="max-w-3xl mx-auto">
          <h2 id="levels-heading" className="text-3xl md:text-4xl font-semibold text-center mb-3">
            {t('levels.heading')}
          </h2>
          <p className="text-[var(--text-secondary)] text-center mb-16 max-w-2xl mx-auto">
            {t('levels.subheading')}
          </p>

          <div className="space-y-4">
            {/* Level 1 */}
            <div className="card flex items-start gap-6">
              <div className="w-14 h-14 rounded-sm border border-[var(--border-primary)] flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-medium text-[var(--text-secondary)]">1.0</span>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">{t('levels.conformist')}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {t('levels.conformistDesc')}
                </p>
              </div>
            </div>

            {/* Level 2 */}
            <div className="card flex items-start gap-6">
              <div className="w-14 h-14 rounded-sm border border-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-medium text-[var(--accent-primary)]">2.0</span>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">{t('levels.individualist')}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {t('levels.individualistDesc')}
                </p>
              </div>
            </div>

            {/* Level 3 */}
            <div className="card flex items-start gap-6">
              <div className="w-14 h-14 rounded-sm border border-[var(--text-primary)] flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-medium">3.0</span>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">{t('levels.synthesist')}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {t('levels.synthesistDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-[var(--bg-subtle)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            {t('cta.heading')}
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 text-base">
            {t('cta.subheading')}
          </p>
          <Link href="/login?mode=signup" className="btn-primary text-base px-8 py-3 inline-block">
            {t('cta.button')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Human 3.0" className="h-10 w-auto" />
            <span className="text-sm text-[var(--text-tertiary)]">© 2024 Human 3.0. {language === 'zh' ? '保留所有权利。' : 'All rights reserved.'}</span>
          </div>
          <div className="flex gap-6 text-sm text-[var(--text-secondary)]">
            <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">
              {language === 'zh' ? '隐私政策' : 'Privacy Policy'}
            </Link>
            <Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors">
              {language === 'zh' ? '服务条款' : 'Terms of Service'}
            </Link>
            <Link
              href="https://letters.thedankoe.com/p/human-30-a-map-to-reach-the-top-1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--text-primary)] transition-colors">
              {language === 'zh' ? '人类3.0评估框架 By Dan Koe' : 'Human3.0 By Dan Koe'}
            </Link>
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
