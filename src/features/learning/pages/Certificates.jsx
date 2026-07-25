import React, { useState, useEffect } from 'react';
import { getCertificates } from '../api/learningApi';
import { Award, Download, Calendar, ExternalLink } from 'lucide-react';

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                setLoading(true);
                const res = await getCertificates();
                if (res.data.success) {
                    setCertificates(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCerts();
    }, []);

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Award className="w-6 h-6 text-primary" />
                    My Certificates
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                    View and share your earned aquaculture completion credentials.
                </p>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {Array(2).fill(0).map((_, i) => (
                        <div key={i} className="h-28 bg-gray-100 rounded-3xl" />
                    ))}
                </div>
            ) : certificates.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center max-w-md mx-auto shadow-sm space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center text-2xl mx-auto">
                        🏆
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-base">No Certificates Earned Yet</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Complete lessons and pass corresponding quizzes with a minimum of 70% score to generate verified academy certificates.
                    </p>
                    <a
                        href="/learning/quizzes"
                        className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs inline-block hover:bg-blue-700 transition-colors"
                    >
                        Browse Quizzes
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map(cert => (
                        <div key={cert._id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-50 text-primary rounded-2xl">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-gray-900 text-base">{cert.course}</h3>
                                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">ID: {cert.certificateId}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-6">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                                </span>

                                <div className="flex gap-2">
                                    {cert.pdfUrl && (
                                        <a 
                                            href={cert.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center gap-1 text-xs font-bold"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            View
                                        </a>
                                    )}
                                    {cert.pdfUrl && (
                                        <a 
                                            href={cert.pdfUrl}
                                            download
                                            className="p-2 rounded-xl bg-primary hover:bg-blue-700 text-white transition-colors flex items-center gap-1 text-xs font-bold"
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

export default Certificates;
