import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatFinancialInformationAttributesModalComponent } from '../cat-financial-information-attributes-modal/cat-financial-information-attributes-modal.component';
import { FINANCIAL_INFO_ATTR_COLUMNS } from './financial-information-attributes-columns';
//Models
import { IAttributesFinancialInfo } from 'src/app/core/models/catalogs/attributes-financial-info-model';
//Services
import { LocalDataSource } from 'ng2-smart-table';
import { AttributesInfoFinancialService } from 'src/app/core/services/catalogs/attributes-info-financial-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cat-financial-information-attributes',
  templateUrl: './cat-financial-information-attributes.component.html',
  styles: [],
})
export class CatFinancialInformationAttributesComponent
  extends BasePage
  implements OnInit
{
  columns: IAttributesFinancialInfo[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  attributesFinancialInfo: IAttributesFinancialInfo[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private attributesInfoFinancialService: AttributesInfoFinancialService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        add: false,
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...FINANCIAL_INFO_ATTR_COLUMNS },
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
          this.getAttributesFinancialInfo();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAttributesFinancialInfo());
  }

  getAttributesFinancialInfo() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.attributesInfoFinancialService.getAll(params).subscribe({
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

  openForm(attributesFinancialInfo?: IAttributesFinancialInfo) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      attributesFinancialInfo,
      callback: (next: boolean) => {
        if (next) this.getAttributesFinancialInfo();
      },
    };
    this.modalService.show(
      CatFinancialInformationAttributesModalComponent,
      modalConfig
    );
  }

  showDeleteAlert(attributesFinancialInfo: IAttributesFinancialInfo) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(attributesFinancialInfo.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.attributesInfoFinancialService.remove(id).subscribe({
      next: () => this.getAttributesFinancialInfo(),
    });
  }
}
