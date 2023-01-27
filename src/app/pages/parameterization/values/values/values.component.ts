import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITables } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { ITvaltable1 } from 'src/app/core/models/catalogs/tvaltable-model';
import { DinamicTablesService } from 'src/app/core/services/catalogs/dinamic-tables.service';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ValuesModalComponent } from '../values-modal/values-modal.component';
import { TTABLAS_COLUMNS, TVALTABLA1_COLUMNS } from './values-columns';

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styles: [],
})
export class ValuesComponent extends BasePage implements OnInit {
  valuesList: ITables[] = [];
  tvalTableList: ITvaltable1[] = [];
  values: ITables;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  settings2 = { ...this.settings };
  constructor(
    private modalService: BsModalService,
    private valuesService: DinamicTablesService,
    private tvalTableService: TvalTable1Service
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: TTABLAS_COLUMNS,
    };
    this.settings2.columns = TVALTABLA1_COLUMNS;
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
  openForm(tvalTable?: ITvaltable1) {
    if (this.values) {
      console.log(tvalTable);
      let value = this.values;
      let config: ModalOptions = {
        initialState: {
          tvalTable,
          value,
          callback: (next: boolean) => {
            if (next) {
              this.totalItems2 = 0;
              this.tvalTableList = [];
              this.getValuesAll();
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ValuesModalComponent, config);
    } else {
      this.onLoadToast(
        'warning',
        'advertencia',
        'Se debe seleccionar una Tabla logica'
      );
    }
  }
}
