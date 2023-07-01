import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_DICTUMS } from '../../abandonments-declaration-trades/abandonments-declaration-trades/columns';
import { JuridicalFileUpdateService } from '../../file-data-update/services/juridical-file-update.service';

@Component({
  selector: 'app-listdictums',
  templateUrl: './listdictums.component.html',
  styles: [],
})
export class ListdictumsComponent extends BasePage implements OnInit {
  string_PTRN: `[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]*'; [a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]`;
  @Output() dataText = new EventEmitter<any>();
  dataEdit: any;
  noVolante_: any;
  noExpediente_: any;
  form: FormGroup = new FormGroup({});
  settings1 = { ...this.settings };
  data1: any = [];
  dictumSeleccionada: any;
  constructor(
    private datePipe: DatePipe,
    private modalRef: BsModalRef,
    public fileUpdateService: JuridicalFileUpdateService
  ) {
    super();
    this.settings1 = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS_DICTUMS },
    };
  }

  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  ngOnInit(): void {
    this.params
      .getValue()
      .addFilter('wheelNumber', this.noVolante_, SearchFilter.EQ);
    this.params
      .getValue()
      .addFilter('expedientNumber', this.noExpediente_, SearchFilter.EQ);
    this.params
      .getValue()
      .addFilter('typeDict', 'DESTRUCCION', SearchFilter.EQ);
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => this.checkDictum(),
    });
  }

  async checkDictum() {
    this.loading = true;
    this.fileUpdateService
      .getDictation(this.params.getValue().getParams())
      .subscribe({
        next: data => {
          let result = data.data.map((item: any) => {
            item['dateDicta'] = this.datePipe.transform(
              item.dictDate,
              'dd/MM/yyyy'
            );
          });

          this.data1 = data.data;
          this.totalItems = data.count;

          this.loading = false;
        },
        error: error => {
          this.data1 = [];
          this.loading = false;
          console.log('ERR', error.error.message);
        },
      });
  }

  selectProceedings(event: any) {
    console.log('EVENT', event);
    this.dictumSeleccionada = event.data;
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    const data = {
      data: this.dictumSeleccionada,
    };

    this.loading = false;
    // this.refresh.emit(true);
    this.dataText.emit(data);
    this.modalRef.hide();
  }
}
