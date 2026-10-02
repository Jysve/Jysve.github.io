// Copyright Jv.(@Jysve) 2026.

const siteUrl = ("https://sve.moe");
export const SITE = {
  name: "Jv.",
  description:
    "Embrace what the age brings. Some are to be pursued, others let go. Do not seek all answers amid exploration. Savor the journey, which is what life ought to be.",
  url: siteUrl,
  locale: "en-US",
  language: "en",
  repositoryUrl: "https://github.com/Jysve",
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
  socialUrl: "zhihu.com/people/Jysve",
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
  { href: CONTACT.socialUrl, label: `${SITE.name} on X`, icon: "zhihu" },
  { href: SITE.repositoryUrl, label: `${SITE.name} on GitHub`, icon: "github" },
  { href: `mailto:${CONTACT.email}`, label: "Email", icon: "mail" },
];

export const authors = [
  {
    slug: "Jysve",
    name: "Jv.",
    bio: "Explore. Dream. Discover.",
    longBio: "longBio, waiting for being editing. maybe someday.",
    avatar: "/avatars/jysve.webp",
  },
];

export const categories = [
  { slug: "essays", name: "Essays" },
  { slug: "announcements", name: "Announcements" },
  { slug: "thoughts", name: "Thoughts" },
  { slug: "comments", name: "Comments" },
  { slug: "records", name: "Records" },
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
