import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IDepositaryAppointments_custom } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AppointmentsService } from '../services/appointments.service';
import { COLUMNS_DATA } from './columns';

@Component({
  selector: 'app-list-data-appintment',
  templateUrl: './list-data.component.html',
  styles: [],
})
export class ListDataAppointmentComponent extends BasePage implements OnInit {
  @Input() plain = false;

  //Declaraciones para ocupar filtrado
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  @Input() noBien: number = null;

  constructor(
    private modalRef: BsModalRef,
    private docService: DocumentsService,
    private appointmentsService: AppointmentsService
  ) {
    super();
    this.settings.hideSubHeader = true;
    this.settings.columns = COLUMNS_DATA;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
    this.settings.actions.edit = false;
    // this.settings.hideSubHeader = false;
    // this.dataDocs.count = 0;
  }

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.paramsList);
      if (this.paramsList) {
        //observador para el paginado
        this.paramsList
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAppointments());
      }
    }, 300);
  }

  formData(doc: IDepositaryAppointments_custom) {
    this.modalRef.content.callback(true, doc);
    this.modalRef.hide();
  }

  getAppointments() {
    this.loading = true;
    const params = new ListParams();
    params['filter.numberGood'] = '$eq:' + this.noBien;
    // params['filter.numberGood'] = this.noBien;
    params.limit = this.paramsList.value.limit;
    params.page = this.paramsList.value.page;
    console.log(params);

    this.appointmentsService.getDataDepositaryAppointment(params).subscribe({
      next: resp => {
        console.log(resp);

        this.totalItems = resp.count;
        this.data.load(resp.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.loading = false;
        this.totalItems = 0;
        this.data.load([]);
        this.data.refresh();
      },
    });
  }

  close() {
    this.modalRef.content.callback(false, null);
    this.modalRef.hide();
  }
}
