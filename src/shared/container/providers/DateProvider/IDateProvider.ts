export interface IDateProvider {
  convertToUTC(date: Date): string;
  dateNow(): Date;
  compareInHours(start_date: Date, end_date: Date): number;
  compareInDays(start_date: Date, end_date: Date): number;
  isBefore(start_date: Date, end_date: Date): boolean;
  addDays(days: number): Date;
  addHours(hours: number): Date;
}
