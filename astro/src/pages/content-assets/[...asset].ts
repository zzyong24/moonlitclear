import fs from 'node:fs';
import path from 'node:path';
import manifest from '../../../docs/content-manifest.json';
import type { APIRoute } from 'astro';

export const prerender = true;
export function getStaticPaths() {
  return manifest.assets.map((asset) => ({ params: { asset: asset.name }, props: { asset } }));
}
export const GET: APIRoute = ({ props }) => {
  const asset = props.asset;
  const file = path.join(process.cwd(), '.content-cache', manifest.generation, 'assets', asset.name);
  return new Response(new Uint8Array(fs.readFileSync(file)), { headers: { 'Content-Type': asset.type } });
};
