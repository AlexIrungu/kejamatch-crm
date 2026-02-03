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
  breadcrumbs = null,
  faqData = null,
  noIndex = false,
}) => {
  const siteTitle = 'KejaMatch';
  const siteUrl = 'https://kejamatch.com';
  const defaultDescription = 'Discover premium real estate properties, luxury homes, and top-rated BNBs in Kenya with KejaMatch. Your trusted partner for buying, selling, and renting properties.';
  const defaultImage = `${siteUrl}/og-image.jpg`;

  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - Premium Real Estate Properties & BNBs in Kenya`;
  const metaDescription = description || defaultDescription;
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  const metaImage = ogImage || defaultImage;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_KE" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:site" content="@KejaMatch" />

      {/* Breadcrumb Schema */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.name,
              "item": `${siteUrl}${item.url}`
            }))
          })}
        </script>
      )}

      {/* Property/RealEstateListing Schema */}
      {propertyData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            "name": propertyData.title,
            "description": propertyData.description,
            "url": fullCanonicalUrl,
            "datePosted": propertyData.datePosted,
            "image": propertyData.images || [],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": propertyData.location?.area || propertyData.location,
              "addressRegion": propertyData.location?.county,
              "addressCountry": "Kenya"
            },
            "geo": propertyData.coordinates && {
              "@type": "GeoCoordinates",
              "latitude": propertyData.coordinates.lat,
              "longitude": propertyData.coordinates.lng
            },
            "offers": {
              "@type": "Offer",
              "price": propertyData.price,
              "priceCurrency": "KES",
              "availability": "https://schema.org/InStock"
            },
            "numberOfRooms": propertyData.bedrooms,
            "numberOfBathroomsTotal": propertyData.bathrooms,
            "floorSize": propertyData.size && {
              "@type": "QuantitativeValue",
              "value": propertyData.size,
              "unitCode": "FTK"
            }
          })}
        </script>
      )}

      {/* Article Schema for Blogs */}
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

      {/* FAQ Schema */}
      {faqData && faqData.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
