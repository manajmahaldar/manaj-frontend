import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = 'Monaj - Direct Fish Marketplace';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteDescription = 'Monaj connects fish farmers, hatchery owners, and sellers directly. Buy and sell fish, feed, and medicine with zero commission.';
    const finalDescription = description || siteDescription;
    const siteUrl = 'https://www.monaj.in'; // Replace with actual domain
    const finalUrl = url ? `${siteUrl}${url}` : siteUrl;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name='description' content={finalDescription} />
            {keywords && <meta name='keywords' content={keywords} />}
            <link rel="canonical" href={finalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDescription} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={finalUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={finalDescription} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
};

export default SEO;
