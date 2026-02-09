'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function LoginForm() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isSignup = searchParams.get('mode') === 'signup';
    const redirect = searchParams.get('redirect') || '/assess';

    const [mode, setMode] = useState<'login' | 'signup'>(isSignup ? 'signup' : 'login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [showSignupSuccess, setShowSignupSuccess] = useState(false);
    const [agree, setAgree] = useState(false);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (mode === 'signup' && !agree) {
            setError(language === 'zh' ? '请阅读并同意服务条款和隐私政策' : 'Please agree to the Terms and Privacy Policy');
            setLoading(false);
            return;
        }

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback?code=${email}&redirect=${redirect}`,
                    },
                });

                if (error) throw error;
                setShowSignupSuccess(true);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;
                router.push(redirect);
                router.refresh();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : t('login.unknownError'));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
                },
            });

            if (error) throw error;
        } catch (err) {
            setError(err instanceof Error ? err.message : t('login.unknownError'));
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 w-full max-w-[92vw] sm:max-w-md animate-slide-up">
            <div className="bg-white/70 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl border border-[var(--border-subtle)] shadow-2xl shadow-blue-500/5">
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight text-[var(--text-primary)]">
                        {mode === 'login' ? t('login.welcomeBack') : t('login.createAccount')}
                    </h1>
                    <p className="text-[var(--text-secondary)] font-medium">
                        {mode === 'login' ? t('login.loginSubtitle') : t('login.signupSubtitle')}
                    </p>
                </div>

                {/* Google 登录 */}
                <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-12 rounded-2xl gap-3 mb-8 border-2 hover:bg-[var(--bg-subtle)] group font-bold"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                    )}
                    {mode === 'login' ? t('login.googleLogin') : t('login.googleSignup')}
                </Button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                    <span className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">{t('login.orEmail')}</span>
                    <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                </div>

                {/* 表单 */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest ml-1 text-[var(--text-secondary)]">
                            {t('login.emailLabel')}
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-tertiary)] pointer-events-none" />
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('login.emailPlaceholder')}
                                className="pl-12 h-12 rounded-2xl bg-[var(--bg-subtle)]/50 border-transparent focus:bg-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="font-bold text-xs uppercase tracking-widest ml-1 text-[var(--text-secondary)]">
                            {t('login.passwordLabel')}
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-tertiary)] pointer-events-none" />
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('login.passwordPlaceholder')}
                                className="pl-12 h-12 rounded-2xl bg-[var(--bg-subtle)]/50 border-transparent focus:bg-white"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    {mode === 'signup' && (
                        <div className="flex items-start gap-3 px-1 pt-1">
                            <input
                                id="agree_terms"
                                type="checkbox"
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-[var(--border-subtle)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] accent-[var(--accent-primary)]"
                                required
                            />
                            <Label htmlFor="agree_terms" className="text-sm font-medium text-[var(--text-secondary)] leading-snug cursor-pointer">
                                {t('login.agreeTerms') || 'I agree to the'}{' '}
                                <Link href="/terms" className="text-[var(--accent-primary)] hover:underline font-bold" target="_blank">
                                    {t('login.terms') || 'Terms'}
                                </Link>
                                {' '}{t('login.and') || '&'}{' '}
                                <Link href="/privacy" className="text-[var(--accent-primary)] hover:underline font-bold" target="_blank">
                                    {t('login.privacy') || 'Privacy'}
                                </Link>
                            </Label>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold flex items-center gap-3 animate-slide-up">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {message && (
                        <div className="p-4 rounded-2xl bg-green-50 text-green-600 text-sm font-bold flex items-center gap-3 animate-slide-up">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            <span>{message}</span>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-[var(--accent-primary)]/20 active:scale-[0.98] transition-all"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                {mode === 'login' ? t('login.loginButton') : t('login.signupButton')}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="text-center mt-10 text-sm">
                    {mode === 'login' ? (
                        <p className="text-[var(--text-secondary)] font-medium">
                            {t('login.noAccount')}{' '}
                            <button
                                onClick={() => setMode('signup')}
                                className="text-[var(--accent-primary)] font-black hover:underline"
                            >
                                {t('login.signupLink')}
                            </button>
                        </p>
                    ) : (
                        <p className="text-[var(--text-secondary)] font-medium">
                            {t('login.hasAccount')}{' '}
                            <button
                                onClick={() => setMode('login')}
                                className="text-[var(--accent-primary)] font-black hover:underline"
                            >
                                {t('login.loginLink')}
                            </button>
                        </p>
                    )}
                </div>
            </div>

            <AlertDialog open={showSignupSuccess} onOpenChange={setShowSignupSuccess}>
                <AlertDialogContent className="rounded-3xl max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-3 text-2xl font-black">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                            {t('login.signupSuccessTitle') || 'Success!'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-medium pt-2">
                            {t('login.signupSuccessDesc') || 'Check your email to activate your account.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8">
                        <AlertDialogAction
                            onClick={() => {
                                setShowSignupSuccess(false);
                                setMode('login');
                            }}
                            asChild
                        >
                            <Button className="rounded-2xl min-w-24">
                                {t('common.ok') || 'Got it'}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="mt-10 text-center flex gap-6 justify-center">
                <Link href="/privacy" className="text-xs font-black uppercase tracking-widest text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                    {t('privacy') || 'Privacy'}
                </Link>
                <Link href="/terms" className="text-xs font-black uppercase tracking-widest text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                    {t('terms') || 'Terms'}
                </Link>
            </div>
        </div>
    );
}

function LoginLoadingFallback() {
    const { t } = useLanguage();
    return (
        <div className="bg-white/70 backdrop-blur-2xl p-12 rounded-3xl w-full max-w-md text-center flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--accent-primary)] mb-6" />
            <p className="text-lg font-bold text-[var(--text-secondary)]">{t('login.loading')}</p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative bg-[var(--bg-primary)] overflow-hidden">
            {/* Immersive Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="absolute top-8 right-8 z-30">
                <LanguageSwitcher />
            </div>

            <Link href="/" className="relative z-20 mb-12 hover:scale-105 transition-transform duration-500">
                <div className="relative p-4">
                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                    <img src="/logo.png" alt="Human 3.0" className="h-16 w-auto relative z-10" />
                </div>
            </Link>

            <Suspense fallback={<LoginLoadingFallback />}>
                <LoginForm />
            </Suspense>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                <p className="text-[10px] font-black tracking-widest text-[var(--text-tertiary)] uppercase whitespace-nowrap">
                    Human 3.0 Operating System • Evolution Protocol
                </p>
            </div>
        </div>
    );
}

