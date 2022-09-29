import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IFile } from '../../models/catalogs/file.model';
@Injectable({
  providedIn: 'root',
})
export class FileService implements ICrudMethods<IFile> {
  private readonly route: string = ENDPOINT_LINKS.File;
  constructor(private fileRepository: Repository<IFile>) {}

  getAll(params?: ListParams): Observable<IListResponse<IFile>> {
    return this.fileRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IFile> {
    return this.fileRepository.getById(this.route, id);
  }

  create(model: IFile): Observable<IFile> {
    return this.fileRepository.create(this.route, model);
  }

  update(id: string | number, model: IFile): Observable<Object> {
    return this.fileRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.fileRepository.remove(this.route, id);
  }
}
