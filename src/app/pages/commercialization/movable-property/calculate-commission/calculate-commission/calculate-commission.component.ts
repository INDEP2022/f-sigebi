import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerEvent2 } from 'src/app/core/models/ms-event/event.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import {
  IComerComCalculated,
  IComerCommissionsPerGood,
  IThirdParty,
} from 'src/app/core/models/ms-thirdparty/third-party.model';
import { ComerComCalculatedService } from 'src/app/core/services/ms-thirdparty/comer-comcalculated';
import { ComerCommissionsPerGoodService } from 'src/app/core/services/ms-thirdparty/comer-commissions-per-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ComcalculatedModalComponent } from '../comcalculated-modal/comcalculated-modal.component';
import { CommissionsModalComponent } from '../commissions-modal/commissions-modal.component';
import {
  COMCALCULATED_COLUMS,
  COMISIONESXBIEN_COLUMNS,
} from './caculate-comission-columns';

@Component({
  selector: 'app-calculate-commission',
  templateUrl: './calculate-commission.component.html',
  styles: [],
})
export class CalculateCommissionComponent extends BasePage implements OnInit {
  data: any;

  totalItems: number = 0;
  totalItems2: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  settings2;
  comerComCalculatedList: IComerComCalculated[] = [];
  comerComCalculated: IComerComCalculated;

  comerCommissionsList: IComerCommissionsPerGood[] = [];

  thirdParty: IThirdParty;
  good: IGood;
  event: IComerEvent2;

  constructor(
    private modalService: BsModalService,
    private comerComCalculatedService: ComerComCalculatedService,
    private comerCommissionsPerGoodService: ComerCommissionsPerGoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...COMCALCULATED_COLUMS },
    };

    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...COMISIONESXBIEN_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComCalculated());
  }

  getComCalculated() {
    this.loading = true;

    this.comerComCalculatedService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.comerComCalculatedList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.comerCommissionsList = [];
    this.comerComCalculated = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComPerGood(this.comerComCalculated));
  }

  openForm1(calculated?: IComerComCalculated) {
    const idT = { ...this.thirdParty };
    let config: ModalOptions = {
      initialState: {
        calculated,
        idT,
        callback: (next: boolean) => {
          if (next) this.getComCalculated();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ComcalculatedModalComponent, config);
  }

  getComPerGood(comerComCalculated: IComerComCalculated): void {
    this.loading = true;
    this.comerCommissionsPerGoodService
      .getFilter(comerComCalculated.comCalculatedId, this.params2.getValue())
      .subscribe({
        next: response => {
          console.log(response);
          this.comerCommissionsList = response.data;
          this.totalItems2 = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  openForm2(commissions?: IComerCommissionsPerGood) {
    const idEvent = { ...this.event };
    const idGood = { ...this.good };
    let config: ModalOptions = {
      initialState: {
        commissions,
        idEvent,
        idGood,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CommissionsModalComponent, config);
  }
}
