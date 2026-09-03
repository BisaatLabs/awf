export const WHATSAPP_NUMBER = '923333444300';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function createWhatsAppUrl(message: string): string {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

export function createProductWhatsAppUrl(product: { name: string; category: string; materials: string[] }): string {
  return createWhatsAppUrl(`Hello Al Wahid Furnitures,\n\nI’m interested in:\n\nProduct: ${product.name}\nCategory: ${product.category}\nMaterial: ${product.materials.join(', ')}\n\nCould you please share:\n\n• Price\n• Available sizes\n• Materials / finishes\n• Customization options\n• Delivery timeline\n\nThank you.`);
}

export const customWhatsAppUrl = createWhatsAppUrl(`Hello Al Wahid Furnitures,\n\nI’m interested in a custom furniture project.\n\nI would like to discuss dimensions, materials, quantity and requirements.\n\nPlease guide me on the next steps.`);

export const corporateWhatsAppUrl = createWhatsAppUrl(`Hello Al Wahid Furnitures,\n\nI’m interested in discussing a corporate / bulk furniture project.\n\nI would like to discuss:\n\n• Furniture requirements\n• Quantity\n• Dimensions\n• Materials\n• Project timeline\n• Delivery and installation\n\nPlease guide me on the next steps.`);
