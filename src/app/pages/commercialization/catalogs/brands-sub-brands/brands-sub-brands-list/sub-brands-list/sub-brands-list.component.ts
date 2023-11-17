import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IBrand,
  ISubBrands,
  ISubBrandsModel,
  IUpdateSubBrands,
  IUpdateSubBrandsModel,
} from 'src/app/core/models/ms-parametercomer/parameter';
import { ParameterBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-brands.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS2 } from '../columns';
import { SubBrandsFormComponent } from './sub-brands-form/sub-brands-form.component';

@Component({
  selector: 'app-sub-brands-list',
  templateUrl: './sub-brands-list.component.html',
  styles: [],
})
export class SubBrandsListComponent extends BasePage implements OnInit {
  status: string = 'Nueva';
  brandsSubBrands: IBrand[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  private _selectedRow: IBrand;
  @Input() get selectedRow(): IBrand {
    return this._selectedRow;
  }
  set selectedRow(value: IBrand) {
    this._selectedRow = value;
    this.getData();
  }
  brandId: string;

  constructor(
    private modalService: BsModalService,
    private brandService: ParameterBrandsService
  ) {
    super();
    this.settings.columns = COLUMNS2;
    this.settings.hideSubHeader = false;
    this.settings.actions.columnTitle = 'Acciones';
    this.settings.actions.add = false;
    this.settings.actions.edit = true;
    this.settings.actions.delete = true;
    this.settings.actions.position = 'right';
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
              case 'idSubBrand':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'subBrandDescription':
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
          this.getData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  rowsSelected(event: any) {
    const dat = event.data;
  }

  getData() {
    this.data = new LocalDataSource();
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.selectedRow) {
      if (!this.selectedRow.id) {
        this.alert('warning', 'No hay Marcas', '');
        return;
      }
      this.brandId = this.selectedRow.id;
      this.loading = true;
      this.brandService.getByBrand(this.brandId, params).subscribe({
        next: response => {
          this.brandsSubBrands = response.data;
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.data.length;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          this.alert('warning', 'No existe una submarca asociada', '');
        },
      });
    }
  }

  openFormSubBrands(IUpdateSubBrand?: IUpdateSubBrands) {
    const model: IUpdateSubBrandsModel = {
      idBrand: IUpdateSubBrand?.idBrand?.id,
      idSubBrand: IUpdateSubBrand?.idSubBrand,
      subBrandDescription: IUpdateSubBrand?.subBrandDescription,
      nbOrigin: IUpdateSubBrand?.nbOrigin,
    };
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      model,
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(SubBrandsFormComponent, modalConfig);
  }

  showDeleteAlert(idSubBrand?: ISubBrands) {
    const model: ISubBrandsModel = {
      idBrand: idSubBrand?.idBrand?.id,
      idSubBrand: idSubBrand?.idSubBrand,
    };
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar esta submarca?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(model);
      }
    });
  }

  delete(model: ISubBrandsModel) {
    this.brandService.removeSubBrand(model).subscribe({
      next: () => {
        this.getData();
        this.alert('success', 'La submarca ha sido eliminada', '');
      },
    });
  }
}
