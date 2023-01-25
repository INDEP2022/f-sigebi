import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITables } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { ITvalTable5 } from 'src/app/core/models/catalogs/tval-Table5.model';
import { DinamicTablesService } from 'src/app/core/services/catalogs/dinamic-tables.service';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AdditionalValuesModalComponent } from '../additional-values-modal/additional-values-modal.component';
import {
  ADDITIONALVALUES_COLUMNS,
  TVALTABLA5_COLUMNS,
} from './additional-values-columns';

@Component({
  selector: 'app-additional-values',
  templateUrl: './additional-values.component.html',
  styles: [],
})
export class AdditionalValuesComponent extends BasePage implements OnInit {
  valuesList: ITables[] = [];
  tvalTableList: ITvalTable5[] = [];
  values: ITables;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  settings2 = { ...this.settings };
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private valuesService: DinamicTablesService,
    private tvalTableService: TvalTable5Service
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: ADDITIONALVALUES_COLUMNS,
    };
    this.settings2.columns = TVALTABLA5_COLUMNS;
  }
  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getValuesAll());
  }
  getValuesAll() {
    this.loading = true;

    this.valuesService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.valuesList = response.data;
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
    this.tvalTableList = [];
    this.values = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.gettvalTable(this.values));
  }
  gettvalTable(values: ITables) {
    this.loading = true;
    this.tvalTableService
      .getById4(values.name, this.params2.getValue())
      .subscribe({
        next: response => {
          console.log(response);
          this.tvalTableList = response.data;
          this.totalItems2 = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }
  openForm(tvalTable?: ITvalTable5) {
    console.log(tvalTable);
    let value = this.values;
    let config: ModalOptions = {
      initialState: {
        tvalTable,
        value,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AdditionalValuesModalComponent, config);
  }
}
