// Copyright Sve(@Jysve) 2026.

import { containsServerDirective } from "astro/dist/runtime/server/render/server-islands";

const siteUrl = "https://sve.moe";
export const SITE = {
  name: "Sve",
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
  zhihu: "https://www.zhihu.com/people/Jysve",
  github: "https://github.com/Jysve",
  discord: "https://discord.com/users/910830643422838784",
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
  { href: `mailto:${CONTACT.email}`, label: "Email", icon: "mail" },
  { href: CONTACT.zhihu, label: `Jysve on Zhihu`, icon: "zhihu" },
  { href: CONTACT.github, label: `Jysve on GitHub`, icon: "github" },
  { href: CONTACT.discord, label: `Jysve on Discord`, icon: "discord" },
];

export const authors = [
  {
    slug: "Jysve",
    name: "Jysve",
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
