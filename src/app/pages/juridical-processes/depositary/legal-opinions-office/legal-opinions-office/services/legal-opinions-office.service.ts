import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';

@Injectable({
  providedIn: 'root',
})
export class LegalOpinionsOfficeService {
  constructor(private msUsersService: UsersService) {}

  getIssuingUserByDetail(params: _Params) {
    return this.msUsersService.getAllSegUsers(params);
  }
  getAddresseeByDetail(params: ListParams) {
    return this.msUsersService.getAllSegXAreas(params);
  }
}
