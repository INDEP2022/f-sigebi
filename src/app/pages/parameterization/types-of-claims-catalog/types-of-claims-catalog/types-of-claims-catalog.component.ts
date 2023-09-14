import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITypeSiniesters } from 'src/app/core/models/catalogs/types-of-claims.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { TypesOfClaimsService } from '../../../../core/services/catalogs/types-of-claims.service';
import { ModalTypeOfClaimsComponent } from '../modal-type-of-claims/modal-type-of-claims.component';
import { SINIESTER_COLUMNS } from './columns';
@Component({
  selector: 'app-types-of-claims-catalog',
  templateUrl: './types-of-claims-catalog.component.html',
  styles: [],
})
export class TypesOfClaimsCatalogComponent extends BasePage implements OnInit {
  siniester: ITypeSiniesters[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();

  constructor(
    private modalService: BsModalService,
    private claimServices: TypesOfClaimsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        add: false,
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: SINIESTER_COLUMNS,
      hideSubHeader: false,
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
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'flag':
                searchFilter = SearchFilter.EQ;
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
          this.getClaims();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getClaims());
  }

  getClaims() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.claimServices.getAll(params).subscribe({
      next: response => {
        this.siniester = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(claims?: ITypeSiniesters) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      claims,
      callback: (next: boolean) => {
        if (next) this.getClaims();
      },
    };
    this.modalService.show(ModalTypeOfClaimsComponent, modalConfig);
  }

  showDeleteAlert(claims: ITypeSiniesters) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(claims.id);
      }
    });
  }

  delete(id: any) {
    this.claimServices.remove(id).subscribe({
      next: () => {
        this.getClaims(), this.alert('success', 'Tipo Siniestros', 'Borrado');
      },
      error: err => {
        this.alert(
          'warning',
          'Sub-tipo',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
