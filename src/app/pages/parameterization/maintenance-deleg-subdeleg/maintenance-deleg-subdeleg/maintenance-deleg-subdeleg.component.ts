import { Component, OnInit, Renderer2 } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { MaintenanceDelegSubdelegModalComponent } from '../maintenance-deleg-subdeleg-modal/maintenance-deleg-subdeleg-modal.component';
import {
  DELEGATION_COLUMNS,
  SUBDELEGATION_COLUMNS,
} from './maintenance-deleg-sub-columns';
//models
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
//services
import { LocalDataSource } from 'ng2-smart-table';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SubDelegationService } from 'src/app/core/services/maintenance-delegations/subdelegation.service';
import Swal from 'sweetalert2';
import { DelegationModalComponent } from '../delegation-modal/delegation-modal.component';

@Component({
  selector: 'app-maintenance-deleg-subdeleg',
  templateUrl: './maintenance-deleg-subdeleg.component.html',
  styles: [],
})
export class MaintenanceDelegSubdelegComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  totalItems2: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();

  delegationList: IDelegation[] = [];
  subDelegationList: ISubdelegation[] = [];
  delegations: IDelegation;
  dataId: any;

  columnFilters: any = [];
  columnFilters1: any = [];

  settings2;

  loading1 = this.loading;
  loading2 = this.loading;

  constructor(
    private modalService: BsModalService,
    private delegationService: DelegationService,
    private subDelegationService: SubDelegationService,
    private r2: Renderer2
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
      columns: { ...DELEGATION_COLUMNS },
    };

    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...SUBDELEGATION_COLUMNS },
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
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getDelegationAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDelegationAll());
  }

  //Trae lista de delegaciones
  getDelegationAll() {
    this.loading1 = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.delegationService.getAll2(params).subscribe({
      next: response => {
        this.delegationList = response.data;
        this.data.load(response.data);
        this.totalItems = response.count;
        this.loading1 = false;
      },
      error: error => {
        this.loading1 = false;
        console.log(error);
      },
    });
  }

  //Abre formulario para actualizar delegaciones
  openForm(delegationM?: IDelegation) {
    let config: ModalOptions = {
      initialState: {
        delegationM,
        callback: (next: boolean) => {
          if (next) this.getDelegationAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DelegationModalComponent, config);
  }

  //Msj de alerta para borrar Delegaciones
  showDeleteAlert(delegation?: IDelegation) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(delegation.id, delegation.etapaEdo);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  //método para borrar delegaciones
  delete(id: number, etapaEdo: number) {
    this.delegationService.remove2(id, etapaEdo).subscribe({
      next: () => this.getDelegationAll(),
    });
  }

  //Método para seleccionar un registro de Delegaciones
  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.subDelegationList = [];
    this.delegations = event.data;

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
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
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
          this.getSubDelegations(this.delegations);
        }
      });
    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getSubDelegations(this.delegations);
    });
  }

  //Con el id seleccionado de delegaciones se obtienen sus subdelegaciones
  getSubDelegations(delegation: IDelegation) {
    this.loading = true;
    /*if (delegation) {
      this.params2.getValue()['filter.delegationNumber'] = delegation.id;
    }*/
    let params1 = {
      ...this.params2.getValue(),
      ...this.columnFilters1,
    };
    this.subDelegationService.getById(delegation.id, params1).subscribe({
      next: response => {
        if (response.data.length > 0) {
          this.subDelegationList = response.data;
          this.data1.load(response.data);
          this.data1.refresh();
          this.totalItems2 = response.count;
          this.loading = false;
        } else {
          this.subDelegationList = [];
          this.totalItems2 = 0;
          this.loading = false;
        }
      },
      error: error => {
        this.loading = false;
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems2 = 0;
      },
    });
  }

  //Abre formulario de subdelegaciones para actualizar
  openForm2(subDelegation?: ISubdelegation) {
    console.log(subDelegation);
    const idD = { ...this.delegations };
    let delegation = this.delegations;
    let config: ModalOptions = {
      initialState: {
        subDelegation,
        delegation,
        idD,
        callback: (next: boolean) => {
          if (next) this.getSubDelegations(idD);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MaintenanceDelegSubdelegModalComponent, config);
  }

  //Msj de alerta para borrar SubDelegaciones
  showDeleteAlert2(subDelegation?: ISubdelegation) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete2(subDelegation);
      }
    });
  }

  //método para borrar Sub Delegaciones
  delete2(subDelegation?: ISubdelegation) {
    const idDelegation = { ...this.delegations };
    const formData: Object = {
      id: Number(subDelegation.id),
      phaseEdo: Number(subDelegation.phaseEdo),
      delegationNumber: Number(idDelegation.id),
    };
    console.log('datos a eliminar:', formData);
    this.subDelegationService.remove(formData).subscribe({
      next: () => {
        this.getSubDelegations(idDelegation);
        this.alert('success', 'Subdelegacion', 'Borrado Correctamente');
      },
      error: err =>
        this.alert(
          'warning',
          'No se puede eliminar',
          'Contactar con administrador'
        ),
    });
  }
}
