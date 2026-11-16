/**
 * Presets: disaggregated DEFAULT values from Annex V Part D and default GHG
 * savings from Annex V Part A of Directive (EU) 2018/2001, consolidated text
 * 02018L2001-20240716. Values in gCO2eq/MJ. Verified against the source –
 * do not change and do not add others.
 */
export interface Preset {
  id: string;
  name: string;
  eec: number;
  ep: number;
  etd: number;
  /** Total default emissions, eec + ep + etd. */
  total: number;
  /** Default GHG saving from Part A, in whole percent. */
  partASavingPercent: number;
}

export const PRESETS: readonly Preset[] = [
  { id: 'wco-biodiesel', name: 'Waste cooking oil biodiesel', eec: 0, ep: 13.0, etd: 1.9, total: 14.9, partASavingPercent: 84 },
  { id: 'wco-hvo', name: 'Hydrotreated oil from waste cooking oil (HVO)', eec: 0, ep: 14.3, etd: 1.7, total: 16.0, partASavingPercent: 83 },
  { id: 'rapeseed-biodiesel', name: 'Rape seed biodiesel', eec: 32.0, ep: 16.3, etd: 1.8, total: 50.1, partASavingPercent: 47 },
  {
    id: 'sugar-beet-ethanol',
    name: 'Sugar beet ethanol (no biogas from slop, natural gas as process fuel in conventional boiler)',
    eec: 9.6,
    ep: 26.3,
    etd: 2.3,
    total: 38.2,
    partASavingPercent: 59,
  },
  { id: 'sugar-cane-ethanol', name: 'Sugar cane ethanol', eec: 17.1, ep: 1.8, etd: 9.7, total: 28.6, partASavingPercent: 70 },
];

export const PRESET_SOURCE =
  'Annex V Parts A and D, Directive (EU) 2018/2001, consolidated text 02018L2001-20240716';
