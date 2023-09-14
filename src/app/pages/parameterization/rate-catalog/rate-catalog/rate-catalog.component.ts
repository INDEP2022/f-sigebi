import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IRateCatalog } from 'src/app/core/models/catalogs/rate-catalog.model';
import { ParameterBaseCatService } from 'src/app/core/services/catalogs/rate-catalog.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalRatesCatalogComponent } from '../modal-rates-catalog/modal-rates-catalog.component';
import { RATECATALOG_COLUMS } from './rate-catalog-columns';

@Component({
  selector: 'app-rate-catalog',
  templateUrl: './rate-catalog.component.html',
  styles: [],
})
export class RateCatalogComponent extends BasePage implements OnInit {
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();

  constructor(
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private rateCatalogService: ParameterBaseCatService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: {
        currency: {
          title: 'Moneda',
          sort: false,
        },
        year: {
          title: 'Año',
          sort: false,
        },
        month: {
          title: 'Mes',
          sort: false,
        },
        rate: {
          title: 'Tasa (%)',
          sort: false,
        },
      },
    };
    this.settings.columns = RATECATALOG_COLUMS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    // this.getExample();
    // this.getPagination();
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
              case 'year':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'month':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'rate':
                searchFilter = SearchFilter.EQ;
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
          this.getExample();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  openModal(context?: Partial<ModalRatesCatalogComponent>) {
    const modalRef = this.modalService.show(ModalRatesCatalogComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.getData();
        this.alert('success', 'Guardado Correctamente', '');
        this.modalRef.content.callback(true);
        this.modalRef.hide();
      }
    });
  }

  openForm(allotment?: any) {
    const modalConfig = MODAL_CONFIG;
    allotment;
    modalConfig.initialState = {
      allotment,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.modalService.show(ModalRatesCatalogComponent, modalConfig);
    //this.openModal({ allotment });
  }

  getData() {
    this.loading = true;
    // this.columns = this.data;
    // this.totalItems = this.data.length;
    this.loading = false;
  }

  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.rateCatalogService.getAll(params).subscribe({
      next: response => {
        console.log('TESDSASD', response);
        this.paragraphs = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count || 0;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  // getPagination() {
  //   this.columns = this.data;
  //   // this.totalItems = this.columns.length;
  // }

  // data = [
  //   {
  //     currency: 'Dolar',
  //     year: '2022',
  //     month: 'Enero',
  //     rate: '20 %',
  //   },
  //   {
  //     currency: 'Peso Mexicano',
  //     year: '2022',
  //     month: 'Febrero',
  //     rate: '30 %',
  //   },
  // ];

  delete(rate: IRateCatalog) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.rateCatalogService.remove(rate).subscribe({
          next: () => {
            this.getExample();
            this.alert('success', 'Tasa', 'Borrada correctamente');
          },
        });
      }
    });
  }
}
