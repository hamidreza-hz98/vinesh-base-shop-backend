const sanitizeHtml = require("sanitize-html");

const generateProductSchema = (product) => {
    const image = product.seo.ogImage
      ? `${process.env.BASE_URL}${product.seo.ogImage.path}`
      : null;

    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.seo.title,
      "image": image,
      "description": product.seo.description,
      "sku": product._id.toString(),
      "brand": {
        "@type": "Brand",
        "name": product.brand?.name || "نامشخص"
      },
      "category": product.categories.length > 0
         ? product.categories.map(cat => cat.name)
         : undefined
      ,
      "offers": {
        "@type": "Offer",
        "url": `${process.env.BASE_URL}/products/${product.slug}`,
        "priceCurrency": "IRR",
        "price": product.discount > 0 ?
          (product.price - product.discount).toString() :
          product.price.toString(),
        "availability": product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    };
}

const generateFAQSchema = (faqs) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
};

const generateTermsSchema = (terms) => {
  if (!terms || terms.length === 0) return null;

const cleanDescription = (description) => sanitizeHtml(description, {
  allowedTags: ["p", "br", "strong", "b", "em", "ul", "li"],
  allowedAttributes: {},
});


  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: terms.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: cleanDescription(item.description),
    })),
  };
};

module.exports = {
  generateProductSchema,
  generateFAQSchema,
  generateTermsSchema
}