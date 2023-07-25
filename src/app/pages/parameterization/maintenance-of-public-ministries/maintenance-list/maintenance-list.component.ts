import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MaintenanceOfPublicMinistriesComponent } from '../maintenance-of-public-ministries/maintenance-of-public-ministries.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  styles: [],
})
export class MaintenanceListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;
  dataMinPub: IListResponse<IMinpub> = {} as IListResponse<IMinpub>;
  filter = new FilterParams();
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params1 = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalRef: BsModalRef,
    private ministerService: MinPubService,
    private expedientSer: ExpedientService,
    private readonly modalService: BsModalService
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
      columns: { ...COLUMNS },
    };
    /*this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
    this.searchFilter = { field: 'description', operator: SearchFilter.ILIKE };*/
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
              case 'insideNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'outNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'zipCode':
                searchFilter = SearchFilter.EQ;
                //field = `filter.${filter.field}.description`;
                break;
              case 'cityNumber':
                searchFilter = SearchFilter.EQ;
                //field = `filter.${filter.field}.description`;
                break;
              case 'idCity':
                searchFilter = SearchFilter.EQ;
                //field = `filter.${filter.field}.description`;
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
          this.params1 = this.pageFilter(this.params1);
          this.getMinPub();
        }
      });
    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMinPub());
  }

  getMinPub() {
    this.loading = true;
    /*this.ministerService
      .getAllWithFilters(this.params.getValue().getParams())
      .subscribe({
        next: response => {
          this.dataMinPub = response;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          this.onLoadToast('error', err.error.message, '');
        },
      });*/
    let params = {
      ...this.params1.getValue(),
      ...this.columnFilters,
    };
    this.ministerService.getAll(params).subscribe({
      next: response => {
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count || 0;
        this.dataMinPub = response;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        //this.loading = false;
        //this.onLoadToast('error', err.error.message, '');
      },
    });
  }

  formDataMin(data: IMinpub) {
    this.modalRef.content.callback(true, data);
    this.modalRef.hide();
  }
  deleteMin(min: IMinpub) {
    /*this.filter.removeAllFilters();
    this.filter.addFilter('mpName', min.description, SearchFilter.EQ);
    this.filter.limit = 1;
    this.expedientSer.getAllFilter(this.filter.getParams()).subscribe({
      next: () => {
        this.onLoadToast(
          'error',
          'No puede eliminar un ministerio público que tenga relación con algún expediente',
          ''
        );
      },
      error: err => {
        if (err.status == 400) {
          this.alertQuestion(
            'warning',
            'Eliminar',
            'Desea eliminar este registro?'
          ).then(question => {
            if (question.isConfirmed) {
              this.ministerService.remove(min.id).subscribe({
                next: () => {
                  this.onLoadToast('success', 'Ha sido eliminado', '');
                  this.getMinPub();
                },
                error: err => {
                  console.log(err);

                  if (
                    err.status == 500 &&
                    err.error.message[0].includes('amparos')
                  ) {
                    this.onLoadToast(
                      'error',
                      'No puede eliminar un ministerio público que tenga relación con la tabla amparos',
                      ''
                    );
                  } else {
                    this.onLoadToast('error', err.error.message, '');
                  }
                },
              });
            }
          });
        }
      },
    });*/
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //console.log(min.id);
        this.delete(min.id);
      }
    });
  }

  openForm(minpub?: any) {
    let config: ModalOptions = {
      initialState: {
        minpub,
        callback: (next: boolean) => {
          if (next) {
            this.params1
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getMinPub());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MaintenanceOfPublicMinistriesComponent, config);
  }

  delete(id: number) {
    this.ministerService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Ministerio Publico', 'Borrado Correctamente');
        this.getMinPub();
      },
      error: error => {
        this.alert(
          'warning',
          'Ministerio Publico',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
