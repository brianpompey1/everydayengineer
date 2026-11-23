/**
 * Shop types shared by server and browser code — no server-only imports here.
 */

export interface Variant {
  id: string;
  size: string;
  stock: number;
}

export interface SetPart {
  label: string;
  /** Slugs of the products this part can be chosen from. */
  products: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  category: string;
  tax_code: string;
  images: string[];
  set_parts: SetPart[] | null;
  sort_order: number;
  variants: Variant[];
}

/** One line in the browser's cart. Prices and stock are always re-checked on the server. */
export interface CartLine {
  /** Unique per product + choice, so the same choice merges into one line. */
  key: string;
  slug: string;
  /** Regular products: the chosen size. */
  size?: string;
  /** Sets: one choice per part, in the set's part order. */
  parts?: { slug: string; size: string }[];
  quantity: number;
}

export type Fulfillment = 'ship' | 'pickup';

export const SHIPPING_CENTS = 800;
export const MAX_PER_LINE = 10;

export const usd = (cents: number) => `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;

export const cartLineKey = (slug: string, size?: string, parts?: { slug: string; size: string }[]) =>
  [slug, size ?? '', ...(parts ?? []).map((p) => `${p.slug}:${p.size}`)].join('|');

export const totalStock = (p: Product) => p.variants.reduce((n, v) => n + v.stock, 0);

/** For a set: every in-stock option for one part, across its products. */
export function setPartOptions(part: SetPart, catalog: Product[]) {
  return part.products.flatMap((slug) => {
    const product = catalog.find((p) => p.slug === slug);
    return (product?.variants ?? []).map((v) => ({ slug, productName: product!.name, size: v.size, stock: v.stock }));
  });
}

/** A set is available only if every part has at least one option in stock. */
export function setAvailable(product: Product, catalog: Product[]): boolean {
  return (product.set_parts ?? []).every((part) => setPartOptions(part, catalog).some((o) => o.stock > 0));
}
