import { DataSource } from 'ng2-smart-table/lib/lib/data-source/data-source';
import { Observable } from 'rxjs';

export class FetchedSubCategoriesModel {
  constructor(
    public name: string,
    public id: number,
    public picture: string,
    public deleted: boolean,
    public image?: Array<any>
  ) {}
}

export abstract class ImageCategoryData {
  abstract get gridDataSource(): DataSource;
  abstract list(
    pageNumber: number,
    limit: number
  ): Observable<FetchedSubCategoriesModel[]>;
}
