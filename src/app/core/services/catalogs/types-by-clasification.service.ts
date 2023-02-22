import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  ITypesByClasification,
  ITypesByClasificationRaw,
} from '../../models/catalogs/types-by-clasification';
@Injectable({
  providedIn: 'root',
})
export class TypesByClasificationService
  implements ICrudMethods<ITypesByClasification>
{
  constructor(
    private typeServicesRepository: Repository<ITypesByClasification>
  ) {}
  getById(id: string | number): Observable<ITypesByClasification> {
    return this.typeServicesRepository
      .getById('catalog/typesbyclasification', id)
      .pipe(map((types: any) => this.convertData(types)));
  }

  private convertData(response: IListResponse<ITypesByClasificationRaw>) {
    if (response.data.length == 0) {
      const error = new HttpErrorResponse({
        status: 404,
      });
      throw error;
    }
    const rawTypes = response.data[0];
    const {
      id,
      noType,
      descType,
      noSubtype,
      descSubtype,
      noSsubtype,
      descSsubtype,
      noSssubtype,
      descSssubtype,
    } = rawTypes;
    return {
      id: id,
      type: { id: noType, nameGoodType: descType },
      subtype: { id: noSubtype, nameSubtypeGood: descSubtype },
      ssubtype: { id: noSsubtype, description: descSsubtype },
      sssubtype: { id: noSssubtype, description: descSssubtype },
    };
  }
}
