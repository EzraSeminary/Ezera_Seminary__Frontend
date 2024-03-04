declare module "ethiopian-date" {
  export function toEthiopian(
    gregorianYear: number,
    gregorianMonth: number,
    gregorianDay: number
  ): [number, number, number];
}
