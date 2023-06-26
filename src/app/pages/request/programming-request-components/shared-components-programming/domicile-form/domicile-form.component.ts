import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  ListParams,
  ListParamsInfite,
} from 'src/app/common/repository/interfaces/list-params';
import { DomicileService } from 'src/app/core/services/catalogs/domicile.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-domicile-form',
  templateUrl: './domicile-form.component.html',
  styles: [],
})
export class DomicileFormComponent extends BasePage implements OnInit {
  item: any;
  nameStatus: any;
  params: ListParams | string;
  paramsState = new BehaviorSubject<ListParams>(new ListParamsInfite());
  constructor(
    private modalRef: BsModalRef,
    private statesService: StateOfRepublicService,
    private municipalityService: GoodsInvService,
    private domicileService: DomicileService
  ) {
    super();
    console.log('ITEMENTRO', JSON.stringify(this.item));
  }

  ngOnInit(): void {
    //     console.log('numer',this.item.domicilio.exteriorNumber)
    //     console.log('inter',this.item.domicilio.interiorNumber)
    console.log('stado', this.item.domicilio.statusKey);
    console.log('keymuni', this.item.municipalityKey);
    //     console.log('domi',this.item.domicilio)
    //     console.log('stado',this.item.code)
    this.filterStatus(this.item.domicilio.statusKey);
  }

  //  nameStatus:any;
  //   filterStatus(stateKey:any){

  //     this.item.domicilio.statusKey = this.statesService
  //     .getAll(this.paramsState.getValue())
  //     .subscribe(data =>{
  //       console.log('itemsx', stateKey)
  //       console.log('itemzasasasa', this.item.domicilio.stateKey)
  //       console.log('data show', JSON.stringify(data.data.find((items:any)=>items.id === this.item.domicilio.statusKey)))
  //       this.nameStatus = data.data.find((items:any)=>items.id === stateKey);
  //       // data.stateCode.descCondition === item.domicilio.statusKey
  //     } );
  //   }

  async filterStatus(stateKey: any) {
    try {
      const data = await this.statesService
        .getAll(this.paramsState.getValue())
        .toPromise();
      // console.log('itemsx', stateKey);
      // console.log('itemzasasasa', this.item.domicilio.statusKey);
      // console.log('datax',data.data)
      // console.log('data show', JSON.stringify(data.data.find((item: any) => item.id === stateKey)));
      const descCondition = data.data.find((item: any) => item.id === stateKey);
      // this.nameStatus = data.data.find((item: any) => item.id === stateKey);
      this.item.descCondition = descCondition.descCondition;
      // console.log('itemnombre', this.item)
      // data.stateCode.descCondition === item.domicilio.statusKey
      const municipalityData = await this.municipalityService
        .getAllMunipalitiesByFilter(this.params)
        .toPromise();

      const municipality = municipalityData.data.find(
        (item: any) => item.municipalityKey === this.item.municipalityId
      );
      console.log('muni', municipalityData.data);
      console.log('keymuni', this.item.municipalityKey);
      this.item.municipality = municipality.municipality;
    } catch (error) {
      // Manejar el error aquí
    }

    // this.municipalityService.getAllMunipalitiesByFilter(this.params.);
  }

  filterMuni() {}

  close() {
    this.modalRef.hide();
  }
}
