export interface Category {
  _id: string;
  nameHe: string;
  nameEn?: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  sortOrder?: number;
}

export interface ImageAsset {
  _id: string;
  title?: string;
  alt?: string;
  description?: string;
  url: string;
  thumbUrl?: string;
  category?: Category | string | null;
  featured?: boolean;
  likeCount?: number;
  sortOrder?: number;
  width?: number;
  height?: number;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface Testimonial {
  _id: string;
  authorName: string;
  text: string;
  rating?: number;
  photoUrl?: string;
  visible?: boolean;
  sortOrder?: number;
}

export interface HomepageSection {
  _id: string;
  sectionKey: string;
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  sortOrder?: number;
  visible?: boolean;
  meta?: Record<string, unknown>;
}

/** מוצר — תואם API ‎`/api/products`‎ (לדוגמה דרישות קורס: רשימה, פרטים, CRUD) */
export interface Product {
  _id: string;
  title: string;
  description?: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  slug: string;
  visible?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactPayload {
  username: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactMessage {
  _id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  read?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
