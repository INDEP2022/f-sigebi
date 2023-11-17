import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IBrand } from 'src/app/core/models/ms-parametercomer/parameter';
import { ParameterBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-brands.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { BrandsSubBrandsFormComponent } from '../brands-sub-brands-form/brands-sub-brands-form.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-brands-sub-brands-list',
  templateUrl: './brands-sub-brands-list.component.html',
  styles: [],
})
export class BrandsSubBrandsListComponent extends BasePage implements OnInit {
  brandsSubBrands: IBrand[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  selectedRow: IBrand;

  constructor(
    private brandService: ParameterBrandsService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.add = false;
    this.settings.actions.delete = true;
    this.settings.actions.edit = true;
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
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'brandDescription':
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
          this.getDeductives();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  selectRow(event: any) {
    this.selectedRow = event;
  }

  getDeductives() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.brandService.getAll(params).subscribe({
      next: response => {
        this.brandsSubBrands = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  //Modal para crear o editar clientes penalizados
  openForm(brandsSubBrands?: IBrand) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      brandsSubBrands,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(BrandsSubBrandsFormComponent, modalConfig);
  }

  showDeleteAlert(brandsSubBrands?: IBrand) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar esta marca?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(brandsSubBrands.id);
      }
    });
  }

  delete(id: string) {
    this.brandService.remove(id).subscribe({
      next: () => {
        this.getDeductives();
        this.alert('success', 'La marca ha sido eliminada', '');
      },
      error: err => {
        this.alert(
          'warning',
          'No se puede eliminar la marca porque se encuentra registrada en otra tabla',
          ''
        );
      },
    });
  }
}
