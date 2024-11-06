
export interface GeneralData {
  inflation: number;
  salaryIncrease: number;
  medianSalary: number;
  pensionPointValue: number;
  retirementAge: number;
  expectedReturn: number;
  returnTax: number;
}

export interface PersonData {
  birthYear: number;
  gross: number;
  net: number;
  pensionPoints: number;
  currentCompanyPension: number;
  companyPension: number;
}

export interface HouseholdData {
  expenses: number;
  desiredRetirementAge: number;
  payoutRate: number;
  numberOfChildren: number;
}

export interface FormData {
  general: GeneralData;
  personA: PersonData;
  personB: PersonData;
  household: HouseholdData;
}

export interface Column {
  visible: boolean;
  label: string;
}

export interface Columns {
  [key: string]: Column;
}

export interface YearlyDataRow {
  index: number;
  year: number;
  ageA: number;
  ageB: number;
}
