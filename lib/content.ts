export type TeamMember = {
  name: string;
  role: string;
  specialties: string;
  linkedinUrl: string | null;
};

export const teamMembers: TeamMember[] = [
  {
    name: "Matias Gerstner",
    role: "Cofundador · Ingeniería de producto",
    specialties: "Experiencias web, producto y 3D interactivo",
    linkedinUrl: "https://www.linkedin.com/in/matiasgerstner/",
  },
  {
    name: "Elias Correa",
    role: "Cofundador · Ingeniería Unity y XR",
    specialties: "Experiencias inmersivas, 3D en tiempo real y educación",
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
