import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { OfficesSend } from '../../valuation-request/valuation-request/valuation-request.component';
import {
  VALUATION_REQUEST_COLUMNS,
  VALUATION_REQUEST_COLUMNS_TWO,
} from './res-cancel-valuation-columns';

@Component({
  selector: 'app-res-cancel-valuation',
  templateUrl: './res-cancel-valuation.component.html',
  styles: [],
})
export class resCancelValuationComponent extends BasePage implements OnInit {
  arrayResponseOffice: any[] = [];
  form: FormGroup;
  formTwo: FormGroup;
  formDialogOne: FormGroup;
  data: LocalDataSource = new LocalDataSource();
  dataTwo: LocalDataSource = new LocalDataSource();
  offices = new DefaultSelect();
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  dateNow: Date;
  intervalId: any;
  listCitys: any;
  listKeyOffice: any;
  settingsTwo: any;
  subscribeDelete: Subscription;

  //

  constructor(private fb: FormBuilder, private serviceJobs: JobsService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...VALUATION_REQUEST_COLUMNS },
    };

    this.settingsTwo = {
      ...this.settings,
      actions: false,
      columns: { ...VALUATION_REQUEST_COLUMNS_TWO },
    };
  }

  ngOnInit() {
    this.prepareForm();
    this.actualizarHora();
    this.intervalId = setInterval(() => {
      this.actualizarHora();
    }, 1000);
  }

  //

  getOffices(event: any) {
    this.serviceJobs.getAll(event).subscribe({
      next: data => {
        this.offices = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.offices = new DefaultSelect();
      },
    });
  }
  async getsContent() {
    // this.loader.load = true;
    // if (this.event == 0) {
    //   this.event = this.form.controls['event'].value;
    // }
    // let type = await this.getType(this.event);
    // console.log(type);
    // this.tipo = type;
  }

  findDataTable(data: any) {
    let valorObjeto: any;
    valorObjeto = data;
    let body: OfficesSend = new OfficesSend();
    body.eventId = valorObjeto?.eventId;
    body.officeType = valorObjeto?.jobType;
    this.serviceJobs.postByFilters(body).subscribe({
      next: response => {
        this.arrayResponseOffice = response.data;
        this.iterableAssign(this.arrayResponseOffice);
      },
      error: error => {},
    });
  }

  actualizarHora(): void {
    this.dateNow = new Date();
  }

  iterableAssign(array: any[]) {
    for (const i of array) {
      console.log('Iterando la mamada esta: ', i?.cargo_destina);
    }
  }

  prepareForm() {
    this.form = this.fb.group({
      event: [null],
      cveService: [null],
      fol: [null],
      key: [null],
      cityCi: [null],
      dateRec: [null],
      dateEla: [null],
      remi: [null],
      dest: [null],
      office: [null],
    });
    this.formTwo = this.fb.group({
      allGood: [null],
      selectedGood: [null],
      ref: [null],
      aten: [null],
      espe: [null],
    });
    this.formDialogOne = this.fb.group({
      noti: [null],
    });
    this.subscribeDelete = this.form
      .get('office')
      .valueChanges.subscribe(value => {
        this.findDataTable(value);
      });
  }

  //

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscribeDelete.unsubscribe();
  }
}
