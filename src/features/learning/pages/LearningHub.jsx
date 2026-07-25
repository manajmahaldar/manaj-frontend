import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LearningProvider } from '../context/LearningContext';
import { PageLoaderSkeleton as PageLoader } from '../../../components/common/Skeletons';

// Lazy load learning sub-pages
const LearningHome = lazy(() => import('./LearningHome'));
const Categories = lazy(() => import('./Categories'));
const CategoryDetail = lazy(() => import('./CategoryDetail'));
const Videos = lazy(() => import('./Videos'));
const VideoDetail = lazy(() => import('./VideoDetail'));
const Articles = lazy(() => import('./Articles'));
const ArticleDetail = lazy(() => import('./ArticleDetail'));
const Blogs = lazy(() => import('./Blogs'));
const BlogDetail = lazy(() => import('./BlogDetail'));
const PdfLibrary = lazy(() => import('./PdfLibrary'));
const GovernmentSchemes = lazy(() => import('./GovernmentSchemes'));
const TrainingPrograms = lazy(() => import('./TrainingPrograms'));
const Webinars = lazy(() => import('./Webinars'));
const Quizzes = lazy(() => import('./Quizzes'));
const QuizDetail = lazy(() => import('./QuizDetail'));
const QuizResult = lazy(() => import('./QuizResult'));
const Certificates = lazy(() => import('./Certificates'));
const Bookmarks = lazy(() => import('./Bookmarks'));
const RecentlyViewed = lazy(() => import('./RecentlyViewed'));
const MyProgress = lazy(() => import('./MyProgress'));
const LearningAdminDashboard = lazy(() => import('../components/admin/LearningAdminDashboard'));

const LearningHub = () => {
    return (
        <LearningProvider>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<LearningHome />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/categories/:slug" element={<CategoryDetail />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/videos/:slug" element={<VideoDetail />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/articles/:slug" element={<ArticleDetail />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blogs/:slug" element={<BlogDetail />} />
                    <Route path="/pdfs" element={<PdfLibrary />} />
                    <Route path="/schemes" element={<GovernmentSchemes />} />
                    <Route path="/trainings" element={<TrainingPrograms />} />
                    <Route path="/webinars" element={<Webinars />} />
                    <Route path="/quizzes" element={<Quizzes />} />
                    <Route path="/quizzes/:id" element={<QuizDetail />} />
                    <Route path="/quizzes/:id/result" element={<QuizResult />} />
                    <Route path="/certificates" element={<Certificates />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                    <Route path="/recent" element={<RecentlyViewed />} />
                    <Route path="/progress" element={<MyProgress />} />
                    <Route path="/admin" element={<LearningAdminDashboard />} />
                </Routes>
            </Suspense>
        </LearningProvider>
    );
};

export default LearningHub;
