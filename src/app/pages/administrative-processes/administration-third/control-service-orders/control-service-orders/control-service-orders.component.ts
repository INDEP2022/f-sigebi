import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { convertFormatDate } from 'src/app/common/helpers/helpers';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { CONTROLSERVICEORDERS_COLUMNS } from './control-service-orders-columns';

@Component({
  selector: 'app-control-service-orders',
  templateUrl: './control-service-orders.component.html',
  styles: [],
})
export class ControlServiceOrdersComponent extends BasePage implements OnInit {
  serviceOrdersForm: ModelForm<any>;
  data1: any[] = [];
  local2: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  dataload: boolean = false;
  columnFilters: any = [];
  tableSource = new LocalDataSource();
  iddelegation: any;
  maxDate: Date = new Date();

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...CONTROLSERVICEORDERS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.serviceOrdersForm = this.fb.group({
      delegation: [null, Validators.required],
      process: [null, Validators.required],
      dateInitial: [null, Validators.required],
      datefinal: [null, Validators.required],
    });
  }

  validsearch() {
    if (!this.formValid()) {
      return;
    } else {
      this.search();
      this.dataload = true;
    }
  }

  formValid(): boolean {
    const values = this.serviceOrdersForm.value;
    const isValid = Object.keys(values).some(key => Boolean(values[key]));
    if (!isValid) {
      this.onLoadToast('warning', 'Alerta', 'Llenar un Campo para Continuar');
    }
    return isValid;
  }

  search(listParams?: ListParams) {
    console.log('Lista de Parametros: ', listParams);
    console.log(this.serviceOrdersForm.value);
    console.log('Columnas: ', this.columnFilters);
    this.tableSource.load([]);
    this.clearTable();
    this.loading = true;
    let params = this.generateParams(listParams).getParams();
    let paramsObject = Object.fromEntries(new URLSearchParams(params));
    let paramsEn = {
      ...paramsObject,
      ...this.columnFilters,
    };
  }

  clearTable(): void {
    if (this.tableSource.count() > 0) {
      this.tableSource.empty().then(() => {
        this.tableSource.load([]);
        this.tableSource.refresh();
        this.totalItems = 0;
        this.dataload = false;
      });
      this.totalItems = 0;
    }
  }

  generateParams(listParams?: ListParams): FilterParams {
    const filters = new FilterParams();
    const { delegation, dateInitial, datefinal, process } =
      this.serviceOrdersForm.value;

    if (this.iddelegation) {
      filters.addFilter('reference', this.iddelegation, SearchFilter.EQ);
    }
    if (dateInitial || datefinal) {
      const initDate = dateInitial || datefinal;
      const finalDate = datefinal || dateInitial;
      filters.addFilter(
        'movDate',
        `${convertFormatDate(initDate)},${convertFormatDate(finalDate)}`,
        SearchFilter.BTW
      );
    }
    if (process) {
      filters.addFilter('ifdsc', process, SearchFilter.LIKE);
    }

    if (listParams) {
      filters.page = listParams.page || 1;
      filters.limit = listParams.limit || 10;
    }
    console.log('Filtro: ', filters);

    return filters;
  }

  seleccionarDelegation(event: IDelegation) {
    console.log('event ', event);
    this.iddelegation = event.id;
    console.log('delegation ', event, 'this.iddelegation ', this.iddelegation);
  }
}
