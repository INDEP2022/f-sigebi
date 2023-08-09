import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDetailDelegation } from 'src/app/core/models/catalogs/detail-delegation.model';
import { DetailDelegationService } from 'src/app/core/services/catalogs/detail-delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DetailDelegationFormComponent } from '../detail-delegation-form/detail-delegation-form.component';
import { DETAIL_DELEGATION_COLUMNS } from './detail-delegation-columns';

@Component({
  selector: 'app-detail-delegation-list',
  templateUrl: './detail-delegation-list.component.html',
  styles: [],
})
export class DetailDelegationListComponent extends BasePage implements OnInit {
  detailDelegations: IDetailDelegation[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private detailDelegationService: DetailDelegationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DETAIL_DELEGATION_COLUMNS;
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
              case 'name':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'numberDelegation':
                searchFilter = SearchFilter.EQ;
                break;
              case 'area':
                searchFilter = SearchFilter.ILIKE;
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

          this.params.value.page = 1;

          this.getDetailDelegation();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDetailDelegation());
  }

  getDetailDelegation() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.detailDelegationService.getAll(params).subscribe({
      next: response => {
        this.detailDelegations = response.data;
        this.data.load(this.detailDelegations);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(detailDelegation?: IDetailDelegation) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      detailDelegation,
      callback: (next: boolean) => {
        if (next) this.getDetailDelegation();
      },
    };
    this.modalService.show(DetailDelegationFormComponent, modalConfig);
  }

  showDeleteAlert(detailDelegation: IDetailDelegation) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(detailDelegation.id);
      }
    });
  }

  delete(id: number) {
    this.detailDelegationService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Detalle Delegación', 'Borrado Correctamente');
        this.getDetailDelegation();
      },
      error: error => {
        this.alert(
          'warning',
          'Detalle Delegación',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
