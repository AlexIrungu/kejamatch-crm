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
  bnbData = null,
  breadcrumbs = null,
  faqData = null,
  itemListData = null,
  aggregateRating = null,
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
            "@id": `${fullCanonicalUrl}#property`,
            "name": propertyData.title,
            "description": propertyData.description,
            "url": fullCanonicalUrl,
            "datePosted": propertyData.datePosted || new Date().toISOString(),
            "image": propertyData.images || [],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": propertyData.location?.address,
              "addressLocality": propertyData.location?.area || propertyData.location?.city,
              "addressRegion": propertyData.location?.county,
              "addressCountry": "KE"
            },
            ...(propertyData.coordinates && {
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": propertyData.coordinates.lat,
                "longitude": propertyData.coordinates.lng
              }
            }),
            "offers": {
              "@type": "Offer",
              "price": propertyData.price,
              "priceCurrency": "KES",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "seller": {
                "@type": "RealEstateAgent",
                "name": "KejaMatch",
                "url": siteUrl
              }
            },
            "numberOfRooms": propertyData.bedrooms,
            "numberOfBathroomsTotal": propertyData.bathrooms,
            ...(propertyData.size && {
              "floorSize": {
                "@type": "QuantitativeValue",
                "value": propertyData.size,
                "unitCode": "FTK"
              }
            }),
            ...(propertyData.amenities && {
              "amenityFeature": propertyData.amenities.map(amenity => ({
                "@type": "LocationFeatureSpecification",
                "name": amenity,
                "value": true
              }))
            }),
            ...(aggregateRating && {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": aggregateRating.value,
                "reviewCount": aggregateRating.count,
                "bestRating": 5,
                "worstRating": 1
              }
            }),
            "provider": {
              "@id": `${siteUrl}/#organization`
            }
          })}
        </script>
      )}

      {/* BNB/LodgingBusiness Schema */}
      {bnbData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            "@id": `${fullCanonicalUrl}#bnb`,
            "name": bnbData.title,
            "description": bnbData.description,
            "url": fullCanonicalUrl,
            "image": bnbData.images || [],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": bnbData.location,
              "addressCountry": "KE"
            },
            ...(bnbData.coordinates && {
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": bnbData.coordinates.lat,
                "longitude": bnbData.coordinates.lng
              }
            }),
            "priceRange": `KES ${bnbData.price}/night`,
            "starRating": {
              "@type": "Rating",
              "ratingValue": bnbData.rating
            },
            ...(bnbData.reviews && {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": bnbData.rating,
                "reviewCount": bnbData.reviews,
                "bestRating": 5,
                "worstRating": 1
              }
            }),
            "amenityFeature": bnbData.amenities?.map(amenity => ({
              "@type": "LocationFeatureSpecification",
              "name": amenity,
              "value": true
            })) || [],
            "numberOfRooms": bnbData.beds,
            "checkinTime": bnbData.checkIn || "14:00",
            "checkoutTime": bnbData.checkOut || "10:00",
            "petsAllowed": bnbData.petsAllowed || false,
            ...(bnbData.host && {
              "employee": {
                "@type": "Person",
                "name": bnbData.host.name,
                "image": bnbData.host.avatar
              }
            }),
            "potentialAction": {
              "@type": "ReserveAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": fullCanonicalUrl,
                "actionPlatform": [
                  "http://schema.org/DesktopWebPlatform",
                  "http://schema.org/MobileWebPlatform"
                ]
              },
              "result": {
                "@type": "LodgingReservation",
                "name": `Booking at ${bnbData.title}`
              }
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
            "@id": `${fullCanonicalUrl}#article`,
            "headline": articleData.title || title,
            "description": articleData.description || metaDescription,
            "image": {
              "@type": "ImageObject",
              "url": articleData.image || metaImage,
              "width": 1200,
              "height": 630
            },
            "author": articleData.author ? {
              "@type": "Person",
              "name": articleData.author,
              "url": siteUrl
            } : {
              "@type": "Organization",
              "name": "KejaMatch",
              "@id": `${siteUrl}/#organization`
            },
            "publisher": {
              "@type": "Organization",
              "name": "KejaMatch",
              "@id": `${siteUrl}/#organization`,
              "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/og-image.jpg`,
                "width": 1200,
                "height": 630
              }
            },
            "datePublished": articleData.publishedTime || articleData.publishDate,
            "dateModified": articleData.modifiedTime || articleData.modifiedDate || articleData.publishedTime,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": fullCanonicalUrl
            },
            ...(articleData.section && {
              "articleSection": articleData.section
            }),
            ...(articleData.tags && {
              "keywords": articleData.tags.join(', ')
            }),
            "inLanguage": "en-KE",
            "isAccessibleForFree": true
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

      {/* ItemList Schema for Property/BNB Listings */}
      {itemListData && itemListData.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": itemListData.name || "Property Listings",
            "description": itemListData.description || "Browse our curated selection of properties",
            "numberOfItems": itemListData.items?.length || 0,
            "itemListElement": itemListData.items?.slice(0, 10).map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": item.type === 'bnb' ? "LodgingBusiness" : "RealEstateListing",
                "@id": `${siteUrl}${item.url}`,
                "name": item.title,
                "description": item.description,
                "image": item.image,
                "url": `${siteUrl}${item.url}`,
                ...(item.price && {
                  "offers": {
                    "@type": "Offer",
                    "price": item.price,
                    "priceCurrency": "KES"
                  }
                }),
                ...(item.rating && {
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": item.rating,
                    "reviewCount": item.reviews || 1
                  }
                })
              }
            })) || []
          })}
        </script>
      )}

      {/* CollectionPage Schema for listing pages */}
      {itemListData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${fullCanonicalUrl}#webpage`,
            "name": fullTitle,
            "description": metaDescription,
            "url": fullCanonicalUrl,
            "isPartOf": {
              "@id": `${siteUrl}/#website`
            },
            "about": {
              "@type": "Thing",
              "name": itemListData.name || "Real Estate Properties"
            },
            "provider": {
              "@id": `${siteUrl}/#organization`
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
