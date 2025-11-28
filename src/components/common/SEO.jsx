// src/components/common/SEO.jsx
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  articleData = null,
  propertyData = null,
}) => {
  const siteTitle = 'KejaMatch';
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - Premium Real Estate Properties & BNBs in Kenya`;
  const siteUrl = 'https://kejamatch.com';
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Property-specific structured data */}
      {propertyData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": propertyData.title,
            "description": propertyData.description,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": propertyData.location,
              "addressCountry": "Kenya"
            },
            "offers": {
              "@type": "Offer",
              "price": propertyData.price,
              "priceCurrency": "KES",
              "availability": "https://schema.org/InStock"
            },
            "image": propertyData.images?.[0],
            "geo": propertyData.coordinates && {
              "@type": "GeoCoordinates",
              "latitude": propertyData.coordinates.lat,
              "longitude": propertyData.coordinates.lng
            }
          })}
        </script>
      )}

      {/* Article structured data for blogs */}
      {articleData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": articleData.title,
            "description": articleData.description,
            "image": articleData.image,
            "author": {
              "@type": "Organization",
              "name": "KejaMatch"
            },
            "publisher": {
              "@type": "Organization",
              "name": "KejaMatch",
              "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
              }
            },
            "datePublished": articleData.publishDate,
            "dateModified": articleData.modifiedDate || articleData.publishDate,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": fullCanonicalUrl
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;