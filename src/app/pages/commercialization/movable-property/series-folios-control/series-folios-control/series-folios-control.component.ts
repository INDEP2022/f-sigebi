import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { EventXSerie } from 'src/app/core/models/ms-event/event.model';
import {
  InvoiceFolio,
  InvoiceFolioSeparate,
} from 'src/app/core/models/ms-invoicefolio/invoicefolio.model';
import { ComerEventosXSerieService } from 'src/app/core/services/ms-event/comer-eventosxserie.service';
import { InvoicefolioService } from 'src/app/core/services/ms-invoicefolio/invoicefolio.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SeriesEventModalComponent } from '../series-event-modal/series-event-modal.component';
import { SeriesFoliosControlModalComponent } from '../series-folios-control-modal/series-folios-control-modal.component';
import { SeriesFoliosSeparateModalComponent } from '../series-foliseparate-modal/series-folioseparate-modal.component';
import { SERIES_FOLIOS_CONTROL_COLUMNS } from './series-folios-control-columns';
import { SERIES_FOLIOS_CONTROL_SEPARATE_PAGES_COLUMNS } from './series-folios-control-separate-pages-columns';
import { SERIES_FOLIOS_CONTROL_TYPE_EVENT_COLUMNS } from './series-folios-control-type-event-columns';

@Component({
  selector: 'app-series-folios-control',
  templateUrl: './series-folios-control.component.html',
  styles: [],
})
export class SeriesFoliosControlComponent extends BasePage implements OnInit {
  @ViewChild('content') private folios: ElementRef<HTMLElement>;

  form: FormGroup = new FormGroup([]);

