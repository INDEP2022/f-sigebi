/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  dataTableAsignaNotario,
  dataTableFormalizaEscrituracion,
  dataTableTodos,
  FORMALIZACION_COLUMNS,
  tableSettingsAsignaNotario,
  tableSettingsFormalizaEscrituracion,
  tableSettingsProcedeFormalizacion,
  tableSettingsTodos,
  TABLE_SETTINGS2,
} from './table-configuration-formal-goods-estate';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerLotEvent } from 'src/app/core/models/ms-event/event.model';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { FormProcedeFormalizacionComponent } from '../form-procede-formalizacion/form-procede-formalizacion.component';
/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-formal-goods-estate',
  templateUrl: './formal-goods-estate.component.html',
  styleUrls: ['./formal-goods-estate.component.scss'],
})
export class FormalGoodsEstateComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  // ------------------ Procede Formalizacion ------------------ //
  tableSettingsProcedeFormalizacion = tableSettingsProcedeFormalizacion;
  dataTableProcedeFormalizacion: any = [];

  comerLotEvent: IComerLotEvent[] = [];
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  _dataTableProcedeFormalizacion: LocalDataSource = new LocalDataSource();
  _tableSettingsProcedeFormalizacion = { ...TABLE_SETTINGS2 };

  // ------------------ Asigna Notario ------------------ //
  tableSettingsAsignaNotario = tableSettingsAsignaNotario;
  dataTableAsignaNotario = dataTableAsignaNotario;
  _dataTableAsignaNotario: LocalDataSource = new LocalDataSource();

  // ------------------ Formaliza Escrituracion ------------------ //
  tableSettingsFormalizaEscrituracion = tableSettingsFormalizaEscrituracion;
  dataTableFormalizaEscrituracion = dataTableFormalizaEscrituracion;
  _dataTableFormalizaEscrituracion: LocalDataSource = new LocalDataSource();

  // ------------------ Todos ------------------ //
  tableSettingsTodos = tableSettingsTodos;
  dataTableTodos = dataTableTodos;
  _dataTableTodos: LocalDataSource = new LocalDataSource();

  constructor(
    private comerEventosService: ComerEventosService,
    private modalService: BsModalService
  ) {
    super();

    // ------------------ Procede Formalizacion ------------------ //
    this._tableSettingsProcedeFormalizacion.columns = FORMALIZACION_COLUMNS;
    this._tableSettingsProcedeFormalizacion.actions.delete = true;
    this._tableSettingsProcedeFormalizacion = {
      ...this._tableSettingsProcedeFormalizacion,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this._dataTableProcedeFormalizacion
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getEvents();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getEvents());

    // this.getEvents()
    // this.loading = true;
  }

  getEvents() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.comerEventosService.getAllComerLotEvent(params).subscribe(
      (response: any) => {
        let arr = [];

        this.comerLotEvent = response.data;
        for (let i = 0; i < this.comerLotEvent.length; i++) {
          this.comerLotEvent[i].processKey =
            this.comerLotEvent[i].event.processKey;
        }
        this._dataTableProcedeFormalizacion.load(this.comerLotEvent);
        this._dataTableProcedeFormalizacion.refresh();
        this.totalItems = response.count;
        this.loading = false;
        console.log('SI', response);
      },
      error => (this.loading = false)
    );
  }

  edit(data: IComerLotEvent) {
    this.openModal({ data });
  }

  openModal(context?: any) {
    const modalRef = this.modalService.show(FormProcedeFormalizacionComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    // modalRef.content.refresh.subscribe(next => {
    //   if (next) this.getLawyers();
    // });
  }
}
