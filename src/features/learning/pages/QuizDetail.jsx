import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuizDetails, submitQuizAnswers } from '../api/learningApi';
import { HelpCircle, Clock, AlertCircle } from 'lucide-react';

const QuizDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState([]); // Array of { questionId, selectedAnswers: [] }
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const res = await getQuizDetails(id);
                if (res.data.success) {
                    setQuiz(res.data.data);
                    if (res.data.data.timeLimit > 0) {
                        setTimeLeft(res.data.data.timeLimit * 60);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [id]);

    useEffect(() => {
        if (timeLeft <= 0 || !quiz || quiz.timeLimit <= 0) return;
        const timer = setTimeout(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, quiz]);

    if (timeLeft === 0 && quiz && quiz.timeLimit > 0) {
        // Auto submit on time out
        alert('Time is up! Submitting answers.');
        submitQuizAnswers(id, { answers, timeTaken: quiz.timeLimit * 60 }).then(res => {
            navigate(`/learning/quizzes/${id}/result`, { state: { result: res.data.data } });
        });
    }

    const handleSelectOption = (optionIdx) => {
        const currentQuestion = quiz.questions[currentQuestionIdx];
        const existingAnswer = answers.find(a => a.questionId === currentQuestion._id);
        
        let newSelections = [];
        if (existingAnswer) {
            if (currentQuestion.type === 'multiple_answer') {
                newSelections = existingAnswer.selectedAnswers.includes(optionIdx)
                    ? existingAnswer.selectedAnswers.filter(idx => idx !== optionIdx)
                    : [...existingAnswer.selectedAnswers, optionIdx];
            } else {
                newSelections = [optionIdx];
            }
        } else {
            newSelections = [optionIdx];
        }

        setAnswers(prev => {
            const filtered = prev.filter(a => a.questionId !== currentQuestion._id);
            return [...filtered, { questionId: currentQuestion._id, selectedAnswers: newSelections }];
        });
    };

    const handleSubmit = async () => {
        try {
            const timeTaken = quiz.timeLimit > 0 ? (quiz.timeLimit * 60 - timeLeft) : 0;
            const res = await submitQuizAnswers(id, { answers, timeTaken });
            if (res.data.success) {
                navigate(`/learning/quizzes/${id}/result`, { state: { result: res.data.data } });
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-12 text-center animate-pulse">Loading Quiz details...</div>;
    if (!quiz) return <div className="text-center p-12">Quiz not found</div>;

    const currentQuestion = quiz.questions[currentQuestionIdx];
    const currentAnswer = answers.find(a => a.questionId === currentQuestion?._id);
    const selectedIndices = currentAnswer ? currentAnswer.selectedAnswers : [];

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="font-extrabold text-gray-900 text-lg">{quiz.title}</h2>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                        Question {currentQuestionIdx + 1} of {quiz.questions.length}
                    </p>
                </div>
                {quiz.timeLimit > 0 && (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 rounded-2xl border border-red-100 font-extrabold text-xs">
                        <Clock className="w-4 h-4" />
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                )}
            </div>

            {/* Question card */}
            <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="font-bold text-gray-900 text-base leading-snug">
                    {currentQuestion.questionText}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedIndices.includes(idx);
                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelectOption(idx)}
                                className={`w-full text-left p-4 rounded-2xl border text-sm font-bold transition-all ${
                                    isSelected 
                                        ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                                        : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                }`}
                            >
                                <span className="inline-block w-6 h-6 rounded-full bg-gray-50 border border-gray-200 text-center text-xs font-black text-gray-500 mr-3 align-middle leading-5">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Nav Controls */}
            <div className="flex justify-between items-center">
                <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                    className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>

                {currentQuestionIdx === quiz.questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/10 active:scale-95"
                    >
                        Submit Quiz
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                        className="px-6 py-3 rounded-2xl bg-primary hover:bg-blue-700 text-white font-bold text-xs active:scale-95"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizDetail;
