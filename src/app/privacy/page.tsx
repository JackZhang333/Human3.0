'use client';

import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPage() {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
            <PageHeader title={language === 'zh' ? '隐私政策' : 'Privacy Policy'} />

            <main className="flex-1 max-w-4xl mx-auto px-4 py-8 text-[var(--text-primary)]">
                <div className="glass p-8 rounded-2xl border border-[var(--border-subtle)] space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{language === 'zh' ? '隐私政策' : 'Privacy Policy'}</h1>
                        <p className="text-[var(--text-secondary)]">
                            {language === 'zh'
                                ? '生效日期：2026年1月1日'
                                : 'Effective Date: January 1, 2024'}
                        </p>
                    </div>

                    <div className="prose prose-invert max-w-none text-[var(--text-secondary)] space-y-6">
                        <p>
                            {language === 'zh'
                                ? 'Human 3.0（"我们"）致力于保护您的隐私。本隐私政策详细说明了我们在您使用我们的网站、评估工具和服务时如何收集、使用、披露和保护您的个人信息。'
                                : 'Human 3.0 ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your personal information when you use our website, assessment tools, and services.'}
                        </p>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                {language === 'zh' ? '1. 我们收集的信息' : '1. Information We Collect'}
                            </h2>
                            <p>
                                {language === 'zh'
                                    ? '我们收集信息是为了向您提供更好的服务。收集的信息类型包括：'
                                    : 'We collect information to provide better services to you. The types of information we collect include:'}
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong className="text-[var(--text-primary)]">{language === 'zh' ? '个人身份信息 (PII)' : 'Personal Identifiable Information (PII)'}</strong>:
                                    {language === 'zh'
                                        ? ' 当您注册账户时，我们会收集您的电子邮件地址、用户名和密码。在使用 Google 登录时，我们会收集您的 Google 账户基本信息（如姓名、邮箱、头像）。'
                                        : ' When you register, we collect your email address, username, and password. When using Google Login, we collect basic profile information (name, email, avatar).'}
                                </li>
                                <li>
                                    <strong className="text-[var(--text-primary)]">{language === 'zh' ? '评估数据' : 'Assessment Data'}</strong>:
                                    {language === 'zh'
                                        ? ' 您在进行 Human 3.0 评估时提供的回答、选择和生成的心理模型数据。这些数据属于特别敏感信息，我们将采取额外措施进行加密保护。'
                                        : ' The answers, choices, and psychometric data generated when you take the Human 3.0 assessment. This is considered sensitive data and is safeguarded with extra encryption measures.'}
                                </li>
                                <li>
                                    <strong className="text-[var(--text-primary)]">{language === 'zh' ? '使用数据与 Cookies' : 'Usage Data & Cookies'}</strong>:
                                    {language === 'zh'
                                        ? ' 我们自动收集有关您如何访问和使用服务的信息，包括 IP 地址、浏览器类型、设备信息、访问时间和页面浏览记录。我们使用 Cookies 来改善用户体验并保持您的登录状态。'
                                        : ' We automatically collect information on how you access and use the Service, including IP address, browser type, device info, access times, and page views. We use Cookies to improve user experience and maintain your session.'}
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                {language === 'zh' ? '2. 信息的使用' : '2. How We Use Your Information'}
                            </h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>{language === 'zh' ? '生成和维护您的个人发展报告。' : 'To generate and maintain your personal development reports.'}</li>
                                <li>{language === 'zh' ? '提供、维护和改进我们的服务功能。' : 'To provide, maintain, and improve our services.'}</li>
                                <li>{language === 'zh' ? '个性化您的用户体验。' : 'To personalize your user experience.'}</li>
                                <li>{language === 'zh' ? '发送服务通知、安全警报和账户管理信息。' : 'To send administrative information, such as security alerts and account updates.'}</li>
                                <li>{language === 'zh' ? '进行数据分析以优化我们的评估模型（数据将进行匿名化处理）。' : 'To perform data analytics to optimize our assessment models (data is anonymized).'}</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                {language === 'zh' ? '3. 信息共享与披露' : '3. Information Sharing and Disclosure'}
                            </h2>
                            <p>
                                {language === 'zh'
                                    ? '我们不会出售您的个人信息。我们仅在以下情况披露您的信息：'
                                    : 'We do not sell your personal information. We only disclose information in the following circumstances:'}
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong className="text-[var(--text-primary)]">{language === 'zh' ? '服务提供商' : 'Service Providers'}</strong>:
                                    {language === 'zh'
                                        ? ' 我们可能与代表我们提供服务（如云托管、数据分析、身份验证）的第三方供应商共享信息。这些第三方受保密协议约束。'
                                        : ' We may share information with third-party vendors who provide services on our behalf (e.g., cloud hosting, analytics, authentication). These parties are bound by confidentiality agreements.'}
                                </li>
                                <li>
                                    <strong className="text-[var(--text-primary)]">{language === 'zh' ? '法律要求' : 'Legal Requirements'}</strong>:
                                    {language === 'zh'
                                        ? ' 如果法律要求或为了保护我们的权利、财产或安全，我们可能会披露您的信息。'
                                        : ' We may disclose your information if required by law or to protect our rights, property, or safety.'}
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                {language === 'zh' ? '4. 数据安全' : '4. Data Security'}
                            </h2>
                            <p>
                                {language === 'zh'
                                    ? '我们实施了通过 SSL/TLS 加密、访问控制和安全存储等行业标准措施来保护您的个人信息。然而，互联网传输无法保证 100% 安全，您需自行承担传输风险。'
                                    : 'We implement industry-standard security measures including SSL/TLS encryption, access controls, and secure storage to protect your personal information. However, no internet transmission is 100% secure, and you assume the risk of transmission.'}
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                {language === 'zh' ? '5. 您的权利' : '5. Your Rights'}
                            </h2>
                            <p>
                                {language === 'zh'
                                    ? '根据适用的数据保护法律（如 GDPR、CCPA），您拥有以下权利：'
                                    : 'Depending on applicable data protection laws (e.g., GDPR, CCPA), you may have the following rights:'}
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>{language === 'zh' ? '访问权：索取我们持有的关于您的个人信息副本。' : 'Right to Access: Request copies of your personal data.'}</li>
                                <li>{language === 'zh' ? '更正权：要求更正不准确的信息。' : 'Right to Rectification: Request correction of inaccurate information.'}</li>
                                <li>{language === 'zh' ? '删除权（被遗忘权）：要求删除您的账户及相关数据。' : 'Right to Deletion (Right to be Forgotten): Request deletion of your account and data.'}</li>
                                <li>{language === 'zh' ? '数据携带权：要求我们将您的数据转移给另一个服务提供商。' : 'Right to Portability: Request transfer of your data to another service provider.'}</li>
                            </ul>
                            <p className="mt-2 text-sm italic">
                                {language === 'zh'
                                    ? '要行使这些权利，请通过 support@human3.0 联系我们。'
                                    : 'To exercise these rights, please contact us at support@human3.0.'}
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                {language === 'zh' ? '6. 儿童隐私' : '6. Children\'s Privacy'}
                            </h2>
                            <p>
                                {language === 'zh'
                                    ? '我们的服务不面向 13 岁以下的儿童。如果我们发现收集了 13 岁以下儿童的信息，我们将立即删除。'
                                    : 'Our Service is not intended for children under 13. If we discover we have collected information from a child under 13, we will delete it immediately.'}
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                {language === 'zh' ? '7. 本政策的变更' : '7. Changes to This Policy'}
                            </h2>
                            <p>
                                {language === 'zh'
                                    ? '我们可能会不时更新本隐私政策。变更生效后继续使用服务即表示您接受修订后的政策。'
                                    : 'We may update this Privacy Policy from time to time. Continued use of the Service after changes constitutes acceptance of the revised policy.'}
                            </p>
                        </section>

                        <section className="space-y-3 border-t border-[var(--border-subtle)] pt-6 mt-8">
                            <p>
                                {language === 'zh'
                                    ? '如果您对本隐私政策有任何疑问，请联系我们：legal@human3.org'
                                    : 'If you have any questions about this Privacy Policy, please contact us at: legal@human3.org'}
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
