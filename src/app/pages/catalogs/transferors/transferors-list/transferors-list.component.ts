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
//import { transferorsState } from '../transferors-detail/'

@Component({
  selector: 'app-transferors-list',
  templateUrl: './transferors-list.component.html',
  styles: [],
})
export class TransferorsListComponent extends BasePage implements OnInit {
  columns: ITransferente[] = [];
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  columnFilters1: any = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  stateList: IState[] = [];
  transferents: ITransferente;

  loading1 = this.loading;
  loading2 = this.loading;
  loading3 = this.loading;

  settings2: any;

  rowSelected: boolean = false;
  selectedRow: any = null;

  constructor(
    private modalService: BsModalService,
    private transferenteSaeService: TransferentesSaeService
  ) {
    super();
    this.settings.columns = TRANSFERENT_STATE_COLUMNS;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
    this.settings.actions.edit = false;
    this.settings.hideSubHeader = false;

    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: true,
        add: false,

        position: 'right',
      },
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
          this.params = this.pageFilter(this.params);
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
    this.filterData(idTrans.id);
    /*this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getStateByTransferent(idTrans.id));*/
  }

  filterData(id: string | number) {
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'transferent':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'state':
                field = `filter.${filter.field}.descCondition`;
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          this.getStateByTransferent(id);
        }
      });
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getStateByTransferent(id));
  }

  getStateByTransferent(id?: number | string) {
    this.loading2 = true;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters1,
    };
    const idTrans = { ...this.transferents };

    this.transferenteSaeService
      .getStateByTransferent(idTrans.id, params)
      .subscribe({
        next: response => {
          this.totalItems2 = response.count || 0;

          this.data1.load(response.data);
          this.data1.refresh();
          this.loading2 = false;

          /*this.stateList = response.data;
          this.totalItems2 = response.count;
          this.loading2 = false;*/
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
          if (next) this.getStateByTransferent(idTrans.id);
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
  showDelet(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delet(data);
      }
    });
  }
  delet(data: any) {
    this.transferenteSaeService
      .remove(data.idTransferee, data.stateKey)
      .subscribe({
        next: () => {
          this.alert(
            'success',
            'Estado por transferente',
            'Borrado Correctamente'
          );
          this.getStateByTransferent();
        },
        error: err => {
          this.alert(
            'warning',
            'Transferentes por estado',
            'No se puede eliminar el objeto debido a una relación con otra tabla.'
          );
        },
      });
  }
}
