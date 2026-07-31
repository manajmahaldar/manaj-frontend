import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Calendar, Printer, Search, Lock, UserCheck, FileText, Scale } from 'lucide-react';

const PrivacyPolicy = () => {
    const { t } = useLanguage();

    const [searchTerm, setSearchTerm] = useState('');

    const sections = t.privacy?.sections || [
        {
            id: 'introduction',
            title: '1. Introduction & Regulatory Context',
            content: `MatsyaLink ("Platform", "we", "us", "our") is committed to protecting your personal data in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act), the Information Technology Act, 2000, and Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. This Privacy Policy governs your use of our website (https://www.matsyalink.com) and mobile services.`
        },
        {
            id: 'definitions',
            title: '2. Definitions under DPDP Act 2023',
            content: `• "Data Fiduciary": MatsyaLink Technologies, which determines the purpose and means of processing personal data.
• "Data Principal": The individual to whom the personal data relates (farmers, hatcheries, sellers, traders, buyers).
• "Personal Data": Any data about an individual who is identifiable by or in relation to such data.
• "Consent Manager": An entity registered with the Data Protection Board of India that enables Data Principals to give, manage, review, and withdraw consent.`
        },
        {
            id: 'data-collected',
            title: '3. Personal & Business Data We Collect',
            content: `We collect the following categories of data necessary to provide fish marketplace, verification, and learning services:
1. User Registration Data: Full name, primary mobile number, email address, role (Farmer, Seller, Trader, Hatchery).
2. Location & Address: District, local district, police station, physical address for delivery and verification.
3. KYC & Verification Records: Aadhaar card documents, business licenses, live video verification clips.
4. Listings & Demands Data: Product photos, 10-second video clips, fish species, seed size, pricing, inventory.
5. Technical Data: IP address, device model, operating system, browser type, network status, and access logs.`
        },
        {
            id: 'purpose-basis',
            title: '4. Lawful Basis & Purpose of Collection',
            content: `We process data solely for specified, lawful purposes:
• Verification & Fraud Prevention: Verifying seller identity to maintain a commission-free, fraud-free ecosystem.
• Marketplace Operations: Facilitating direct phone/WhatsApp contact between buyers and sellers.
• Order Fulfillment: Processing fish feed, medicine, and seed purchase transactions.
• Educational Academy: Tracking video progress, issuing verified certificates, and recording quiz scores.`
        },
        {
            id: 'consent-management',
            title: '5. Consent Framework & Withdrawal Rights',
            content: `Under DPDP Act Section 6:
• Consent is requested in clear, plain language with options available in Bengali, Hindi, Odia, and English.
• No pre-checked boxes are used for optional processing or marketing communications.
• Data Principals have the right to withdraw consent at any time through their Profile Privacy Center.`
        },
        {
            id: 'data-retention',
            title: '6. Data Retention & Erasure Policy',
            content: `Personal data is retained only for as long as necessary to fulfill the operational purpose or legal requirements:
• Active Account Data: Retained for the duration of account activity.
• Inactive / Closed Accounts: Erased within 30 days of account deletion approval, except financial transaction logs retained for 7 years under Income Tax guidelines.`
        },
        {
            id: 'data-rights',
            title: '7. Data Principal Rights (DPDP Sections 11-14)',
            content: `You possess the following statutory rights:
• Right to Access: Request a machine-readable JSON copy of all personal data held.
• Right to Correction & Updating: Rectify inaccurate or outdated profile details instantly.
• Right to Erasure: Request permanent deletion of account and uploaded documents.
• Right to Nominating: Nominate another individual to exercise rights in event of incapacity.`
        },
        {
            id: 'security-measures',
            title: '8. Security Architecture & Encryption',
            content: `We implement robust technical and organizational measures:
• TLS 1.3 encryption in transit and AES-256 encryption at rest for sensitive media.
• Strict Role-Based Access Control (RBAC) preventing unauthorized employee access.
• Automated intrusion detection, DDoS mitigation, and rate limiting.`
        },
        {
            id: 'grievance-officer',
            title: '9. Grievance Redressal Mechanism',
            content: `In compliance with DPDP Act Section 13 & IT Rules:
    • Grievance Officer Name: Privacy Officer, MatsyaLink Compliance Desk
    • Email: grievance@matsyalink.com / support@machbazar.com
    • Response SLA: Acknowledgment within 24 hours; resolution within 72 business hours.`
        }];

    const filteredSections = sections.filter(sec => 
        sec.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        sec.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-3 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-400/30">
                            <ShieldCheck size={14} /> {t.privacy?.heroBadge || 'DPDP Act 2023 Compliant'}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t.privacy?.title || 'Privacy Policy'}</h1>
                        <p className="text-blue-200 text-sm font-medium">{t.privacy?.version || 'Version 2.1.0 • Effective Date: January 1, 2026'}</p>
                    </div>
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all border border-white/20"
                    >
                        <Printer size={16} /> {t.privacy?.printPolicy || 'Print Policy'}
                    </button>
                </div>
            </div>

            {/* Container */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder={t.privacy?.searchPlaceholder || 'Search privacy terms (e.g. consent, retention, rights, Aadhaar)...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:border-blue-500 text-sm"
                    />
                </div>

                {/* Policy Sections */}
                <div className="space-y-6">
                    {filteredSections.map(sec => (
                        <div key={sec.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <FileText className="text-blue-600 flex-shrink-0" size={20} />
                                {sec.title}
                            </h2>
                            <div className="text-gray-600 leading-relaxed font-medium text-sm whitespace-pre-line border-t border-gray-50 pt-3">
                                {sec.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-12 bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center justify-between gap-4 text-xs font-bold text-blue-900">
                    <span>{t.privacy?.footerQuestion || 'Have questions regarding your personal data processing?'}</span>
                    <a href="/grievance" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all whitespace-nowrap">
                        {t.privacy?.contactButton || 'Contact Grievance Officer'}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
