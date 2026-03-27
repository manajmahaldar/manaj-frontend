import { Youtube, ExternalLink, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ArticleCard = ({ article }) => {
    const { t, language } = useLanguage();
    return (
        <div className="card p-6 border-t-4 border-orange-400">
            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
                <Calendar size={14} />
                {new Date(article.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : language === 'hi' ? 'hi-IN' : 'en-IN')}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{article.title}</h3>
            
            <p className="text-gray-600 line-clamp-3 mb-6 whitespace-pre-line">
                {article.content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                {article.youtubeLink ? (
                    <a 
                        href={article.youtubeLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-red-600 font-bold hover:underline"
                    >
                        <Youtube size={18} /> {t.watchVideo}
                    </a>
                ) : <span />}
                
                <button className="text-primary font-semibold flex items-center gap-1 hover:underline">
                    {t.readFull} <ExternalLink size={14} />
                </button>
            </div>
        </div>
    );
};

export default ArticleCard;
