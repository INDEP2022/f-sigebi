import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalGoodForDonationComponent } from '../modal-good-for-donation/modal-good-for-donation.component';
import { COLUMNS_1 } from './columns';

@Component({
  selector: 'app-filters-of-goods-for-donation',
  templateUrl: './filters-of-goods-for-donation.component.html',
  styles: [],
})
export class FiltersOfGoodsForDonationComponent
  extends BasePage
  implements OnInit
{
  columns: any[] = [];
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  searchFilter: SearchBarFilter;
  columnFilters: any = [];

  constructor(
    private modalService: BsModalService,
    private donationServ: DonationService,
    private router: Router
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
      columns: { ...COLUMNS_1 },
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
              case 'registryNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'status':
                field = `filter.${filter.field}.description`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'noLabel':
                searchFilter = SearchFilter.EQ;
                break;
              case 'tag':
                field = `filter.${filter.field}.description`;
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
          this.getPagination();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPagination());
  }

  openForm(allotment?: any) {
    let config: ModalOptions = {
      initialState: {
        allotment,
        callback: (next: boolean) => {
          if (next) this.getPagination();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalGoodForDonationComponent, config);
  }

  getPagination(params?: ListParams) {
    this.loading = true;

    let newParams = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.donationServ.getAll(newParams).subscribe({
      next: response => {
        console.log('response', response);
        /*if (response.data.length > 0) {
          response.data.map(donation => {
            donation.statusDesc = donation.status.description;
            donation.tagId = donation.tag.id;
            donation.tagDesc = donation.tag.description;
          });
          this.loading = false;
        }*/
        if (response.count == 0) {
          this.data.load([]);
        } else {
          this.data.load(response.data);
        }
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

  deleteDonation(event: string) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.donationServ.remove(event).subscribe({
          next: () => {
            this.alert(
              'success',
              'Filtro de Bienes para Donación',
              'Borrado  Correctamente'
            );
            this.getPagination();
          },
          error: err => {
            this.alert(
              'warning',
              'FILTROS DE BIENES PARA DONACIÓN',
              'No se puede eliminar el objeto debido a una relación con otra tabla.'
            );
            this.onLoadToast('error', err.error.message, '');
          },
        });
      }
    });
  }

  back() {
    this.router.navigate([
      `/pages/final-destination-process/donation-process/export-goods-donation`,
    ]);
  }
}
