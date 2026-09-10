declare module "*.png?w=320;480;640;800;1024;1280&format=webp&quality=90&as=srcset" {
  const src: string;
  export default src;
}

declare module "*.png?w=320;480;640;800;1024;1280&format=webp&quality=90&as=img" {
  const img: { src: string; w: number; h: number; srcset: string };
  export default img;
}

declare module "*.png?w=320;480;640;800;1024;1280&format=webp&quality=90&as=picture" {
  const picture: { sources: Record<string, string>; img: { src: string; w: number; h: number } };
  export default picture;
}

declare module "*.png?w=320;480;640;800;1024;1280&format=webp&quality=90&as=url" {
  const src: string;
  export default src;
}
