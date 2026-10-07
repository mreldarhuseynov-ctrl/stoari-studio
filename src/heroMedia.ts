export type HeroVariant = '' | '-portrait' | '-landscape'

/** A narrow desktop panel is not a portrait phone. Match the viewing shape. */
export function chooseHeroVariant(narrow: boolean, portrait: boolean, coarse: boolean): HeroVariant {
  if (narrow && portrait) return '-portrait'
  return narrow || coarse ? '-landscape' : ''
}
