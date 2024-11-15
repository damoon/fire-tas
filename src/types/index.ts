export interface GeneralData {
  inflation: number;
  salaryIncrease: number;
  medianSalary: number;
  medianSalaryIncrease: number;
  pensionPointValue: number;
  retirementAge: number;
  expectedReturn: number;
  returnTax: number;
}

export interface PersonData {
  name: string;
  birthYear: number;
  gross: number;
  net: number;
  pensionPoints: number;
  currentCompanyPension: number;
  companyPension: number;
}

export interface HouseholdData {
  expenses: number;
  coastAge: number;
  fireAge: number;
  payoutRate: number;
  sequenceOrReturnRiskPremium: number;
  numberOfChildren: number;
  currentInvestments: number;
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
export interface ColumnVisibility {
  [key: string]: boolean;
}

export interface YearlyDataRow {
  index: number;
  year: number;
  ageA: number;
  ageB: number;
  inflationFactor: number;
  medianSalaryIncreaseFactor: number;
  salaryIncreaseFactor: number;
  expenses: number;
  earnings: number;
  investment: number;
  totalInvested: number;
  grossPayout: number;
  netPayout: number;
  medianSalary: number;
  grossA: number;
  grossB: number;
  retirementPointsA: number;
  retirementPointsB: number;
  retirementPoints: number;
  retirementPointsTotalA: number;
  retirementPointsTotalB: number;
  retirementPointsTotal: number;
  retirementPointValue: number;
  retirementGross: number;
  retirementNet: number;
  income: number;
}
