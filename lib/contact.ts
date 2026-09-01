export type ContactChannels = {
  whatsappUrl: string | null;
  email: string | null;
};

export type SocialLinks = {
  instagramUrl: string | null;
  linkedinUrl: string | null;
};

function verifiedWebUrl(value: string | undefined) {
  const candidate = value?.trim();
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function verifiedEmail(value: string | undefined) {
  const candidate = value?.trim();
  return candidate && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : null;
}

// Production values are intentionally unset until Corsteno provides verified channels.
export const contactChannels: ContactChannels = {
  whatsappUrl: verifiedWebUrl(process.env.NEXT_PUBLIC_WHATSAPP_URL),
  email: verifiedEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
};

export const socialLinks: SocialLinks = {
  instagramUrl: verifiedWebUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  linkedinUrl: verifiedWebUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL),
};
