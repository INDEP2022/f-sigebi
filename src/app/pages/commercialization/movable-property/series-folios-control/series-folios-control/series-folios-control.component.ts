import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
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
  filter = new BehaviorSubject<FilterParams>(new FilterParams());
  filter2 = new BehaviorSubject<FilterParams>(new FilterParams());
  filter3 = new BehaviorSubject<FilterParams>(new FilterParams());

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
      delete: false,
    },
    columns: { ...SERIES_FOLIOS_CONTROL_TYPE_EVENT_COLUMNS },
  };
  settings2 = {
    ...this.settings,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      edit: true,
      delete: false,
    },
    columns: { ...SERIES_FOLIOS_CONTROL_SEPARATE_PAGES_COLUMNS },
  };
  constructor(
    private modalService: BsModalService,
    private invoiceService: InvoicefolioService,
    private eventService: ComerEventosXSerieService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        edit: true,
        delete: false,
      },
      columns: { ...SERIES_FOLIOS_CONTROL_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.filter.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        if (this.totalItems > 0) this.getInvoiceFolio();
      },
    });

    this.filter2.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        if (this.totalItems2 > 0) this.getInvoiceFolioSeparate();
      },
    });

    this.filter3.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        if (this.totalItems3 > 0) this.getEventXSerie();
      },
    });
  }

  getInvoiceFolio() {
    this.loading = true;
    this.invoiceService.getAll(this.filter.getValue().getParams()).subscribe({
      next: resp => {
        this.loading = false;
        resp.data.map(folio => {
          folio.totalFolios =
            Number(folio.availableFolios ?? 0) + Number(folio.usedFolios ?? 0);
          folio.validity = folio.validity
            ? folio.validity.split('-').reverse().join('/')
            : '';
          folio.recordDate = folio.recordDate
            ? folio.recordDate.split('-').reverse().join('/')
            : '';
        });
        this.data = resp.data;
        this.totalItems = resp.count;
      },
      error: err => {
        this.loading = false;
        this.data = [];
        this.totalItems = 0;
        this.alert('error', 'Error', err.error.message);
      },
    });
  }

  getInvoiceFolioSeparate(folio?: InvoiceFolio) {
    if (folio && folio.folioinvoiceId) {
      this.isSelect = folio;
      this.filter2.getValue().removeAllFilters();
      this.filter2.getValue().page = 1;
      this.filter2
        .getValue()
        .addFilter('folioinvoiceId', folio.folioinvoiceId, SearchFilter.EQ);
    }
    this.loading2 = true;
    this.invoiceService
      .getAllFolioSepate(this.filter2.getValue().getParams())
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
          this.folios.nativeElement.scrollIntoView({ block: 'center' });
        },
        error: err => {
          this.loading2 = false;
          this.data2 = [];
          this.totalItems2 = 0;
          if (err.status == 400) {
            this.alert(
              'error',
              'Error',
              `No se encontraron Folios Apartados para este Id Folio: ${this.isSelect.folioinvoiceId}`
            );
          }
        },
      });
  }

  getEventXSerie(folio?: InvoiceFolio) {
    if (folio && folio.folioinvoiceId) {
      this.isSelect = folio;
      this.filter3.getValue().removeAllFilters();
      this.filter3.getValue().page = 1;
      this.filter3
        .getValue()
        .addFilter('idInvoiceFolio', folio.folioinvoiceId, SearchFilter.EQ);
    }
    this.loading3 = true;
    this.eventService
      .getAllEvents(this.filter3.getValue().getParams())
      .subscribe({
        next: resp => {
          this.loading3 = false;
          this.data3 = resp.data ?? [];
          this.totalItems3 = resp.count ?? 0;
          this.folios.nativeElement.scrollIntoView({ block: 'center' });
        },
        error: err => {
          this.loading3 = false;
          this.data3 = [];
          this.totalItems3 = 0;
          if (err.status == 400) {
            this.alert(
              'error',
              'Error',
              `No se encontraron Tipos de Eventos por Serie para este Id Folio: ${this.isSelect.folioinvoiceId}`
            );
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
            this.filter.getValue().removeAllFilters();
            this.filter.getValue().page = 1;
            this.filter.getValue().limit = 10;
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
            this.filter2.getValue().removeAllFilters();
            this.filter2.getValue().page = 1;
            this.filter2.getValue().limit = 10;
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
            this.filter3.getValue().removeAllFilters();
            this.filter3.getValue().page = 1;
            this.filter3.getValue().limit = 10;
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
}
