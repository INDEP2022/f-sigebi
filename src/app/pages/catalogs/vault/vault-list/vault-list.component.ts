import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ISafe } from '../../../../core/models/catalogs/safe.model';
import { SafeService } from '../../../../core/services/catalogs/safe.service';
import { VaultDetailComponent } from '../vault-detail/vault-detail.component';
import { VAULT_COLUMNS } from './vault-columns';

@Component({
  selector: 'app-vault-list',
  templateUrl: './vault-list.component.html',
  styles: [],
})
export class VaultListComponent extends BasePage implements OnInit {
  vaults: ISafe[] = [];
  values: ISafe;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private safeService: SafeService,
    private modalService: BsModalService,
    private securityService: SecurityService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...VAULT_COLUMNS },
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
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'idSafe':
                searchFilter = SearchFilter.EQ;
                break;
              case 'managerDetail':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'cityDetail':
                field = `filter.${filter.field}.nameCity`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'stateDetail':
                field = `filter.${filter.field}.descCondition`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'municipalityDetail':
                field = `filter.${filter.field}.nameMunicipality`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'localityDetail':
                field = `filter.${filter.field}.nameLocation`;
                searchFilter = SearchFilter.ILIKE;
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
          this.getVaults();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getVaults());
  }

  getVaults() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.safeService.getAll1(params).subscribe({
      next: response => {
        //this.getManager(response);
        this.totalItems = response.count;
        this.data.load(response.data);
        //console.log(this.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }
  /*async getManager(response: any): Promise<void> {
    for (let i = 0; i < response.data.length; i++) {
      const params = new ListParams();
      params['filter.user'] = `$eq:${response.data[i].manager}`;
      this.securityService.getAllUsersTracker(params).subscribe({
        next: resp => {
          response.data[i].managerDetail = resp.data[0].name;
          if (i == response.data.length - 1) {
            this.vaults = response.data;
            this.data.load(response.data);
            this.data.refresh();
            this.loading = false;
          }
        },
        error: erro => {
          if (i == response.data.length - 1) {
            this.vaults = response.data;
            this.data.load(response.data);
            this.data.refresh();
            this.loading = false;
          }
        },
      });
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }*/

  openForm(vault?: ISafe) {
    const modalConfig = MODAL_CONFIG;
    const valueState = { ...this.values };
    const valueCity = { ...this.values };
    const valueMunicipality = { ...this.values };
    const valueLocality = { ...this.values };
    modalConfig.initialState = {
      vault,
      valueCity,
      valueState,
      valueMunicipality,
      valueLocality,
      callback: (next: boolean) => {
        if (next) this.getVaults();
      },
    };
    this.modalService.show(VaultDetailComponent, modalConfig);
  }

  showDeleteAlert(vaults: ISafe) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(vaults.idSafe);
        //Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.safeService.remove2(id).subscribe({
      next: () => {
        this.getVaults();
        this.alert('success', 'Bóveda', 'Borrada Correctamente');
      },
    });
  }
}
