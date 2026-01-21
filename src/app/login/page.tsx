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

function LoginForm() {
    const { t } = useLanguage();
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

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
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
        <div className="relative z-10 w-full max-w-sm sm:max-w-md">
            <div className="glass p-8 rounded-2xl border border-[var(--border-subtle)] shadow-xl backdrop-blur-xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                        {mode === 'login' ? t('login.welcomeBack') : t('login.createAccount')}
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm">
                        {mode === 'login' ? t('login.loginSubtitle') : t('login.signupSubtitle')}
                    </p>
                </div>

                {/* Google 登录 */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full btn-secondary !flex items-center justify-center gap-3 mb-6 group hover:bg-[var(--surface-hover)] transition-all duration-300"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[var(--text-muted)]" />
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
                    <span className="font-medium text-[var(--text-primary)]">
                        {mode === 'login' ? t('login.googleLogin') : t('login.googleSignup')}
                    </span>
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                    <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{t('login.orEmail')}</span>
                    <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                </div>

                {/* 表单 */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-xs font-medium text-[var(--text-secondary)] ml-1">
                            {t('login.emailLabel')}
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('login.emailPlaceholder')}
                                className="input !pl-10 transition-all duration-300 border-[var(--border-subtle)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="block text-xs font-medium text-[var(--text-secondary)] ml-1">
                            {t('login.passwordLabel')}
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('login.passwordPlaceholder')}
                                className="input !pl-10 transition-all duration-300 border-[var(--border-subtle)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-2 animate-in slide-in-from-top-2 fade-in">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {message && (
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-start gap-2 animate-in slide-in-from-top-2 fade-in">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{message}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary group relative overflow-hidden"
                    >
                        <div className="flex items-center justify-center gap-2 relative z-10 py-1">
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{t('login.processing')}</span>
                                </>
                            ) : (
                                <>
                                    <span>{mode === 'login' ? t('login.loginButton') : t('login.signupButton')}</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </div>
                    </button>
                </form>

                {/* 切换模式 */}
                <div className="text-center mt-8 text-sm text-[var(--text-secondary)] bg-[var(--bg-subtle)]/50 mx-[-2rem] mb-[-2rem] py-4 rounded-b-2xl border-t border-[var(--border-subtle)]">
                    {mode === 'login' ? (
                        <>
                            {t('login.noAccount')}{' '}
                            <button
                                onClick={() => {
                                    setMode('signup');
                                    setError(null);
                                    setMessage(null);
                                }}
                                className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold transition-colors hover:underline"
                            >
                                {t('login.signupLink')}
                            </button>
                        </>
                    ) : (
                        <>
                            {t('login.hasAccount')}{' '}
                            <button
                                onClick={() => {
                                    setMode('login');
                                    setError(null);
                                    setMessage(null);
                                }}
                                className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold transition-colors hover:underline"
                            >
                                {t('login.loginLink')}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* 注册成功弹窗 */}
            <AlertDialog open={showSignupSuccess} onOpenChange={setShowSignupSuccess}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            {t('login.signupSuccessTitle') || 'Registration Successful'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('login.signupSuccessDesc') || 'Please check your email to activate your account before logging in.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => {
                                setShowSignupSuccess(false);
                                setMode('login');
                            }}
                        >
                            {t('common.ok') || 'OK'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function LoginLoadingFallback() {
    const { t } = useLanguage();
    return (
        <div className="glass p-12 rounded-2xl w-full max-w-md text-center flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)] mb-4" />
            <p className="text-[var(--text-secondary)]">{t('login.loading')}</p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* 背景装饰 - 使用 CSS 变量以支持暗色模式 */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Language Switcher */}
            <div className="absolute top-6 right-6 z-20">
                <LanguageSwitcher />
            </div>

            {/* Logo */}
            <Link href="/" className="relative z-10 flex flex-col items-center gap-4 mb-10 group">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50" />
                    <img src="/logo.png" alt="Human 3.0" className="h-16 w-auto relative z-10 drop-shadow-sm" />
                </div>
            </Link>

            <Suspense fallback={<LoginLoadingFallback />}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
