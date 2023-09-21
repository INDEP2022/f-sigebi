import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DETAIL_COLUMNS } from './column';

@Component({
  selector: 'app-report-exposure-for-sale-modal',
  templateUrl: './report-exposure-for-sale-modal.component.html',
  //styleUrls: ['./report-exposure-for-sale-modal.component.css']
})
export class ReportExposureForSaleModalComponent
  extends BasePage
  implements OnInit
{
  columnFilters1: any = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();
  validate: boolean = false;
  goodNumber: number;
  constructor(
    private comerEventosService: ComerEventosService,
    private modalRef: BsModalRef,
    private datePipe: DatePipe
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: { ...DETAIL_COLUMNS },
    };
  }

  ngOnInit() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'clasifGoodNumber':
                searchFilter = SearchFilter.EQ;
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
          this.getDetailReport();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDetailReport());
  }

  getDetailReport() {
    this.loading = true;
    let body = {
      pOption: 8,
      pEvent: this.goodNumber,
      pLot: 0,
      pTypeGood: '',
      pEventKey: 0,
      pTrans: 0,
    };
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.comerEventosService.getPaLookLots(body, param).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.validate = true;
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

  rowsSelected(event: any) {}

  onExportExcel() {
    /*if (this.goodNumber) {
      this.params3.getValue()['filter.no_tipo'] = `$eq:${this.idTypeGood}`;
    }*/
    let body = {
      pOption: 8,
      pEvent: this.goodNumber,
      pLot: 0,
      pTypeGood: '',
      pEventKey: 0,
      pTrans: 0,
    };
    let param = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };
    param['limit'] = '';
    const date = new Date(Date());
    const dateFormat = this.datePipe.transform(date, 'dd-MM-yyyy HH:mm:ss');
    this.comerEventosService.getPaLookLotsExcel(body, param).subscribe({
      next: resp => {
        this.downloadDocument(
          `Consulta de estatus del bien ${this.goodNumber} al - ${dateFormat}`,
          'excel',
          resp.base64File
        );
      },
      error: err => {
        console.log(err);
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

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
}
