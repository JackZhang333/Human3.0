import Script from 'next/script';

export default function SchemaMarkup() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Human 3.0 Assessment",
        "description": "Professional assessment framework for multidimensional personal development across Mind, Body, Spirit, and Vocation quadrants",
        "url": "https://human3.assessment.com",
        "logo": "https://human3.assessment.com/logo.png",
        "sameAs": []
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Human 3.0 Assessment",
        "url": "https://human3.assessment.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://human3.assessment.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is Human 3.0?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Human 3.0 is a comprehensive framework for maximizing your potential across all life domains rather than specializing in just one area. It integrates Mind (思想、情感、信念), Body (健康、体能、精力), Spirit (关系、意义、社群), and Vocation (事业、价值创造、影响力) for systematic lifestyle integration."
                }
            },
            {
                "@type": "Question",
                "name": "What are the 4 Quadrants of Development?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The 4 Quadrants represent different dimensions of human development: Mind (individual psychological world), Body (individual physical world), Spirit (collective psychological world), and Vocation (collective physical world). True growth requires integration across all four dimensions."
                }
            },
            {
                "@type": "Question",
                "name": "What does 'Multidimensionally Jacked' mean?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Being 'Multidimensionally Jacked' means achieving balanced, integrated development across all four quadrants - Mind, Body, Spirit, and Vocation - rather than excelling in just one area. It represents the Level 3.0 Synthesist stage of consciousness."
                }
            },
            {
                "@type": "Question",
                "name": "How does the Human 3.0 Assessment work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The assessment uses AI-driven adaptive interviewing to evaluate your development stage across the 4 quadrants. It identifies your consciousness level (Conformist 1.0, Individualist 2.0, or Synthesist 3.0) and provides personalized transformation strategies for systematic evolution."
                }
            }
        ]
    };

    const assessmentSchema = {
        "@context": "https://schema.org",
        "@type": "Quiz",
        "name": "Human 3.0 Development Assessment",
        "description": "Comprehensive assessment of your development across Mind, Body, Spirit, and Vocation quadrants to identify your consciousness level and transformation path",
        "educationalLevel": "All levels",
        "assesses": "Personal development across 4 life quadrants",
        "educationalAlignment": {
            "@type": "AlignmentObject",
            "alignmentType": "educationalSubject",
            "educationalFramework": "Human 3.0 Framework",
            "targetName": "Multidimensional Development Assessment"
        }
    };

    return (
        <>
            <Script
                id="organization-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <Script
                id="website-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Script
                id="assessment-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(assessmentSchema) }}
            />
        </>
    );
}
