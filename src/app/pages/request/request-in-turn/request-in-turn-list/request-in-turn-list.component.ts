import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequestInTurn } from 'src/app/core/models/catalogs/request-in-turn.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { RequestInTurnSelectedComponent } from '../request-in-turn-selected/request-in-turn-selected.component';
import { REQUEST_IN_TURN_COLUMNS } from './request-in-turn-columns';

var ejemplo: IRequestInTurn[] = [
  {
    check: false,
    noRequest: '1458',
    dateRequest: '1-10-2021',
    titularName: 123,
    senderCharger: 'AMPF',
    noJob: 33,
    dateJob: 11,
    deleRegional: 22,
    state: 2,
    transfer: 2,
    transmitter: 2,
    authority: 33,
    expedient: 234,
    reception: 'Metropolital',
    subject: 'asunto',
    type: 'type',
    appliStatus: 'estado',
    contributor: 'contribuidor',
    acta: 'acta',
    ascertainment: 'averiguacion',
    cause: 'causa',
  },
  {
    check: false,
    noRequest: '1458',
    dateRequest: '1-10-2021',
    titularName: 123,
    senderCharger: 'AMPF',
    noJob: 33,
    dateJob: 11,
    deleRegional: 22,
    state: 2,
    transfer: 2,
    transmitter: 2,
    authority: 33,
    expedient: 234,
    reception: 'Metropolital',
    subject: 'asunto',
    type: 'type',
    appliStatus: 'estado',
    contributor: 'contribuidor',
    acta: 'acta',
    ascertainment: 'averiguacion',
    cause: 'causa',
  },
];

@Component({
  selector: 'app-request-in-turn-list',
  templateUrl: './request-in-turn-list.component.html',
  styles: [],
})
export class RequestInTurnListComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  paragraphs: IRequestInTurn[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());

  requestSelected: IRequestInTurn[] = [];

  constructor(private modalService: BsModalService, public fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: REQUEST_IN_TURN_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample(): void {
    this.paragraphs = ejemplo;
    //this.loading = true;
    /* this.requestService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    }); */
  }

  getSubDelegations(params: ListParams) {
    /* this.requestService.getAll(params).subscribe(data => {
      this.station = new DefaultSelect(data.data, data.count);
    }); */
  }

  openTurnRequests(requestInTurn?: IRequestInTurn[]) {
    requestInTurn = this.requestSelected;
    let config: ModalOptions = {
      initialState: {
        requestInTurn,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RequestInTurnSelectedComponent, config);
  }

  searchForm(requestFrom: ModelForm<IRequestInTurn>) {
    console.log(requestFrom.getRawValue());
  }

  onCustomAction(event: any) {
    console.log(event);
    this.requestSelected = event.selected;
    //console.log(this.requestForm.);
  }
}
