import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IStoreStock } from 'src/app/core/models/ms-store-alias-stock/store-alias-stock.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TypeWarehouseService } from 'src/app/core/services/catalogs/type-warehouse.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { StoreAliasStockService } from 'src/app/core/services/ms-store/store-alias-stock.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { WarehouseConfirmComponent } from '../warehouse-confirm/warehouse-confirm.component';

@Component({
  selector: 'app-warehouse-show',
  templateUrl: './warehouse-show.component.html',
  styles: [],
})
export class WarehouseShowComponent extends BasePage implements OnInit {
  programmingId: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  store: IStoreStock;
  regionalDelegation: string = '';
  stateOfRepublicName: string = '';
  municipalityName: string = '';
  cityName: string = '';
  localityName: string = '';
  typeWarehouseName: string = '';
  startDate: string = '';
  endDate: string = '';
  programming: Iprogramming;
  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private storeService: StoreAliasStockService,
    private delegationService: RegionalDelegationService,
    private stateOfRepublicService: StateOfRepublicService,
    private municipalityService: MunicipalityService,
    private cityService: CityService,
    private localityService: LocalityService,
    private typeWarehouseService: TypeWarehouseService,
    private router: Router,
    private programmingService: ProgrammingRequestService
  ) {
    super();
    this.programmingId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')
    );
  }

  ngOnInit(): void {
    this.getInfoWarehouse();
  }

  getInfoWarehouse() {
    this.params.getValue()['filter.idProgramming'] = this.programmingId;
    this.storeService.getAllWarehouses(this.params.getValue()).subscribe({
      next: response => {
        this.store = response.data[0];
        const idDelegationReg = response.data[0].wildebeestDelegationregion;
        const idStateOfRep = response.data[0].idState;
        const idMunicipality = response.data[0].wildebeestmunicipality;
        const idCity = response.data[0].idCity;
        const locality = response.data[0].wildebeestSettlement;
        const typeWarehouse = response.data[0].tpstore;

        this.getProgramming(response.data[0].idProgramming);
        this.getRegionalDelegation(idDelegationReg);
        this.getStateOfRepublic(idStateOfRep);
        this.getMunicipality(idMunicipality, idStateOfRep);
        this.getCityService(idCity);
        this.getLocality(idMunicipality, idStateOfRep, locality);
        this.getTypeWarehouse(typeWarehouse);

        const startDate = response.data[0].fhstart;
        const endDate = response.data[0].fhend;
        this.startDate = moment(startDate).format('DD-MM-YYYY');
        this.endDate = moment(endDate).format('DD-MM-YYYY');
      },
      error: error => {},
    });
  }

  getRegionalDelegation(idDelegation: number) {
    this.delegationService.getById(idDelegation).subscribe({
      next: response => {
        this.regionalDelegation = response.description;
      },
      error: error => {},
    });
  }

  getStateOfRepublic(idState: string) {
    this.stateOfRepublicService.getById(idState).subscribe({
      next: response => {
        this.stateOfRepublicName = response.descCondition;
      },
      error: error => {},
    });
  }

  getMunicipality(idMunicipality: string, idState: string) {
    const model: object = {
      idMunicipality: idMunicipality,
      stateKey: idState,
    };

    this.municipalityService.postById(model).subscribe({
      next: response => {
        this.municipalityName = response.nameMunicipality;
      },
      error: error => {},
    });
  }

  getCityService(idCity: string) {
    this.params.getValue()['filter.idCity'] = idCity;
    this.cityService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.cityName = response.data[0].nameCity;
      },
      error: error => {},
    });
  }

  getLocality(idMunicipality: string, idState: string, idLocality: string) {
    this.params.getValue()['filter.stateKey'] = idState;
    this.params.getValue()['filter.municipalityId'] = idMunicipality;
    this.params.getValue()['filter.id'] = idLocality;
    this.localityService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.localityName = response.data[0].nameLocation;
      },
      error: error => {},
    });
  }

  getTypeWarehouse(idTypeWarehouse: number) {
    this.typeWarehouseService.getById(idTypeWarehouse).subscribe({
      next: response => {
        this.typeWarehouseName = response.description;
      },
      error: error => {},
    });
  }

  confirm() {
    const store = this.store;

    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      store,
      callback: (next: boolean) => {},
    };

    this.modalService.show(WarehouseConfirmComponent, config);

    /*const confirmWarehouse = this.modalService.show(WarehouseConfirmComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    }); */
  }

  getProgramming(idProgramming: string) {
    this.programmingService.getProgrammingId(Number(idProgramming)).subscribe({
      next: response => {
        this.programming = response;
      },
      error: error => {},
    });
  }

  close() {
    this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
  }
}
