/** BASE IMPORT */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { DATE_FORMAT } from 'src/app/common/constants/data-formats/date.format';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-historical-situation-goods',
  templateUrl: './historical-situation-goods.component.html',
  styleUrls: ['./historical-situation-goods.component.scss'],
})
export class HistoricalSituationGoodsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  @Input() noBien: any;
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      propertyNum: {
        title: 'No. Bien',
        sort: false,
      }, //*
      description: {
        title: 'Descripción',
        valuePrepareFunction: (cell: any, row: any) => {
          return row.good?.description;
        },
        sort: false,
      }, //*
      situation: {
        title: 'Situación',
        valuePrepareFunction: (cell: any, row: any) => {
          return row.good?.situation;
        },
        sort: false,
      }, //*
      changeDate: {
        title: 'Fec. Cambio',
        valuePrepareFunction: (cell: any, row: any) => {
          return format(new Date(row.changeDate), DATE_FORMAT);
        },
        sort: false,
      }, //*
      userChange: {
        title: 'USUARIO',
        sort: false,
      }, //*
      reasonForChange: {
        title: 'Motivo Cambio',
        sort: false,
      }, //*
      extDomProcess: {
        title: 'Proceso',
        sort: false,
      }, //*
    },
  };
  // Data table
  dataTable: any[] = [];

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private historyGoodService: HistoryGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.form.patchValue(this.noBien);
    this.getData();
    this.loading = true;
  }

  private getData() {
    let params = this.params.getValue();
    params.addFilter('propertyNum', this.noBien.noBien, SearchFilter.EQ);
    this.historyGoodService.getAllFilter(params.getParams()).subscribe({
      next: value => {
        console.log(value);
        this.dataTable = value.data;
      },
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      noBien: ['', [Validators.required]], //*
      descripcion: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], //*
    });
    this.form.get('noBien').disable();
    this.form.get('descripcion').disable();
    this.form.updateValueAndValidity();
  }

  mostrarInfo(form: FormGroup): any {
    console.log(form.value);
  }

  mostrarInfoDepositario(formDepositario: FormGroup): any {
    console.log(formDepositario.value);
  }
}
