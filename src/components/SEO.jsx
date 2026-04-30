import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title = 'Matsyalink - Fish Marketplace', 
    description = 'Buy and sell fresh fish, feed, and medicine directly from farmers and verified sellers without any commission.',
    image = 'https://matsyalink.com/logo192.png',
    url = 'https://matsyalink.com'
}) => {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='image' content={image} />

            {/* OpenGraph tags (Facebook, WhatsApp, LinkedIn, etc.) */}
            <meta property='og:title' content={title} />
            <meta property='og:description' content={description} />
            <meta property='og:image' content={image} />
            <meta property='og:url' content={url} />
            <meta property='og:type' content='website' />

            {/* Twitter Card tags */}
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content={title} />
            <meta name='twitter:description' content={description} />
            <meta name='twitter:image' content={image} />
        </Helmet>
    );
};

export default SEO;
