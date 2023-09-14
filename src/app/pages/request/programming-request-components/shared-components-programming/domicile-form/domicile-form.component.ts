import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDomicile } from 'src/app/core/models/catalogs/domicile';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
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
  loadingReport: boolean = false;
  nameStatus: IStateOfRepublic;
  paramsState = new BehaviorSubject<ListParams>(new ListParams());
  domicileInfo: IDomicile;
  stateName: string = '';
  municipalityName: string = '';
  constructor(
    private modalRef: BsModalRef,
    private statesService: StateOfRepublicService,
    private municipalityService: GoodsInvService,
    private domicilieService: DomicileService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getDomicilieInfo();
    //this.showInfostate();
  }

  getDomicilieInfo() {
    this.domicilieService.getById(this.item.addressId).subscribe({
      next: response => {
        this.domicileInfo = response;
        this.getStateInfo(this.domicileInfo?.cveState);
        this.showInfoMuncipality();
      },
      error: error => {},
    });
  }

  getStateInfo(state: number) {
    this.statesService.getById(state).subscribe({
      next: response => {
        this.stateName = response.descCondition;
      },
      error: error => {},
    });
  }
  /*showInfostate() {
    this.paramsState.getValue()['filter.id'] = this.item.domicilio.statusKey;
    this.statesService.getAll(this.paramsState.getValue()).subscribe({
      next: response => {
        this.item.cveState = response.data[0].descCondition;
      },
      error: error => {},
    });
  } */

  showInfoMuncipality() {
    this.paramsState.getValue()['filter.stateKey'] = this.domicileInfo.cveState;
    this.paramsState.getValue()['filter.municipalityKey'] =
      this.domicileInfo.cveMunicipality;
    this.municipalityService
      .getAllMunipalitiesByFilter(this.paramsState.getValue())
      .subscribe({
        next: response => {
          this.municipalityName = response.data[0].municipality;
        },
        error: error => {},
      });
  }

  close() {
    this.modalRef.hide();
  }
}
