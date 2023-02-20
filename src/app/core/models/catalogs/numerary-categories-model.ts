export interface INumeraryCategories {
  id: string;
  description: string;
  enterExit: string;
  noRegistration?: number;
}
export interface ICategorizationAutomNumerary {
  typeProceeding: string;
  finalCategory: string;
  initialCategory: string;
  registerNumber: number;
}
export interface INumeraryParameterization {
  typeProceeding: string;
  initialCategory: string;
  finalCategory: string;
  initialCategoryDescription: string;
  finalCategoryDescription: string;
}
