import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes } from '../api/learningApi';
import { HelpCircle, Clock, Award, ChevronRight } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { useLanguage } from '../../../context/LanguageContext';
import { getLocalizedQuiz, getLocalizedCategory } from '../utils/learningTranslationHelper';

const Quizzes = () => {
    const { language } = useLearning();
    const { t, formatDigit } = useLanguage();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const res = await getQuizzes({ language });
                if (res.data.success) {
                    setQuizzes(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [language]);

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-primary" />
                    {t.lh_nav_quizzes || 'Aquaculture Knowledge Quizzes'}
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                    {t.lh_quizzes_subtitle || 'Test your understanding of water parameters, feeds, and RAS to earn certificates.'}
                </p>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-3xl" />
                    ))}
                </div>
            ) : quizzes.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                    <p className="text-gray-400 font-bold text-sm">{t.lh_no_quizzes || 'No quizzes published yet.'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizzes.map(rawQuiz => {
                        const quiz = getLocalizedQuiz(rawQuiz, language);
                        const category = getLocalizedCategory(quiz.category, language);
                        return (
                            <div key={quiz._id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span 
                                            className="px-2 py-1 text-[9px] font-black uppercase rounded-lg"
                                            style={{ backgroundColor: `${category?.color || '#3b82f6'}15`, color: category?.color || '#3b82f6' }}
                                        >
                                            {category?.name || 'Quiz'}
                                        </span>
                                    </div>
                                    <h3 className="font-extrabold text-gray-900 text-base mb-2">{quiz.title}</h3>
                                    <p className="text-xs text-gray-500 mb-4">{quiz.description || t.lh_test_your_knowledge || 'Test your knowledge on this topic.'}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" /> 
                                            {quiz.timeLimit > 0 ? `${formatDigit(quiz.timeLimit)} ${t.lh_mins || 'mins'}` : (t.lh_no_limit || 'No Limit')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Award className="w-3.5 h-3.5" /> 
                                            {t.lh_passing || 'Passing'}: {formatDigit(quiz.passingScore)}%
                                        </span>
                                    </div>

                                    <Link
                                        to={`/learning/quizzes/${quiz._id}`}
                                        className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                                    >
                                        {t.lh_start_test || 'Start Test'}
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Quizzes;
