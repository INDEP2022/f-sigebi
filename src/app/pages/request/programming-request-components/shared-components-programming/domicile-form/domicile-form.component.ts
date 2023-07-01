import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
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
  constructor(
    private modalRef: BsModalRef,
    private statesService: StateOfRepublicService,
    private municipalityService: GoodsInvService
  ) {
    super();
  }

  ngOnInit(): void {
    this.showInfostate();
    this.showInfoMuncipality();
  }
  showInfostate() {
    this.paramsState.getValue()['filter.id'] = this.item.domicilio.statusKey;
    this.statesService.getAll(this.paramsState.getValue()).subscribe({
      next: response => {
        this.item.cveState = response.data[0].descCondition;
      },
      error: error => {},
    });
  }
  showInfoMuncipality() {
    this.paramsState.getValue()['filter.stateKey'] =
      this.item.domicilio.statusKey;
    this.paramsState.getValue()['filter.municipalityKey'] =
      this.item.domicilio.municipalityKey;
    this.municipalityService
      .getAllMunipalitiesByFilter(this.paramsState.getValue())
      .subscribe({
        next: response => {
          this.item.cveMunicipality = response.data[0].municipality;
        },
        error: error => {},
      });
  }

  close() {
    this.modalRef.hide();
  }
}
