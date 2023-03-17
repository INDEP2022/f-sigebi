import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IState,
  IStateByTransferent,
} from 'src/app/core/models/catalogs/state-model';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { TransferentesSaeService } from 'src/app/core/services/catalogs/transferentes-sae.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { StateModalComponent } from '../state-modal/state-modal.component';
import { TransferorsDetailComponent } from '../transferors-detail/transferors-detail.component';
import { STATE_COLUMS, TRANSFERENT_STATE_COLUMNS } from './columns';

@Component({
  selector: 'app-transferors-list',
  templateUrl: './transferors-list.component.html',
  styles: [],
})
export class TransferorsListComponent extends BasePage implements OnInit {
  columns: ITransferente[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  stateList: IState[] = [];
  transferents: ITransferente;

  loading1 = this.loading;
  loading2 = this.loading;
  loading3 = this.loading;

  settings2;

  rowSelected: boolean = false;
  selectedRow: any = null;

  constructor(
    private modalService: BsModalService,
    private transferenteSaeService: TransferentesSaeService
  ) {
    super();
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      /*actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },*/
      columns: { ...TRANSFERENT_STATE_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      hideSubHeader: true,
      actions: false,
      columns: { ...STATE_COLUMS },
    };
  }

  //Inicia integrando los filtros a las tablas
  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'city'
              ? (field = `filter.${filter.field}.nameCity`)
              : (field = `filter.${filter.field}`);
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getTransferents();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTransferents());
  }

  //Tabla de transferentes
  getTransferents(id?: number) {
    this.loading1 = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.transferenteSaeService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;

        this.data.load(this.columns);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  //Modal del formulario para actualizar un transferente
  openForm(transferorsState?: ITransferente) {
    let config: ModalOptions = {
      initialState: {
        transferorsState,
        callback: (next: boolean) => {
          if (next) this.getTransferents();
          console.log('cerrando');
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TransferorsDetailComponent, config);
  }

  //Selecciona fila de tabla de transferente para ver los estados
  rowsSelected(event: any) {
    const idTrans = { ...this.transferents };
    this.totalItems2 = 0;
    this.stateList = [];
    this.transferents = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getStateByTransferent(idTrans.id));
  }

  getStateByTransferent(id?: number) {
    this.loading2 = true;
    const idTrans = { ...this.transferents };
    this.transferenteSaeService
      .getStateByTransferent(idTrans.id, this.params2.getValue())
      .subscribe({
        next: response => {
          this.stateList = response.data;
          this.totalItems2 = response.count;
          this.loading2 = false;
        },
        error: error => (this.showNullRegister(), (this.loading = false)),
      });
  }

  //Modal del formulario para actualizar un estado
  openForm2(stateByTransferent?: IStateByTransferent) {
    const idTrans = { ...this.transferents };
    let transferentsI = this.transferents;
    let config: ModalOptions = {
      initialState: {
        stateByTransferent,
        transferentsI,
        idTrans,
        callback: (next: boolean) => {
          if (next) this.getTransferents(idTrans.id);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(StateModalComponent, config);
  }

  //Msj de que no existe estado de transferente
  showNullRegister() {
    this.alertQuestion(
      'warning',
      'Transferente sin Estado',
      '¿Desea agregarlos ahora?'
    ).then(question => {
      if (question.isConfirmed) {
        this.openForm2();
      }
    });
  }

  //Muestra información de la fila seleccionada de Transferentes
  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  resetScreen() {
    this.rowSelected = false;
  }
}
