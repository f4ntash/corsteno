export type ContactChannels = {
  whatsappUrl: string | null;
  email: string | null;
};

// Production values are intentionally unset until Corsteno provides verified channels.
export const contactChannels: ContactChannels = {
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() || null,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null,
};
