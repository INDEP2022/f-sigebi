import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { DomicileService } from 'src/app/core/services/catalogs/domicile.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-domicile-form',
  templateUrl: './domicile-form.component.html',
  styles: [],
})
export class DomicileFormComponent extends BasePage implements OnInit {
  item: any;
  loadingReport: boolean = false;
  nameStatus: IStateOfRepublic;
  paramsState = new BehaviorSubject<ListParams>(new ListParams());
  // params= new BehaviorSubject<ListParamsInfite>(new ListParamsInfite());
  // paramsState = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private modalRef: BsModalRef,
    private statesService: StateOfRepublicService,
    private municipalityService: GoodsInvService,
    private domicileService: DomicileService,
    private goodService: GoodService
  ) {
    super();
    console.log('ITEMENTRO', JSON.stringify(this.item));
  }

  ngOnInit(): void {
    this.showInfostate();
    this.showInfoMuncipality();
    console.log('alias', this.item.domicilio.warehouseAlias);
    // console.log('statue', this.item.cveState);
    // console.log('code', this.item.code);
    // console.log('muni', this.item.cveMunicipality);
    // console.log('vianame', this.item.viaName);
    // this.filterStatus(this.item.domicilio.statusKey);
  }

  // async filterStatus(stateKey: any) {
  //   try {
  //     const data = await this.statesService
  //       .getAll(this.paramsState.getValue())
  //       .toPromise();
  //     const descCondition = data.data.find((item: any) => item.id === stateKey);
  //     this.item.descCondition = descCondition.descCondition;

  //     const municipalityData = await this.municipalityService
  //       .getAllMunipalitiesByFilter(this.params.getValue())
  //       .toPromise();

  //     const municipality = municipalityData.data.find(
  //       (item: any) => item.municipalityKey === this.item.domicilio.municipalityKey
  //     );
  //     console.log('datax',data.data)
  //     console.log('ditemsss',this.item)
  //     console.log('municipality', municipality)
  //     console.log('itemsdsadas',this.item.municipalityKey)
  //     console.log('muni', municipalityData.data);
  //     console.log('keymuni2', this.item.domicilio.municipalityKey);
  //     this.item.municipality = municipality.municipality;
  //   } catch (error) {
  //     // Manejar el error aquí
  //   }
  showInfostate() {
    console.log('keystado', this.item.domicilio.statusKey);
    this.paramsState.getValue()['filter.id'] = this.item.domicilio.statusKey;
    // params.getValue()['filter.statekey'] = domicile.statekey;
    console.log('keystado', this.item.domicilio.statusKey);
    console.log('params', this.paramsState);
    this.statesService.getAll(this.paramsState.getValue()).subscribe({
      next: response => {
        this.item.cveState = response.data[0].descCondition;
      },
      error: error => {},
    });
  }
  showInfoMuncipality() {
    console.log('keystado', this.item.domicilio.statusKey);
    this.paramsState.getValue()['filter.stateKey'] =
      this.item.domicilio.statusKey;
    this.paramsState.getValue()['filter.municipalityKey'] =
      this.item.domicilio.municipalityKey;
    // params.getValue()['filter.statekey'] = domicile.statekey;
    console.log('keystado', this.item.domicilio.statusKey);
    console.log('params', this.paramsState);
    this.municipalityService
      .getAllMunipalitiesByFilter(this.paramsState.getValue())
      .subscribe({
        next: response => {
          this.item.cveMunicipality = response.data[0].municipality;
        },
        error: error => {},
      });
  }
  // showInfoMuncipality(domicilie){
  // const params = Lsittgnbf
  // params.getValue()['filter, municipalityKey'] = domicile.locality.id;
  // this.domicileService.getAll(params.getValue()).subscribe({
  // next: response => [
  // this.c response.name;
  // }, error: error => [
  // })

  close() {
    this.modalRef.hide();
  }
}
