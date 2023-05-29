import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { ISafe } from '../../../../core/models/catalogs/safe.model';
import { SafeService } from '../../../../core/services/catalogs/safe.service';
import { VaultDetailComponent } from '../vault-detail/vault-detail.component';
import { VAULT_COLUMNS } from './vault-columns';
import { LocalDataSource } from 'ng2-smart-table';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';

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
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
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
    this.safeService.getAll2(params).subscribe(
      response => {
        this.vaults = response.data;
        this.getManager();
        this.totalItems = response.count;
      },
      error => (this.loading = false)
    );
  }
  async getManager(): Promise<void> {
    for (let i = 0; i < this.vaults.length; i++) {
      const params = new ListParams();
      params['filter.user'] = `$eq:${this.vaults[i].manager}`;
      this.securityService.getAllUsersTracker(params).subscribe({
        next: resp => {
          this.vaults[i].managerDetail = resp.data[0].name;
          if (i == this.vaults.length - 1) {
            this.data.load(this.vaults);
            this.data.refresh();
            this.loading = false;
          }
        },
        error: erro => console.log(this.loading = false),
      });
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
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
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(vaults.idSafe);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.safeService.remove2(id).subscribe({
      next: () => this.getVaults(),
    });
  }
}
