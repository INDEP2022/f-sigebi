import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { RegionalDelegationFormComponent } from '../regional-delegation-form/regional-delegation-form.component';
import { REGIONAL_DELEGATIONS_COLUMNS } from './regional-delegations-columns';

@Component({
  selector: 'app-regional-delegations-list',
  templateUrl: './regional-delegations-list.component.html',
  styles: [],
})
export class RegionalDelegationsListComponent
  extends BasePage
  implements OnInit
{
  regionalDelegation: IRegionalDelegation[] = [];
  data: LocalDataSource = new LocalDataSource();

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  constructor(
    private regionalDelegationService: RegionalDelegationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
        position: 'right',
      },
      columns: { ...REGIONAL_DELEGATIONS_COLUMNS },
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
                break;
              case 'status':
                searchFilter = SearchFilter.EQ;
                break;
              case 'version':
                searchFilter = SearchFilter.EQ;
                break;
              case 'zoneGeographic':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.description`;
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
          this.getRegionalDelegations();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRegionalDelegations());
  }

  getRegionalDelegations() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.regionalDelegationService.getAll(params).subscribe(
      response => {
        this.regionalDelegation = response.data;
        this.data.load(this.regionalDelegation);
        this.totalItems = response.count || 0;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  openForm(regionalDelegation?: IRegionalDelegation) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      regionalDelegation,
      callback: (next: boolean) => {
        if (next) this.getRegionalDelegations();
      },
    };
    this.modalService.show(RegionalDelegationFormComponent, modalConfig);
  }

  showDeleteAlert(reginalDelegation: IRegionalDelegation) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(reginalDelegation.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.regionalDelegationService.remove(id).subscribe({
      next: () => this.getRegionalDelegations(),
    });
  }
}
