import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { IState } from 'src/app/core/models/catalogs/city.model';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { ITypeRelevant } from 'src/app/core/models/catalogs/type-relevant.model';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { WarehouseFormComponent } from '../../../shared-request/warehouse-form/warehouse-form.component';
import { ESTATE_COLUMNS } from '../../acept-programming/columns/estate-columns';
import { USER_COLUMNS } from '../../acept-programming/columns/users-columns';
import { SearchUserFormComponent } from '../../schedule-reception/search-user-form/search-user-form.component';
import { ProgrammingRequestService } from '../../service/programming-request.service';
import { EstateSearchFormComponent } from '../estate-search-form/estate-search-form.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { userData } from './data-perfom-programming';
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
  estatesList: any[] = [];
  usersData = userData;
  performForm: FormGroup = new FormGroup({});
  estateForm: FormGroup = new FormGroup({});
  regionalsDelegations = new DefaultSelect<IRegionalDelegation>();
  states = new DefaultSelect<IState>();
  transferences = new DefaultSelect<ITransferente>();
  stations = new DefaultSelect<IStation>();
  authorities = new DefaultSelect<IAuthority>();
  typeRelevant = new DefaultSelect<ITypeRelevant>();
  warehouse = new DefaultSelect<IWarehouse>();
  warehouseUbication: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  showForm: boolean = false;
  showUbication: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private programmingRequestService: ProgrammingRequestService,
    private stationService: StationService,
    private regionalDelegationService: RegionalDelegationService,
    private stateService: StateOfRepublicService,
    private transferentService: TransferenteService,
    private typeRelevantService: TypeRelevantService,
    private warehouseService: WarehouseService,
    private authorityService: AuthorityService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: ESTATE_COLUMNS,
    };
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

  searchEstate() {
    this.estateForm = this.fb.group({
      akaWarehouse: [null],
      state: [null],
      municipality: [null],
      colony: [null],
      cp: [null],
    });
  }

  typeSchedule(type: ITypeRelevant) {
    if (type.id != null) {
      this.showForm = true;
    }
  }

  showWarehouse(warehouse: IWarehouse) {
    this.warehouseUbication = warehouse.ubication;
    this.showUbication = true;
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

  listUsers() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const searchUser = this.modalService.show(SearchUserFormComponent, config);
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

  //Errores back//
  // Corregir ruta cuando ya se cambie a /catalog //
  getRegionalDelegationSelect(params: ListParams) {
    this.regionalDelegationService.getAll(params).subscribe(data => {
      this.regionalsDelegations = new DefaultSelect(data.data, data.count);
    });
  }
  // Corregir ruta cuando ya se cambie a /catalog //
  getStateSelect(params: ListParams) {
    this.stateService.getAll(params).subscribe(data => {
      console.log(data);
      this.states = new DefaultSelect(data.data, data.count);
    });
  }

  getTransferentSelect(params?: ListParams) {
    console.log(params);
    this.transferentService.getAll(params).subscribe(data => {
      this.transferences = new DefaultSelect(data.data, data.count);
    });
  }

  transferentSelect(item: ITransferente) {
    this.getStations(item.id);
  }

  getStations(id: number) {
    const idTransferent = {
      idTransferent: id,
    };

    this.stationService.getByColumn(idTransferent).subscribe(data => {
      this.stations = new DefaultSelect(data.data);
    });
  }

  getTypeRelevantSelect(params: ListParams) {
    this.typeRelevantService.getAll(params).subscribe(data => {
      this.typeRelevant = new DefaultSelect(data.data, data.count);
    });
  }

  getWarehouseSelect(params: ListParams) {
    this.warehouseService.getAll(params).subscribe(data => {
      this.warehouse = new DefaultSelect(data.data, data.count);
    });
  }

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
