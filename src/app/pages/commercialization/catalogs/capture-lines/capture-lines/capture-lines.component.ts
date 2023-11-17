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
  ICaptureLinesMain,
  IDetCapturelines,
} from 'src/app/core/models/catalogs/capture-lines-main.model';
import { CapturelineService } from 'src/app/core/services/ms-capture-line/captureline.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CAPTURE_LINES_COLUMNS } from '../capture-lines-main/capture-lines-columns';
import { ExportCaptureLinesComponent } from './export-capture-lines/export-capture-lines.component';

@Component({
  selector: 'app-capture-lines',
  templateUrl: './capture-lines.component.html',
  styles: [],
})
export class CaptureLinesComponent extends BasePage implements OnInit {
  captureLinesMain: IDetCapturelines[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  private _capture: ICaptureLinesMain;
  @Input() get capture(): ICaptureLinesMain {
    return this._capture;
  }
  set capture(value: ICaptureLinesMain) {
    this._capture = value;
    this.getData();
  }
  downloading: boolean = false;
  captureLinesId: number;

  constructor(
    private modalService: BsModalService,
    private capturelineService: CapturelineService
  ) {
    super();
    this.settings.columns = CAPTURE_LINES_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.getData();
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
              case 'eventId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'pallette':
                searchFilter = SearchFilter.EQ;
                break;
              case 'captureLine':
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
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.capture) {
      if (!this.capture.eventId) {
        this.alert('warning', 'El cliente no tiene detalle de eventos', '');
        return;
      }
      this.captureLinesId = this.capture.eventId;
      this.loading = true;
      this.capturelineService
        .getAllDetCaptureLines(this.captureLinesId, params)
        .subscribe({
          next: response => {
            this.captureLinesMain = response.data;
            this.data.load(response.data);
            this.data.refresh();
            this.totalItems = response.count;
            this.loading = false;
          },
          error: error => {
            //this.loading = false;
            this.loading = false;
            this.data.load([]);
            this.data.refresh();
            this.totalItems = 0;
            //this.alert('warning', 'Cliente no Tiene Detalle de Eventos', '');
          },
        });
    }
  }

  //Exportar Detalle de Eventos
  CaptureLines() {
    console.log(this.capture);
    if (!this.capture) {
      this.alert(
        'warning',
        'Selecciona primero un evento para exportar sus detalles',
        ''
      );
    } else {
      const captureId = this.capture.eventId;
      const modalConfig = MODAL_CONFIG;
      modalConfig.initialState = {
        captureId,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      };
      this.modalService.show(ExportCaptureLinesComponent, modalConfig);
    }
  }

  /*getData() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.capture) {
      if (!this.capture.eventId) {
        this.alert('warning', 'Cliente no Tiene Detalle de Eventos', '');
        return;
      }
      this.captureLinesId = this.capture.eventId;
      this.loading = true;
      this.data = new LocalDataSource();
      this.capturelineService
        .getAllDetCaptureLines(this.captureLinesId, params)
        .subscribe({
          next: response => {
            this.captureLinesMain = response.data;
            this.data.load(response.data);
            this.data.refresh();
            this.totalItems = response.count;
            this.loading = false;
          },
          error: error => {
            // this.loading = false;
            // this.data = new LocalDataSource();
            // this.totalItems = 0;
            this.loading = false;
            this.data.load([]);
            this.data.refresh();
            this.totalItems = 0;
            this.alert('warning', 'Cliente no Tiene Detalle de Eventos', '');
          },
        });
    }
  }*/
}
