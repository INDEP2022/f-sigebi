/*import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IDetCapturelines } from 'src/app/core/models/catalogs/capture-lines-main.model';
import { CapturelineService } from 'src/app/core/services/ms-capture-line/captureline.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CAPTURE_LINES_COLUMNS } from '../../capture-lines-main/capture-lines-columns';

@Component({
  selector: 'app-export-capture-lines',
  templateUrl: './export-capture-lines.component.html',
  styles: [],
})
export class ExportCaptureLinesComponent extends BasePage implements OnInit {
  title: string = 'Detalle de Captura';
  captureLinesMain: IDetCapturelines[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  edit: boolean = false;
  captureLinesId: number;
  captureId: number;

  constructor(
    private capturelineService: CapturelineService,
    private excelService: ExcelService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings.columns = CAPTURE_LINES_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions = false;
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

  //Tabla con todos los eventos para exportar
  getData() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.capturelineService
      .getAllDetCaptureLines(this.captureId, params)
      .subscribe({
        next: response => {
          this.captureLinesMain = response.data;
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  //Exportar todos líneas de captura
  exportAll(): void {
    this.loading = true;
    this.capturelineService
      .getAllDetCaptureLinesExport(this.captureId)
      .subscribe({
        next: response => {
          this.downloadDocument(
            'DETALLES_DE_CAPTURA',
            'excel',
            response.base64File
          );
          // this._downloadExcelFromBase64(response.base64File, 'TODOS_LOS_CLIENTES_PENALIZADOS');
          this.modalRef.hide();
        },
        error: error => {
          this.loading = false;
        },
      });
  }

  //Descargar Excel
  downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('xls', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    this.loading = false;
    this.alert('success', 'Reporte Excel', 'Descarga Finalizada');
    URL.revokeObjectURL(objURL);
  }

  base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  //Exportar lista blanca de clientes
  // exportSelected(): void {
  //   const data = this.captureLinesMain.map((row: any) =>
  //     this.transFormColums(row)
  //   );
  //   this.excelService.exportAsExcelFile(
  //     data,
  //     'DetallesDeBusquedaYProcesamientoDePagos'
  //   );
  // }

  // private transFormColums(row: any) {
  //   return {
  //     Evento: row.eventId,
  //     'No. Paleta': row.pallette,
  //     'Línea Captura': row.captureLine,
  //   };
  // }

  close() {
    this.modalRef.hide();
  }
}*/

import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDetCapturelines } from 'src/app/core/models/catalogs/capture-lines-main.model';
import { CapturelineService } from 'src/app/core/services/ms-capture-line/captureline.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CAPTURE_LINES_COLUMNS } from '../../capture-lines-main/capture-lines-columns';

@Component({
  selector: 'app-export-capture-lines',
  templateUrl: './export-capture-lines.component.html',
  styles: [],
})
export class ExportCaptureLinesComponent extends BasePage implements OnInit {
  title: string = 'Detalle de Captura';
  captureLinesMain: IDetCapturelines[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  edit: boolean = false;
  captureLinesId: number;
  captureId: number;

  constructor(
    private capturelineService: CapturelineService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings.columns = CAPTURE_LINES_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    console.log(this.captureId);
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

  //Tabla con todos los eventos para exportar
  getData() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.capturelineService
      .getAllDetCaptureLines(this.captureId, params)
      .subscribe({
        next: response => {
          this.captureLinesMain = response.data;
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  //Exportar todos líneas de captura
  exportAll(): void {
    this.loading = true;
    console.log(this.captureId);
    this.capturelineService
      .getAllDetCaptureLinesExport(this.captureId)
      .subscribe({
        next: response => {
          this.downloadDocument(
            'DETALLES_DE_CAPTURA',
            'excel',
            response.base64File
          );
          // this._downloadExcelFromBase64(response.base64File, 'TODOS_LOS_CLIENTES_PENALIZADOS');
          this.modalRef.hide();
        },
        error: error => {
          this.loading = false;
        },
      });
  }

  //Descargar Excel
  downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('xls', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    this.loading = false;
    this.alert('success', 'Reporte Excel', 'Descarga Finalizada');
    URL.revokeObjectURL(objURL);
  }

  base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  close() {
    this.modalRef.hide();
  }
}
