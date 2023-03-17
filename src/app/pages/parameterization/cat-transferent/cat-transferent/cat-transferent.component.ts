import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatTransferentModalComponent } from '../cat-transferent-modal/cat-transferent-modal.component';
import {
  AUTHORITY_COLUMNS,
  STATION_COLUMNS,
  TRANSFERENT_COLUMNS,
} from './transferent-columns';
//Models
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
//Services
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IAuthority2 } from 'src/app/core/models/catalogs/authority.model';
import { IStation2 } from 'src/app/core/models/catalogs/station.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import Swal from 'sweetalert2';
import { CatAuthorityModalComponent } from '../cat-authority-modal/cat-authority-modal.component';
import { CatStationModalComponent } from '../cat-station-modal/cat-station-modal.component';

@Component({
  selector: 'app-cat-transferent',
  templateUrl: './cat-transferent.component.html',
  styles: [],
})
export class CatTransferentComponent extends BasePage implements OnInit {
  columns: ITransferente[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  transferentList: ITransferente[] = [];
  transferents: ITransferente;

  stationList: IStation2[] = [];
  stations: IStation2;

  authorityList: IAuthority2[] = [];
  authoritys: IAuthority2;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  totalItems3: number = 0;
  params3 = new BehaviorSubject<ListParams>(new ListParams());

  settings2;
  settings3;

  loading1 = this.loading;
  loading2 = this.loading;
  loading3 = this.loading;

  rowSelected: boolean = false;
  selectedRow: any = null;

  rowSelected2: boolean = false;
  selectedRow2: any = null;

  constructor(
    private modalService: BsModalService,
    private transferenteService: TransferenteService,
    private datePipe: DatePipe,
    private stationService: StationService,
    private authorityService: AuthorityService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...TRANSFERENT_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      hideSubHeader: true,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...STATION_COLUMNS },
    };

    this.settings3 = {
      ...this.settings,
      hideSubHeader: true,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...AUTHORITY_COLUMNS },
    };
  }

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

  //Trae lista de los transferentes
  getTransferents() {
    this.loading1 = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.transferenteService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;

        this.data.load(this.columns);
        this.data.refresh();
        this.loading1 = false;
      },
      error: error => (this.loading1 = false),
    });
  }

  //Modal para editar transferentes
  openForm(transferent?: ITransferente) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      transferent,
      callback: (next: boolean) => {
        if (next) this.getTransferents();
      },
    };
    this.modalService.show(CatTransferentModalComponent, modalConfig);
  }

  //Msj de alerta para borrar transferente
  showDeleteAlert(transferent?: ITransferente) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(transferent.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  //método para borrar transferente
  delete(id: number) {
    this.transferenteService.remove(id).subscribe({
      next: () => this.getTransferents(),
    });
  }

  //Muestra información de la fila seleccionada de Transferentes
  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  //Selecciona fila de tabla de transferente
  rowsSelected(event: any) {
    const idTrans = { ...this.transferents };
    this.totalItems2 = 0;
    this.stationList = [];
    this.transferents = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getStationByTransferent(idTrans.id));
  }

  //trae las emisoras de un transferente seleccionado
  getStationByTransferent(id?: number) {
    this.loading2 = true;
    const idTrans = { ...this.transferents };
    this.stationService
      .getStationByTransferent(idTrans.id, this.params2.getValue())
      .subscribe({
        next: response => {
          this.stationList = response.data;
          this.totalItems2 = response.count;
          this.loading2 = false;
        },
        error: error => (this.showNullRegister1(), (this.loading2 = false)),
      });
  }

  //Modal para editar las emisoras
  openForm2(station?: IStation2) {
    const idTrans = { ...this.transferents };
    let config: ModalOptions = {
      initialState: {
        station,
        idTrans,
        callback: (next: boolean) => {
          console.log('cerrando');
          if (next) this.getStationByTransferent(idTrans.id);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CatStationModalComponent, config);
  }

  //msj de alerta al borrar emisora
  showDeleteAlert2(station?: IStation2) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete2(station.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  //método para borrar emisora
  delete2(id: number) {
    this.stationService.remove(id).subscribe({
      next: () => this.getStationByTransferent(),
    });
  }

  //Selecciona fila de tabla de emisoras
  rowsSelected2(event: any) {
    const idEmi = { ...this.stations };
    this.totalItems3 = 0;
    this.authorityList = [];
    this.stations = event.data;
    this.params3
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAuthorityByTransferent(idEmi.id));
  }

  //Muestra información de la fila seleccionada de Emisoras
  selectRow2(row?: any) {
    this.selectedRow2 = row;
    this.rowSelected2 = true;
  }

  //Trae lista de autoridades por transferente
  getAuthorityByTransferent(id?: number) {
    this.loading3 = true;
    const idEmi = { ...this.stations };
    const idTrans = { ...this.transferents };
    this.authorityService
      .getAuthorityByTransferent(idEmi.id, idTrans.id, this.params3.getValue())
      .subscribe({
        next: response => {
          this.authorityList = response.data;
          this.totalItems3 = response.count;
          this.loading3 = false;
        },
        error: error => (this.showNullRegister2(), (this.loading3 = false)),
      });
  }

  // modal para editar autoridades
  openForm3(authority?: IAuthority2) {
    const idAuth = { ...this.stations };
    let config: ModalOptions = {
      initialState: {
        authority,
        idAuth,
        callback: (next: boolean) => {
          if (next) this.getAuthorityByTransferent(idAuth.id);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CatAuthorityModalComponent, config);
  }

  //msj de alerta para borrar autoridades
  showDeleteAlert3(authority?: IAuthority2) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete3(authority.idAuthority, authority);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  //Método para borrar las autoridades
  delete3(id?: number, authority?: IAuthority2) {
    this.authorityService.remove2(id, authority).subscribe({
      next: () => this.getAuthorityByTransferent(),
    });
  }

  //Msj de que no existe emisora del transferente seleccionado
  showNullRegister1() {
    this.alertQuestion(
      'warning',
      'Transferente sin emisoras',
      '¿Desea agregarlas ahora?'
    ).then(question => {
      if (question.isConfirmed) {
        this.openForm2();
      }
    });
  }

  //Msj de que no existe autoridades de la emisora seleccionada
  showNullRegister2() {
    this.alertQuestion(
      'warning',
      'Emisora sin Autoridades',
      '¿Desea agregarlos ahora?'
    ).then(question => {
      if (question.isConfirmed) {
        this.openForm3();
      }
    });
  }

  resetScreen() {
    this.rowSelected = false;
    this.rowSelected2 = false;
  }
}
