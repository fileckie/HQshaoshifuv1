declare module 'dom-to-image-more' {
  export interface Options {
    filter?: (node: Node) => boolean;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration>;
    quality?: number;
    imagePlaceholder?: string;
    cacheBust?: boolean;
    pixelRatio?: number;
    skipFonts?: boolean;
  }

  export function toPng(node: Node, options?: Options): Promise<string>;
  export function toJpeg(node: Node, options?: Options): Promise<string>;
  export function toBlob(node: Node, options?: Options): Promise<Blob>;
  export function toPixelData(node: Node, options?: Options): Promise<Uint8Array>;
  export function toSvg(node: Node, options?: Options): Promise<string>;
}
