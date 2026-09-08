import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { generateCertificate } from '../api/learningApi';
import { Award, CheckCircle, XCircle, ArrowRight, Download, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const QuizResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, formatDigit } = useLanguage();
    const { result } = location.state || {};
    const [generatingCert, setGeneratingCert] = useState(false);
    const [certUrl, setCertUrl] = useState('');

    if (!result) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 max-w-md mx-auto shadow-sm space-y-4">
                <p className="text-gray-500 font-bold">{t.lh_no_results || 'No results available'}</p>
                <Link to="/learning/quizzes" className="text-primary font-bold inline-block">{t.lh_back_to_quizzes || 'Back to Quizzes'}</Link>
            </div>
        );
    }

    const handleClaimCertificate = async () => {
        try {
            setGeneratingCert(true);
            const res = await generateCertificate(result.attemptId);
            if (res.data.success) {
                setCertUrl(res.data.data.pdfUrl);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setGeneratingCert(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-8 text-center">
            {/* Pass Fail Indicator */}
            <div className="space-y-4">
                {result.passed ? (
                    <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-emerald-500/5 animate-bounce">
                        🎉
                    </div>
                ) : (
                    <div className="w-20 h-20 rounded-full bg-red-50 border border-red-100 text-red-500 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-red-500/5">
                        ❌
                    </div>
                )}

                <h1 className="text-2xl font-black text-gray-900">
                    {result.passed ? (t.lh_congrats_passed || 'Congratulations! You Passed') : (t.lh_quiz_failed || 'Quiz Attempt Failed')}
                </h1>
                <p className="text-xs font-semibold text-gray-400">
                    {t.lh_you_scored || 'You scored'} <strong className="text-gray-700">{formatDigit(result.score)}%</strong>. {t.lh_required_passing || 'Required passing mark is'} {formatDigit(result.passingScore)}%.
                </p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">{t.lh_correct_answers || 'Correct Answers'}</span>
                    <p className="text-lg font-black text-gray-800">{formatDigit(result.correctCount)} / {formatDigit(result.totalQuestions)}</p>
                </div>
                <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">{t.lh_result_status || 'Result Status'}</span>
                    <p className={`text-lg font-black ${result.passed ? 'text-emerald-500' : 'text-red-500'}`}>
                        {result.passed ? (t.lh_status_passed || 'PASSED') : (t.lh_status_failed || 'FAILED')}
                    </p>
                </div>
            </div>

            {/* Certificate generation flow */}
            {result.passed && (
                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 space-y-4">
                    <h3 className="font-extrabold text-blue-950 text-sm">{t.lh_earn_cert_title || 'Earn your verified Certificate'}</h3>
                    <p className="text-xs text-blue-700 leading-relaxed max-w-sm mx-auto">
                        {t.lh_earn_cert_desc || 'Generate and download your verified MatsyaLink digital completion certificate with QR code validation.'}
                    </p>
                    
                    {certUrl ? (
                        <a 
                            href={certUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2 transition-colors active:scale-95 shadow-md shadow-emerald-600/10"
                        >
                            <Download className="w-4 h-4" />
                            {t.lh_download_pdf_cert || 'Download PDF Certificate'}
                        </a>
                    ) : (
                        <button
                            onClick={handleClaimCertificate}
                            disabled={generatingCert}
                            className="px-6 py-3 rounded-2xl bg-primary hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-primary/10 disabled:opacity-50"
                        >
                            {generatingCert ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    {t.lh_creating_cert || 'Creating Certificate...'}
                                </>
                            ) : (
                                <>
                                    <Award className="w-4 h-4" />
                                    {t.lh_claim_cert || 'Claim Certificate'}
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Footer navs */}
            <div className="flex gap-4 pt-4 justify-center">
                <Link
                    to="/learning/quizzes"
                    className="px-5 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-xs hover:bg-gray-50"
                >
                    {t.lh_back_to_quizzes || 'Back to Quizzes'}
                </Link>
                <Link
                    to="/learning"
                    className="px-5 py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1.5"
                >
                    {t.lh_back_to_dashboard || 'Back to Dashboard'}
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default QuizResult;
