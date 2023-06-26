import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDomicileInfo } from 'src/app/core/models/good-programming/good-programming';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IStoreStock } from 'src/app/core/models/ms-store-alias-stock/store-alias-stock.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { DomicileService } from 'src/app/core/services/catalogs/domicile.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TypeWarehouseService } from 'src/app/core/services/catalogs/type-warehouse.service';
import { StoreAliasStockService } from 'src/app/core/services/ms-store/store-alias-stock.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-domicile-form',
  templateUrl: './domicile-form.component.html',
  styles: [],
})
export class DomicileFormComponent extends BasePage implements OnInit {
  item: any;
  programmingId: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  store: IStoreStock;
  domicile: IDomicileInfo;
  regionalDelegation: string = '';
  stateOfRepublicName: string = '';
  municipalityName: string = '';
  cityName: string = '';
  localityName: string = '';
  typeWarehouseName: string = '';
  programming: Iprogramming;
  constructor(
    private modalRef: BsModalRef,
    private activatedRoute: ActivatedRoute,
    private storeService: StoreAliasStockService,
    private delegationService: RegionalDelegationService,
    private stateOfRepublicService: StateOfRepublicService,
    private municipalityService: MunicipalityService,
    private cityService: CityService,
    private localityService: LocalityService,
    private typeWarehouseService: TypeWarehouseService,
    // private programmingService: ProgrammingRequestService,
    private domicileService: DomicileService
  ) {
    super();
    this.programmingId = Number(
      this.activatedRoute.snapshot.paramMap.get('id')
    );
  }

  ngOnInit(): void {
    // this.getStateOfRepublic(idStateOfRep);
    // console.log('domi',this.domicilio)
    //     console.log('numer',this.item.domicilio.exteriorNumber)
    //     console.log('inter',this.item.domicilio.interiorNumber)
    //     console.log('stado',this.item.domicilio.code)
    //     console.log('domi',this.item.domicilio)
    //     console.log('stado',this.item.code)
  }
  // getInfoWarehouse() {
  //   this.params.getValue()['filter.idProgramming'] = this.programmingId;
  //   this.domicileService.getAll(this.params.getValue()).subscribe({
  //     next: response => {
  //       this.item = response.data[0];
  //       // const idDelegationReg = response.data[0].wildebeestDelegationregion;
  //       const idStateOfRep = response.data[0].cveState;
  //       const idMunicipality = response.data[0].cveMunicipality;
  //       // const idCity = response.data[0].idCity;
  //       const locality = response.data[0].cveLocality;
  //       // const typeWarehouse = response.data[0].tpstore;

  //       // this.getRegionalDelegation(idDelegationReg);
  //       this.getStateOfRepublic(idStateOfRep);
  //       this.getMunicipality(idMunicipality, idStateOfRep);
  //       this.getCityService(idCity);
  //       this.getLocality(idMunicipality, idStateOfRep, locality);
  //       // this.getTypeWarehouse(typeWarehouse);
  //     },
  //     error: error => {},
  //   });
  // }

  // getRegionalDelegation(idDelegation: number) {
  //   this.delegationService.getById(idDelegation).subscribe({
  //     next: response => {
  //       this.regionalDelegation = response.description;
  //     },
  //     error: error => {},
  //   });
  // }

  // getStateOfRepublic(idState: string) {
  //   this.stateOfRepublicService.getById(idState).subscribe({
  //     next: response => {
  //       this.stateOfRepublicName = response.descCondition;
  //     },
  //     error: error => {},
  //   });
  // }

  // getMunicipality(idMunicipality: string, idState: string) {
  //   const model: object = {
  //     idMunicipality: idMunicipality,
  //     stateKey: idState,
  //   };

  //   this.municipalityService.postById(model).subscribe({
  //     next: response => {
  //       this.municipalityName = response.nameMunicipality;
  //     },
  //     error: error => {},
  //   });
  // }

  // getCityService(idCity: string) {
  //   this.params.getValue()['filter.idCity'] = idCity;
  //   this.cityService.getAll(this.params.getValue()).subscribe({
  //     next: response => {
  //       this.cityName = response.data[0].nameCity;
  //     },
  //     error: error => {},
  //   });
  // }

  // getLocality(idMunicipality: string, idState: string, idLocality: string) {
  //   this.params.getValue()['filter.stateKey'] = idState;
  //   this.params.getValue()['filter.municipalityId'] = idMunicipality;
  //   this.params.getValue()['filter.id'] = idLocality;
  //   this.localityService.getAll(this.params.getValue()).subscribe({
  //     next: response => {
  //       this.localityName = response.data[0].nameLocation;
  //     },
  //     error: error => {},
  //   });
  // }

  // getTypeWarehouse(idTypeWarehouse: number) {
  //   this.typeWarehouseService.getById(idTypeWarehouse).subscribe({
  //     next: response => {
  //       this.typeWarehouseName = response.description;
  //     },
  //     error: error => {},
  //   });
  // }

  close() {
    this.modalRef.hide();
  }
}
