import { ISubcategory } from './sub-category.model';

export class ICategory {
  name: string;
  id: number;
  imageUrl: string;
  deleted: boolean;
  SubCategories?: ISubcategory[];
}
