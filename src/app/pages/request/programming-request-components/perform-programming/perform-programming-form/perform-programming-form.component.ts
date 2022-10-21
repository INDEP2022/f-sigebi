import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { IState } from 'src/app/core/models/catalogs/city.model';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ESTATE_COLUMNS } from '../../acept-programming/columns/estate-columns';
import { USER_COLUMNS } from '../../acept-programming/columns/users-columns';
import { WarehouseFormComponent } from '../../warehouse/warehouse-form/warehouse-form.component';
import { EstateSearchFormComponent } from '../estate-search-form/estate-search-form.component';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-perform-programming-form',
  templateUrl: './perform-programming-form.component.html',
  styles: [],
})
export class PerformProgrammingFormComponent
  extends BasePage
  implements OnInit
{
  settingEstate = { ...TABLE_SETTINGS, actions: false };
  settingUser = { ...TABLE_SETTINGS, actions: false };
  estates: any[] = [];
  usersData: any[] = [];
  performForm: FormGroup = new FormGroup({});
  users = new DefaultSelect<IUser>();
  regionalsDelegations = new DefaultSelect<IRegionalDelegation>();
  states = new DefaultSelect<IState>();
  transferences = new DefaultSelect<ITransferente>();
  stations = new DefaultSelect<IStation>();
  authority = new DefaultSelect<IAuthority>();
  typeRelevant = new DefaultSelect();
  warehouse = new DefaultSelect();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settingEstate.columns = ESTATE_COLUMNS;
    this.settingUser.columns = USER_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.performForm = this.fb.group({
      email: [null, [Validators.required]],
      address: [null, [Validators.required]],
      city: [null],
      startDate: [null],
      endDate: [null],
      observation: [null],
      regionalDelegation: [null],
      state: [null],
      transference: [null],
      station: [null],
      authority: [null],
      typeRelevant: [null],
      warehouse: [null],
      userId: [null],
    });
  }

  newUser() {
    const newUser = this.modalService.show(UserFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  newWarehouse() {
    const newWarehouse = this.modalService.show(WarehouseFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  estateSearch() {
    const estateSearch = this.modalService.show(EstateSearchFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  getUsersSelect(user: ListParams) {}

  getRegionalDelegationSelect(regionalDelegation: ListParams) {}

  getStateSelect(state: ListParams) {}

  getTransferenceSelect(transference: ListParams) {}

  getStationSelect(station: ListParams) {}

  getAuthoritySelect(authority: ListParams) {}

  getTypeRelevantSelect(typeRelevant: ListParams) {}

  getWarehouseSelect(warehouse: ListParams) {}

  confirm() {}

  close() {
    this.modalService.hide();
  }
}
