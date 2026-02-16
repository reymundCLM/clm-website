const STRAPI_URL = "https://ancient-crown-9dfaf5bb18.strapiapp.com";

// --- Existing Interfaces (Global & Nav) ---
export interface GlobalData {
  id: number;
  documentId: string;
  siteName: string;
  siteDescription: string;
  mainLogo?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
}

export interface NavigationItem {
  id: number;
  title: string;
  path: string;
  order: number;
  type: "EXTERNAL" | "WRAPPER" | "INTERNAL";
  items: NavigationItem[];
}

interface StrapiNavItemRaw {
  id: number;
  title: string;
  path: string;
  externalPath?: string | null;
  type: "EXTERNAL" | "WRAPPER" | "INTERNAL";
  menuAttached: boolean;
  order: number;
  parent: { id: number } | null;
}


export interface ServiceRichTextChild {
  text: string;
  type: "text";
  bold?: boolean;
}

export interface ServiceRichTextNode {
  type: "paragraph" | "list" | "list-item" | "heading";
  format?: "unordered" | "ordered";
  children: (ServiceRichTextNode | ServiceRichTextChild)[];
}

export interface ComponentHeading {
  __component: "elements.heading";
  id: number;
  heading: string;
}

export interface ComponentRichText {
  __component: "elements.rich-text";
  id: number;
  richText: ServiceRichTextNode[];
}

export interface ComponentContactButton {
  __component: "elements.contact-button";
  id: number;
  label: string;
  phoneNumber: string;
}

export interface ComponentBackgroundImage {
  __component: "elements.background-image";
  id: number;
  background: {
    id: number;
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
    mime: string;
  };
}

export interface ComponentFaqItem {
  __component: "elements.faq-item";
  id: number;
  title: string;
  isAccordion: boolean;
  content: ServiceRichTextNode[];
}

// --- NEW: TECHNICAL SEO INTERFACES ---

export interface IconData {
  width: number;
  height: number;
  iconData: string; // SVG path string
  iconName: string;
  isSvgEditable: boolean;
  isIconNameEditable: boolean;
}

export interface ComponentFeatureItem {
  __component: "elements.feature-item";
  id: number;
  title: string;
  description: string;
  icon: IconData;
}

// Union type for the Technical SEO Dynamic Zone
export type TechnicalSeoBlock =
  | ComponentBackgroundImage
  | ComponentHeading
  | ComponentRichText
  | ComponentFeatureItem
  | ComponentFaqItem;

export interface TechnicalSeoPageData {
  id: number;
  documentId: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  technicalSEO: TechnicalSeoBlock[];
}

// --- SERVICE PAGES INTERFACES ---

export type ServicePageBlock =
  | ComponentHeading
  | ComponentRichText
  | ComponentContactButton
  | ComponentBackgroundImage
  | ComponentFaqItem;

export interface ServicePageData {
  id: number;
  documentId: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  servicePage: ServicePageBlock[];
}

// --- LANDING PAGE / HERO INTERFACES ---

export interface StrapiTextChild {
  text: string;
  type: "text";
  bold?: boolean;
}

export interface StrapiTextBlock {
  type: "paragraph";
  children: StrapiTextChild[];
}

export interface StrapiButton {
  __component: "elements.button";
  id: number;
  label: string;
  href: string;
  isExternal: boolean;
  type: "link";
}

export interface LandingPageData {
  id: number;
  documentId: string;
  eyebrow: string;
  title: StrapiTextBlock[];
  description: string;
  heroBackgound: {
    id: number;
    url: string;
    mime: string;
    width?: number;
    height?: number;
  };
  button: StrapiButton[];
}

// --- MEET THE TEAM INTERFACES ---

export interface StrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
}

export interface MeetTheTeamImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats: {
    large?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
}

export interface MeetTheTeamBackground {
  __component: "elements.background-image";
  id: number;
  background: MeetTheTeamImage;
}

export interface MeetTheTeamCardItem {
  __component: "elements.card-item";
  id: number;
  title: string;
  description: string;
  position?: string;
  image?: {
    url: string;
    alternativeText?: string;
  };
  icon?: {
    iconData: string;
    width: number;
    height: number;
  };
}

export type MeetTheTeamBlock =
  | MeetTheTeamBackground
  | ComponentHeading
  | ComponentRichText
  | StrapiButton
  | MeetTheTeamCardItem;

export interface MeetTheTeamResponse {
  data: {
    id: number;
    documentId: string;
    metaTitle: string;
    metaDescription: string;
    meetTheTeam: MeetTheTeamBlock[];
  };
}

// --- CONFLUENCE AI PAGE INTERFACES ---

export type ConfluenceBlock =
  MeetTheTeamBackground
  | ComponentHeading
  | ComponentRichText
  | StrapiButton
  | ComponentFaqItem;

export interface ConfluencePageData {
  id: number;
  documentId: string;
  metaTitle: string;
  metaDescription: string;
  confluencePage: ConfluenceBlock[];
}
export type PromptGraphBlock =
  MeetTheTeamBackground
  | ComponentHeading
  | ComponentRichText
  | StrapiButton
  | ComponentFaqItem
  | ComponentImage;

export interface PromptGraphPageData {
  id: number;
  documentId: string;
  metaTitle: string;
  metaDescription: string;
  promptGraphPage: PromptGraphBlock[];
}
export interface ComponentImage {
  __component: "elements.image";
  id: number;
  singleImage: {
    url: string;
    alternativeText?: string | null;
    width: number;
    height: number;
  };
}

// --- Logic (Navigation Tree) ---

