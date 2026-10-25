import data from './generated-visuals.json';
type Variant = { url: string; width: number; height: number; bytes: number; sha256: string };
type VisualAsset = { kind: string; alt: string; width: number; height: number; variants: Variant[]; og?: Variant };
export const visualAssets = data.assets as Record<string, VisualAsset>;
export function visualAsset(id: string) {
  const asset = visualAssets[id];
  if (!asset) throw new Error('缺少生成素材：' + id);
  return asset;
}
