import { Component, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { ReceptionTicketsService } from 'src/app/core/services/reception/reception-tickets.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { EReceiptType } from '../models/eReceiptType';
import { ReceiptGenerationDataService } from '../services/receipt-generation-data.service';
import { COLUMNS, COLUMNS1 } from './columns';

@Component({
  selector: 'app-receipt-table-programings',
  templateUrl: './receipt-table-programings.component.html',
  styleUrls: ['./receipt-table-programings.component.scss'],
})
export class ReceiptTableProgramingsComponent extends BasePageWidhtDinamicFiltersExtra<any> {
  @Input() id_programacion: string;
  @Input() folio: string;
  @Input() type: string;
  settings2: any;
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  data1: LocalDataSource = new LocalDataSource();
  // pageSizeOptions = [5, 10, 20, 25];
  // limit: FormControl = new FormControl(5);
  constructor(
    private dataService: ReceiptGenerationDataService,
    private receptionTicketsService: ReceptionTicketsService,
    private receptionGoodService: ReceptionGoodService
  ) {
    super();
    this.service = this.receptionTicketsService;
    // this.params.value.limit = 5;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...COLUMNS,
      },
      // rowClassFunction: (row: any) => {
      //   return row.data.notSelect ? 'notSelect' : '';
      // },
    };
    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...COLUMNS1,
      },
    };
    this.dataService.refreshTableProgrammings
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.getData();
            this.data1.load([]);
            this.data1.refresh();
          }
        },
      });
    this.dataService.refreshAll.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        if (response) {
          this.data1.load([]);
          this.data1.refresh();
        }
      },
    });
  }
  get typeReceiptSelected() {
    return this.dataService.typeReceiptSelected;
  }

  override extraOperationsGetData() {
    if (this.typeReceiptSelected === EReceiptType.Recibos) {
      this.dataService.recibos = this.totalItems;
    }
    if (this.typeReceiptSelected === EReceiptType.Resguardo) {
      this.dataService.resguardo = this.totalItems;
    }
    if (this.typeReceiptSelected === EReceiptType.Almacen) {
      this.dataService.almacen = this.totalItems;
    }
  }

  override getParams() {
    // debugger;
    let newColumnFilters = this.columnFilters;
    if (this.id_programacion) {
      newColumnFilters['filter.id_programacion'] =
        SearchFilter.EQ + ':' + this.id_programacion;
    }
    if (this.typeReceiptSelected) {
      newColumnFilters['filter.tipo_recibo'] =
        SearchFilter.EQ + ':' + this.typeReceiptSelected;
    }
    newColumnFilters['filter.estatus_recibo'] = SearchFilter.EQ + ':ABIERTO';
    // if (this.folio) {
    //   newColumnFilters['filter.folio'] = this.folio;
    // }
    return {
      folio: this.folio,
      params: {
        ...this.params.getValue(),
        ...newColumnFilters,
      },
    };
  }

  selectGoodstickets(data: any, params?: ListParams) {
    this.loading = true;
    console.log(data);
    let datos = {
      programmingId: data.data.id_programacion,
      actId: data.data.id_acta,
      ticketId: data.data.id_recibo,
      typeTicket: data.data.tipo_recibo,
    };
    console.log(datos);
    this.receptionGoodService.createQueryGoodsTickets(datos, params).subscribe({
      next: resp => {
        console.log(resp);
        this.data1.load(resp.data);
        this.data1.refresh();
        this.totalItems1 = resp.count;
        this.loading = false;
      },
      error: eror => {
        this.data1.load([]);
        this.data1.refresh();
        this.alert(
          'warning',
          'Generación de Recibos',
          'No se encontraron Bienes'
        );
        this.loading = false;
      },
    });
  }
}
