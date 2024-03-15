import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AVALUOS_RECH, BIENES_RECH } from './form-load-appraisals-modal-colum';

@Component({
  selector: 'app-form-load-appraisals-modal',
  templateUrl: './form-load-appraisals-modal.component.html',
  styles: [],
})
export class FormLoadAppraisalsModalComponent
  extends BasePage
  implements OnInit
{
  settings2 = { ...this.settings, actions: false };
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  data2: LocalDataSource = new LocalDataSource();
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  proceso: string;
  rechazadosBienes: any = [];
  rechazadosAvaluo: any = [];

  reBienes: any = [];
  reAvaluos: any = [];

  dataBien: boolean = false;
  dataAvaluo: boolean = false;

  rechazo: boolean = false;

  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: true,
      actions: false,
      columns: { ...BIENES_RECH },
    };
    this.settings2 = {
      ...this.settings2,
      hideSubHeader: true,
      actions: false,
      columns: { ...AVALUOS_RECH },
    };
  }

  ngOnInit(): void {
    if (this.rechazo && this.reBienes && this.reAvaluos) {
      this.getGoodApraisals();
    } else if (this.rechazo) {
      this.getGoodApraisalsNull();
    } else {
      if (this.proceso == 'V') {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getAllAppraisals());
      } else if (
        this.proceso == 'I' ||
        this.proceso == 'U' ||
        this.proceso == 'A'
      ) {
      }
    }
  }

  getAllAppraisals() {
    if (this.rechazadosBienes) {
      this.loader.load = false;
      this.dataBien = true;
      console.log(this.rechazadosBienes);
      this.data.load(this.rechazadosBienes);
      this.data.refresh();
      this.totalItems = this.rechazadosBienes.length;
    } else {
      this.dataBien = false;
      this.data.load([]);
      this.data.refresh();
    }
  }

  getGoodApraisalsNull() {
    this.dataBien = true;
    this.data.load([]);
    this.data.refresh();
    this.totalItems = 0;
    this.dataAvaluo = true;
    this.data2.load([]);
    this.data2.refresh();
    this.totalItems2 = 0;
  }

  getGoodApraisals() {
    this.dataBien = true;
    this.data.load(this.reBienes);
    this.data.refresh();
    this.totalItems = this.reBienes.length;
    this.dataAvaluo = true;
    this.data2.load(this.reAvaluos);
    this.data2.refresh();
    this.totalItems = this.reAvaluos.length;
  }

  close() {
    this.modalRef.hide();
    this.getGoodApraisalsNull();
    //this.dataBien = false;
    //this.dataAvaluo = false;
  }
}
