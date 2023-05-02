import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDrawer } from '../../models/catalogs/drawer.model';
@Injectable({
  providedIn: 'root',
})
export class DrawerService implements ICrudMethods<IDrawer> {
  private readonly route: string = ENDPOINT_LINKS.Drawer;
  constructor(private drawerRepository: Repository<IDrawer>) {}

  getAll(params?: ListParams): Observable<IListResponse<IDrawer>> {
    return this.drawerRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IDrawer> {
    return this.drawerRepository.getById(this.route, id);
  }

  create(model: IDrawer): Observable<IDrawer> {
    return this.drawerRepository.create(this.route, model);
  }

  updateByIds(ids: Partial<IDrawer>, model: IDrawer): Observable<Object> {
    return this.drawerRepository.updateByIds(this.route, ids, model);
  }

  removeByIds(ids: Partial<IDrawer>): Observable<Object> {
    return this.drawerRepository.removeByIds(this.route, ids);
  }
}
