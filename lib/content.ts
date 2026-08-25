export type TeamMember = {
  name: string;
  role: string;
  specialties: string;
  linkedinUrl: string | null;
};

export const teamMembers: TeamMember[] = [
  {
    name: "Matias Gerstner",
    role: "Co-Founder · Product Engineer",
    specialties: "Web Experiences, Product & Interactive 3D",
    linkedinUrl: "https://www.linkedin.com/in/matiasgerstner/",
  },
  {
    name: "Elias Correa",
    role: "Co-Founder · Unity & XR Engineer",
    specialties: "Immersive Experiences, Real-Time 3D & Education",
    linkedinUrl: "https://www.linkedin.com/in/elias-correa-/",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  company: string;
  role: string;
};

// Add only verified client testimonials. The section remains hidden while this list is empty.
export const testimonials: Testimonial[] = [];
