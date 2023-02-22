import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IState } from 'src/app/core/models/catalogs/city.model';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { WarehouseFormComponent } from '../../../shared-request/warehouse-form/warehouse-form.component';
import { ESTATE_COLUMNS } from '../../acept-programming/columns/estate-columns';
import { USER_COLUMNS } from '../../acept-programming/columns/users-columns';
import { EstateSearchFormComponent } from '../estate-search-form/estate-search-form.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { userData } from './data-perfom-programming';
import {
  AuthorityOptions,
  stationsOptions,
  transferentOptions,
  typeRelevantOptions,
  typeWarehouseOptions,
} from './perfom-programming-options';
@Component({
  selector: 'app-perform-programming-form',
  templateUrl: './perform-programming-form.component.html',
  styles: [],
})
export class PerformProgrammingFormComponent
  extends BasePage
  implements OnInit
{
  settingEstate = { ...this.settings, actions: false, columns: ESTATE_COLUMNS };
  settingUser = {
    ...this.settings,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      delete: true,
    },
    columns: USER_COLUMNS,
  };
  estates: any[] = [];
  usersData = userData;
  performForm: FormGroup = new FormGroup({});
  users = new DefaultSelect<IUser>();
  regionalsDelegations = new DefaultSelect<IRegionalDelegation>();
  states = new DefaultSelect<IState>();
  transferences = new DefaultSelect(transferentOptions);
  stations = new DefaultSelect(stationsOptions);
  authority = new DefaultSelect(AuthorityOptions);
  typeRelevant = new DefaultSelect(typeRelevantOptions);
  warehouse = new DefaultSelect(typeWarehouseOptions);
  warehouseAddress: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  showForm: boolean = false;
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.performForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      city: [null, [Validators.pattern(STRING_PATTERN)]],
      startDate: [null],
      endDate: [null],
      observation: [null, [Validators.pattern(STRING_PATTERN)]],
      regionalDelegation: [null],
      state: [null],
      transferent: [null],
      station: [null],
      authority: [null],
      typeRelevant: [null],
      warehouse: [null],
      userId: [null],
    });
  }

  typeSchedule(type: any) {
    if (type.id == 1) {
      this.showForm = true;
    }
  }

  showWarehouse(warehouse: any) {
    console.log(warehouse.address);
    this.warehouseAddress = warehouse.address;
  }

  openForm(userData?: any) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      userData,
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const rejectionComment = this.modalService.show(UserFormComponent, config);
  }

  newWarehouse() {
    const newWarehouse = this.modalService.show(WarehouseFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  estateSearch() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      userData,
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const estateSearch = this.modalService.show(
      EstateSearchFormComponent,
      config
    );
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

  delete(user: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecuta el servicio//
        this.onLoadToast('success', 'Usuario eliminado correctamente', '');
      }
    });
  }

  close() {
    this.modalService.hide();
  }
}
