import React, { useState, useEffect } from 'react';
import { getAllContent, trackProgress } from '../api/learningApi';
import FilterBar from '../components/FilterBar';
import SkeletonCard from '../components/SkeletonCard';
import { FileText, Download, Bookmark, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const PdfLibrary = () => {
    const [pdfs, setPdfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ type: 'pdf', sort: 'newest' });
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPdfs = async () => {
        try {
            setLoading(true);
            const res = await getAllContent({
                ...filters,
                type: 'pdf',
                search: searchQuery || undefined
            });
            if (res.data.success) {
                setPdfs(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPdfs();
    }, [filters, searchQuery]);

    const handleDownloadTrack = async (pdfId) => {
        try {
            await trackProgress({
                contentId: pdfId,
                progress: 100,
                downloaded: true
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" />
                    PDF Library
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                    Download and read offline guides, standard manuals, and feed spreadsheets.
                </p>
            </div>

            <FilterBar 
                onSearch={setSearchQuery} 
                onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} 
            />

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : pdfs.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                    <p className="text-gray-400 font-bold text-sm">No PDFs available matching your query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pdfs.map(pdf => (
                        <div key={pdf._id} className="card bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                            <div>
                                <div className="p-3 bg-red-50 text-red-500 rounded-2xl w-fit mb-4">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="font-extrabold text-gray-900 text-base mb-2 line-clamp-2">{pdf.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                                    {pdf.description || 'Download this resource compiled by MatsyaLink Fisheries engineers.'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                <span className="text-[10px] font-black text-gray-400 uppercase">
                                    {pdf.fileSize || 'PDF Document'}
                                </span>

                                <div className="flex gap-2">
                                    {pdf.pdfUrl && (
                                        <a 
                                            href={pdf.pdfUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            onClick={() => handleDownloadTrack(pdf._id)}
                                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center gap-1 text-xs font-bold"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </a>
                                    )}
                                    {pdf.pdfUrl && (
                                        <a 
                                            href={pdf.pdfUrl} 
                                            download 
                                            onClick={() => handleDownloadTrack(pdf._id)}
                                            className="p-2 rounded-xl bg-primary text-white hover:bg-blue-700 transition-colors flex items-center gap-1 text-xs font-bold"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PdfLibrary;
