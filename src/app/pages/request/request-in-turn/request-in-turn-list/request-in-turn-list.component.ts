import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequestInTurn } from 'src/app/core/models/catalogs/request-in-turn.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { IListResponse } from '../../../../core/interfaces/list-response.interface';
import { IRequest } from '../../../../core/models/requests/request.model';
import { RegionalDelegationService } from '../../../../core/services/catalogs/regional-delegation.service';
import { RequestService } from '../../../../core/services/requests/request.service';
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
    transfer: 28,
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
  paragraphs = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());

  requestSelected: IRequestInTurn[] = [];

  requestService = inject(RequestService);
  regionalDelegacionService = inject(RegionalDelegationService);
  listRequest: IRequest;
  listTable: any[] = [];

  constructor(private modalService: BsModalService, public fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: REQUEST_IN_TURN_COLUMNS,
    };
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
          if (next) this.getRequest();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RequestInTurnSelectedComponent, config);
  }

  searchForm(requestFrom: ModelForm<any>) {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRequest());
  }

  getRequest(): void {
    let params = new ListParams();
    this.requestService
      .getAll(params)
      .subscribe((data: IListResponse<IRequest>) => {
        this.totalItems = data.count;
        console.log(data.data);

        for (let i = 0; i < data.data.length; i++) {
          let register = data.data[i];
          this.listRequest = register;

          this.listTable.push(this.listRequest);

          this.regionalDelegacionService
            .getById(register.regionalDelegationId)
            .subscribe((data: any) => {
              //console.log(data)
              console.log('regi', data.data);
            });
        }
        this.paragraphs.load(this.listTable);
        console.log(this.paragraphs['data']);
        this.paragraphs.refresh();
      });
  }

  getresponse(id: any) {
    this.regionalDelegacionService.getById(id).subscribe((data: any) => {
      //console.log(data)
      console.log('regi', data.data);
    });
  }

  onCustomAction(event: any) {
    console.log(event);
    this.requestSelected = event.selected;
    //console.log(this.requestForm.);
  }
}
