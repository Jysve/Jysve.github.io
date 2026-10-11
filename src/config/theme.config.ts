// Copyright Jv.(@Jysve) 2026.

const siteUrl = "https://sve.moe";
export const SITE = {
  name: "Jv.",
  description: `Technical, Academic, and Daily Life.`,
  url: siteUrl,
  locale: "en-US",
  language: "en",
  repositoryUrl: "https://github.com/Jysve/jysve.github.io",
  ogImg: "/og.webp",
};

export const NAVIGATION = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Writing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const CONTACT = {
  email: "Jv@sve.moe",
  socialHandle: "Jysve",
  socialUrl: "https://www.zhihu.com/people/Jysve",
};

export const FORMS = {
  contact: {
    action: "",
    method: "post",
    enctype: "application/x-www-form-urlencoded",
  },
  newsletter: {
    action: "",
    method: "post",
    enctype: "application/x-www-form-urlencoded",
  },
};

export const SOCIAL_LINKS = [
  { href: "/rss.xml", label: "RSS feed", icon: "rss" },
  { href: CONTACT.socialUrl, label: `${SITE.name} on Zhihu`, icon: "zhihu" },
  { href: SITE.repositoryUrl, label: `${SITE.name} on GitHub`, icon: "github" },
  { href: `mailto:${CONTACT.email}`, label: "Email", icon: "mail" },
];

export const authors = [
  {
    slug: "Jysve",
    name: "Jv.",
    bio: "Explore. Dream. Discover.",
    longBio: "The purpose of computing is insight, not numbers.",
    avatar: "/avatars/jysve.webp",
  },
];

export const categories = [
  { slug: "essays", name: "Essays" },
  { slug: "announcements", name: "Announcements" },
  { slug: "reprints", name: "Reprints" },
  { slug: "reports", name: "Reports" },
];

export const tags = [
  { slug: "experience", name: "Experience" },
  { slug: "math", name: "Math" },
  { slug: "physics", name: "Physics" },
  { slug: "software", name: "Software" },
  { slug: "hardware", name: "Hardware" },
  { slug: "ai", name: "AI" },
  { slug: "apache", name: "Apache" },
  { slug: "cncf", name: "CNCF" },
  { slug: "life", name: "Life" },
  { slug: "others", name: "Others" },
];