function recursivelyBuildPaths(items: NavigationItem[], parentPath: string = "") {
  items.forEach((item) => {
    if (item.type !== "EXTERNAL" && !item.path.startsWith("http")) {
      const cleanSlug = item.path.replace(/^\//, "");
      let fullPath = "";

      if (parentPath === "/") {
        fullPath = `/${cleanSlug}`;
      } else if (parentPath) {
        fullPath = `${parentPath}/${cleanSlug}`;
      } else {
        fullPath = `/${cleanSlug}`;
      }

      if (!cleanSlug) fullPath = parentPath;
      if (item.path === "/") fullPath = "/";

      item.path = fullPath;
    }

    if (item.items && item.items.length > 0) {
      recursivelyBuildPaths(item.items, item.path);
    }
  });
}

function buildNavigationTree(flatItems: StrapiNavItemRaw[]): NavigationItem[] {
  const itemMap = new Map<number, NavigationItem>();
  const roots: NavigationItem[] = [];

  flatItems.forEach((raw) => {
    let initialPath = raw.externalPath || raw.path || "";
    if (initialPath === "/home" || raw.title === "Home") {
      initialPath = "/";
    }

    itemMap.set(raw.id, {
      id: raw.id,
      title: raw.title,
      path: initialPath,
      order: raw.order || 99,
      type: raw.type,
      items: [],
    });
  });

  flatItems.forEach((raw) => {
    const item = itemMap.get(raw.id);
    if (!item) return;

    if (raw.parent && raw.parent.id) {
      const parentItem = itemMap.get(raw.parent.id);
      if (parentItem) {
        parentItem.items.push(item);
      }
    } else {
      roots.push(item);
    }
  });

  const sortItems = (items: NavigationItem[]) => {
    items.sort((a, b) => a.order - b.order);
    items.forEach((child) => sortItems(child.items));
  };
  sortItems(roots);
  recursivelyBuildPaths(roots, "");

  return roots;
}

// --- Fetchers ---

export async function getNavigation(): Promise<NavigationItem[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/navigation/render/navigation?type=FLAT`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const flatData: StrapiNavItemRaw[] = await res.json();
    return buildNavigationTree(flatData);
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return [];
  }
}

export async function getGlobalData(): Promise<GlobalData | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/global?populate=mainLogo`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Error fetching global data:", error);
    return null;
  }
}

export async function getLandingPageData(): Promise<LandingPageData | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/hero-section?populate=*`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to fetch landing page data", res.status);
      return null;
    }

    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Error fetching landing page data:", error);
    return null;
  }
}

export async function getServicePageBySlug(slug: string): Promise<ServicePageData | null> {
  try {
    const endpoint = "/api/services";
    const url = `${STRAPI_URL}${endpoint}?filters[slug][$eq]=${slug}&populate[servicePage][populate]=*`;

    console.log(`Trying to fetch Service Page: ${url}`);

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch service page. Status: ${res.status} URL: ${url}`);
      return null;
    }

    const json = await res.json();

    if (json.data && json.data.length > 0) {
      return json.data[0];
    }

    console.log("Strapi returned 200 OK, but the data array was empty. No page matches this slug.");
    return null;
  } catch (error) {
    console.error("Error fetching service page:", error);
    return null;
  }
}

export async function getMeetTheTeamData(): Promise<MeetTheTeamResponse | null> {
  const endpoint = '/api/meet-the-team';
  const query = 'populate[meetTheTeam][populate]=*';

  const url = `${STRAPI_URL}${endpoint}?${query}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Error fetching Meet the Team data: ${res.status} ${res.statusText}`);
      return null;
    }

    const json = await res.json();
    return json;

  } catch (error) {
    console.error('Network error fetching Meet the Team data:', error);
    return null;
  }
}

export async function getConfluencePage(): Promise<ConfluencePageData | null> {
  const endpoint = "/api/confluence-ai";
  const query = "populate[confluencePage][populate]=*";
  const url = `${STRAPI_URL}${endpoint}?${query}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      console.error(`Error fetching Confluence page: ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json.data || null;

  } catch (error) {
    console.error("Fetch Confluence page failed:", error);
    return null;
  }
}
export async function getPromptGraphPage(): Promise<PromptGraphPageData | null> {
  const endpoint = "/api/prompt-graph-ai";
  const query = "populate[promptGraphPage][populate]=*";
  const url = `${STRAPI_URL}${endpoint}?${query}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      console.error(`Error fetching promptgraph page: ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json.data || null;

  } catch (error) {
    console.error("Fetch promptgraph page failed:", error);
    return null;
  }
}

// --- NEW FETCHER: Technical SEO Page ---

export async function getTechnicalSeoPage(): Promise<TechnicalSeoPageData | null> {
  const endpoint = "/api/technical-seo";
  // Manual string construction as requested (no 'qs' lib)
  const query = "populate[technicalSEO][populate]=*";

  const url = `${STRAPI_URL}${endpoint}?${query}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      console.error(`Error fetching Technical SEO page: ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json.data || null;

  } catch (error) {
    console.error("Fetch Technical SEO page failed:", error);
    return null;
  }
}
export async function getAllServices(): Promise<ServicePageData[]> {
  try {
    // We use populate=* to get the metaTitle and slug for the cards
    const res = await fetch(`${STRAPI_URL}/api/services?populate=*`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching all services:", error);
    return [];
  }
}

export function flattenNavTree(items: NavigationItem[]): NavigationItem[] {
  let flat: NavigationItem[] = [];
  for (const item of items) {
    flat.push(item);
    if (item.items && item.items.length > 0) {
      flat = flat.concat(flattenNavTree(item.items));
    }
  }
  return flat;
}