  //nuevo
  data: InvoiceFolio[] = [];
  data3: EventXSerie[] = [];
  data2: InvoiceFolioSeparate[] = [];
  totalItems: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;
  loading2: boolean = false;
  loading3: boolean = false;
  isSelect: InvoiceFolio = {} as InvoiceFolio;
  settings1 = {
    ...this.settings,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      edit: true,
      delete: true,
      add: false,
    },
    columns: { ...SERIES_FOLIOS_CONTROL_TYPE_EVENT_COLUMNS },
  };
  settings2 = {
    ...this.settings,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      edit: true,
      delete: true,
      add: false,
    },
    columns: { ...SERIES_FOLIOS_CONTROL_SEPARATE_PAGES_COLUMNS },
  };

  //filtrado columna
  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  dataFilter2: LocalDataSource = new LocalDataSource();
  columnFilters2: any = [];
  paramsList2 = new BehaviorSubject<ListParams>(new ListParams());
  dataFilter3: LocalDataSource = new LocalDataSource();
  columnFilters3: any = [];
  paramsList3 = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private invoiceService: InvoicefolioService,
    private eventService: ComerEventosXSerieService,
    private datePipe: DatePipe
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        edit: true,
        delete: true,
        add: false,
      },
      columns: { ...SERIES_FOLIOS_CONTROL_COLUMNS },
    };
    this.settings.hideSubHeader = false;
    this.settings1.hideSubHeader = false;
    this.settings2.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.dataFilter
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              folioinvoiceId: () => (searchFilter = SearchFilter.EQ),
              delegationNumber: () => (searchFilter = SearchFilter.EQ),
              catDelegation: () => (searchFilter = SearchFilter.ILIKE),
              series: () => (searchFilter = SearchFilter.ILIKE),
              invoiceStart: () => (searchFilter = SearchFilter.EQ),
              invoiceEnd: () => (searchFilter = SearchFilter.EQ),
              validity: () => (searchFilter = SearchFilter.EQ),
              type: () => (searchFilter = SearchFilter.ILIKE),
              statusfactId: () => (searchFilter = SearchFilter.ILIKE),
              totalFolios: () => (searchFilter = SearchFilter.EQ),
              availableFolios: () => (searchFilter = SearchFilter.EQ),
              usedFolios: () => (searchFilter = SearchFilter.EQ),
              recordDate: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              if (filter.field == 'validity' || filter.field == 'recordDate') {
                this.columnFilters[
                  field
                ] = `${searchFilter}:${this.datePipe.transform(
                  filter.search,
                  'yyyy-MM-dd'
                )}`;
              } else {
                this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              }
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          this.getInvoiceFolio();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems > 0) this.getInvoiceFolio();
    });

    this.dataFilter2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            if (filter.field == 'comerF') {
              field = `filter.recordNumber`;
            } else {
              field = `filter.${filter.field}`;
            }

            const search: any = {
              invoice: () => (searchFilter = SearchFilter.EQ),
              pulledapart: () => (searchFilter = SearchFilter.ILIKE),
              comerF: () => (searchFilter = SearchFilter.ILIKE),
              recordDate: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              if (filter.field == 'recordDate') {
                this.columnFilters2[
                  field
                ] = `${searchFilter}:${this.datePipe.transform(
                  filter.search,
                  'yyyy-MM-dd'
                )}`;
              } else {
                this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
              }
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.paramsList2 = this.pageFilter(this.paramsList2);
          this.getInvoiceFolioSeparate();
        }
      });

    this.paramsList2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems2 > 0) this.getInvoiceFolioSeparate();
    });

    this.dataFilter3
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              idTpevent: () => (searchFilter = SearchFilter.EQ),
              commentary: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters3[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters3[field];
            }
          });
          this.paramsList3 = this.pageFilter(this.paramsList3);
          this.getEventXSerie();
        }
      });

    this.paramsList3.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems3 > 0) this.getEventXSerie();
    });
  }

  getInvoiceFolio() {
    this.loading = true;

    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.invoiceService
      .getAll(params /*this.filter.getValue().getParams()*/)
      .subscribe({
        next: resp => {
          this.loading = false;
          resp.data.map(folio => {
            folio.totalFolios =
              Number(folio.availableFolios ?? 0) +
              Number(folio.usedFolios ?? 0);
            folio.validity = folio.validity
              ? folio.validity.split('-').reverse().join('/')
              : '';
            folio.recordDate = folio.recordDate
              ? folio.recordDate.split('-').reverse().join('/')
              : '';
          });
          this.data = resp.data;

          this.dataFilter.load(resp.data);
          this.dataFilter.refresh();

          this.totalItems = resp.count;
        },
        error: err => {
          this.loading = false;
          this.data = [];
          this.dataFilter.load([]);
          this.dataFilter.refresh();

          this.totalItems = 0;
          this.alert('error', 'Error', err.error.message);
        },
      });
  }

  getInvoiceFolioSeparate(folio?: InvoiceFolio) {
    if (folio && folio.folioinvoiceId) {
      this.isSelect = folio;
      this.columnFilters2[
        'filter.folioinvoiceId'
      ] = `${SearchFilter.EQ}:${folio.folioinvoiceId}`;
    }
    this.loading2 = true;
    let params = {
      ...this.paramsList2.getValue(),
      ...this.columnFilters2,
    };
    this.invoiceService
      .getAllFolioSepate(params /*this.filter2.getValue().getParams()*/)
      .subscribe({
        next: resp => {
          this.loading2 = false;
          resp.data.map(folio => {
            folio.recordDate = folio.recordDate
              ? folio.recordDate.split('-').reverse().join('/')
              : '';
          });
          this.data2 = resp.data ?? [];
          this.totalItems2 = resp.count ?? 0;
          this.dataFilter2.load(resp.data);
          this.dataFilter2.refresh();
          this.folios.nativeElement.scrollIntoView({ block: 'center' });
        },
        error: err => {
          this.loading2 = false;
          this.data2 = [];
          this.dataFilter2.load([]);
          this.dataFilter2.refresh();
          this.totalItems2 = 0;
          if (err.status == 400) {
            if (!this.isSelect.folioinvoiceId) {
              this.alert(
                'error',
                'Error',
                `Seleccione un folio para consultar Folios Apartados`
              );
            } else {
              this.alert(
                'warning',
                'Folios Apartados',
                `No se encontraron registros para este Id Folio: ${this.isSelect.folioinvoiceId}`
              );
            }
          }
        },
      });
  }

  getEventXSerie(folio?: InvoiceFolio) {
    if (folio && folio.folioinvoiceId) {
      this.isSelect = folio;
      this.columnFilters3[
        'filter.idInvoiceFolio'
      ] = `${SearchFilter.EQ}:${folio.folioinvoiceId}`;
    }
    this.loading3 = true;
    let params = {
      ...this.paramsList3.getValue(),
      ...this.columnFilters3,
    };
    this.eventService.getAllEvents(params).subscribe({
      next: resp => {
        this.loading3 = false;
        this.data3 = resp.data ?? [];
        this.totalItems3 = resp.count ?? 0;
        this.dataFilter3.load(resp.data);
        this.dataFilter3.refresh();
        this.folios.nativeElement.scrollIntoView({ block: 'center' });
      },
      error: err => {
        this.loading3 = false;
        this.data3 = [];
        this.totalItems3 = 0;
        this.dataFilter3.load([]);
        this.dataFilter3.refresh();
        if (err.status == 400) {
          if (!this.isSelect.folioinvoiceId) {
            this.alert(
              'error',
              'Error',
              `Seleccione un folio para consultar Tipos de Eventos por Serie`
            );
          } else {
            this.alert(
              'warning',
              'Eventos por Serie',
              `No se encontraron registros para este Id Folio: ${this.isSelect.folioinvoiceId}`
            );
          }
        }
      },
    });
  }

  openModal(context?: InvoiceFolio) {
    let config: ModalOptions = {
      initialState: {
        allotment: context,
        callback: (next: boolean) => {
          if (next) {
            this.getInvoiceFolio();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SeriesFoliosControlModalComponent, config);
  }

  openForm(allotment?: any) {
    this.openModal(allotment);
  }

  openModalSeparate(context?: InvoiceFolio) {
    let config: ModalOptions = {
      initialState: {
        allotment: context,
        folio: this.isSelect,
        callback: (next: boolean, newData: InvoiceFolio) => {
          if (next) {
            this.isSelect = newData;
            this.getInvoiceFolio();
            this.getInvoiceFolioSeparate(this.isSelect);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SeriesFoliosSeparateModalComponent, config);
  }

  openFormSeparate(allotment?: any) {
    if (this.isSelect.folioinvoiceId) {
      this.openModalSeparate(allotment);
    } else {
      this.alert(
        'warning',
        'Creación',
        'Consulte un Folio para crear un Folio Apartado',
        ''
      );
    }
  }

  openModalEvent(context?: InvoiceFolio) {
    let config: ModalOptions = {
      initialState: {
        allotment: context,
        folio: this.isSelect,
        callback: (next: boolean) => {
          if (next) {
            this.getEventXSerie(this.isSelect);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SeriesEventModalComponent, config);
  }

  openFormEvent(allotment?: any) {
    if (this.isSelect.folioinvoiceId) {
      this.openModalEvent(allotment);
    } else {
      this.alert(
        'warning',
        'Creación',
        'Consulte un Folio para crear un Tipo de Evento por Serie',
        ''
      );
    }
  }

  remove(type: string, data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este registro?'
    ).then(answ => {
      if (answ.isConfirmed) {
        switch (type) {
          case 'folio':
            this.invoiceService
              .deleteFolio(Number(data.folioinvoiceId))
              .subscribe({
                next: () => {
                  this.alert('success', 'Folio', 'Eliminado Correctamente');
                  this.getInvoiceFolio();
                },
                error: err => {
                  if (err.status == 500) {
                    if (
                      err.error.message.includes(
                        'violates foreign key constraint'
                      )
                    ) {
                      this.alert(
                        'error',
                        'Error',
                        'Debe eliminar las relaciones de este folio'
                      );
                      return;
                    }
                  }
                  this.alert('error', 'Error', err.error.message);
                },
              });
            break;
          case 'serie':
            this.eventService
              .remove({
                idInvoiceFolio: data.idInvoiceFolio,
                idTpevent: Number(data.idTpevent.id),
              })
              .subscribe({
                next: () => {
                  this.alert(
                    'success',
                    'Tipo de Evento por Serie',
                    'Eliminado Correctamente'
                  );
                  this.getEventXSerie();
                },
                error: err => {
                  if (err.status == 500) {
                    if (
                      err.error.message.includes(
                        'violates foreign key constraint'
                      )
                    ) {
                      this.alert(
                        'error',
                        'Error',
                        'Debe eliminar las relaciones de esta serie'
                      );
                      return;
                    }
                  }
                  this.alert('error', 'Error', err.error.message);
                },
              });
            break;
          case 'apartado':
            this.invoiceService
              .deleteFolioSeparate({
                folioinvoiceId: Number(data.folioinvoiceId),
                series: data.series,
                invoice: Number(data.invoice),
              })
              .subscribe({
                next: () => {
                  this.alert(
                    'success',
                    'Folio Apartado',
                    'Eliminado Correctamente'
                  );
                  this.getInvoiceFolioSeparate();
                },
                error: err => {
                  if (err.status == 500) {
                    if (
                      err.error.message.includes(
                        'violates foreign key constraint'
                      )
                    ) {
                      this.alert(
                        'error',
                        'Error',
                        'Debe eliminar las relaciones de este folio apartado'
                      );
                      return;
                    }
                  }
                  this.alert('error', 'Error', err.error.message);
                },
              });
            break;
        }
      }
    });
  }
}
