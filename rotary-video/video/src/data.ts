/**
 * 図表の元データ。正本は ../scripts/data.json（数値の二重管理をしない・07 §5）。
 * グラフ部品はここ経由で数値を読み、コンポーネントに数値を直書きしない。
 */
import raw from "../../scripts/data.json";

type Series = {
  years?: number[];
  labels?: string[];
  sublabels?: string[];
  names?: string[];
  values: number[];
  display?: string[];
  clubs?: number[];
  status: string[];
  as_of?: string;
  source_note: string;
};

export const data = raw as unknown as {
  japan_members_recent: Series;
  polio_wpv: Series;
  women_ratio: Series;
  foundation_giving: Series;
  dues_per_capita: Series;
};
