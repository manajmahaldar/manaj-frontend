import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const DataDeletionPolicy = () => {
    const { t } = useLanguage();
    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl border border-gray-100 my-10 space-y-6">
            <h1 className="text-3xl font-black text-gray-900">{t.dataDeletionTitle || 'Data Deletion Policy'}</h1>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {t.dataDeletionDesc || 'Under Section 12 of the DPDP Act 2023, users have the right to request erasure of their personal data and profile records when consent is withdrawn or processing is no longer required.'}
            </p>
        </div>
    );
};

export const RefundPolicy = () => {
    const { t } = useLanguage();
    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl border border-gray-100 my-10 space-y-6">
            <h1 className="text-3xl font-black text-gray-900">{t.refundPolicyTitle || 'Refund Policy'}</h1>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {t.refundPolicyDesc || 'MatsyaLink connects buyers directly with suppliers commission-free. Refunds for direct fish trades are resolved between parties, while seed/feed purchases follow verification terms.'}
            </p>
        </div>
    );
};

export const ShippingPolicy = () => {
    const { t } = useLanguage();
    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl border border-gray-100 my-10 space-y-6">
            <h1 className="text-3xl font-black text-gray-900">{t.shippingPolicyTitle || 'Shipping Policy'}</h1>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {t.shippingPolicyDesc || 'Sellers and hatchery owners specify pickup or oxygenated seed transport delivery terms during direct buyer agreements.'}
            </p>
        </div>
    );
};

export const CommunityGuidelines = () => {
    const { t } = useLanguage();
    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl border border-gray-100 my-10 space-y-6">
            <h1 className="text-3xl font-black text-gray-900">{t.communityGuidelinesTitle || 'Community Guidelines'}</h1>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {t.communityGuidelinesDesc || 'All fish farmers, hatcheries, sellers, and traders must adhere to respectful communication, honest pricing, and genuine seed lines representations.'}
            </p>
        </div>
    );
};

export const SecurityNotice = () => {
    const { t } = useLanguage();
    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl border border-gray-100 my-10 space-y-6">
            <h1 className="text-3xl font-black text-gray-900">{t.securityNoticeTitle || 'Security Notice'}</h1>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {t.securityNoticeDesc || 'MatsyaLink employs bcrypt password hashing, TLS 1.3 encryption in transit, strict RBAC controls, and automated rate limiting to protect user information.'}
            </p>
        </div>
    );
};
