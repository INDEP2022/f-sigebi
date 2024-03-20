import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ButtonColumnDocComponent } from 'src/app/shared/components/button-column-doc/button-column-doc.component';
import { ButtonColumnScanComponent } from 'src/app/shared/components/button-column-scan/button-column-scan/button-column-scan.component';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { OutsideTradesComponent } from '../../outside-trades/outside-trades/outside-trades.component';
import { ScannedDocumentsComponent } from '../../scanned-documents/scanned-documents/scanned-documents.component';
import { REAL_STATE_COLUMNS, REPORT_COLUMNS } from './propertyInm-columns';

//import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-propertyInd',
  templateUrl: './propertyInm.component.html',
  styles: [],
})
export class PropertyInmComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  totalItems1: number = 0;
  loadingReport: boolean = false;
  excelLoading = false;
  dataGood: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  settings1: any = [];
  data: LocalDataSource = new LocalDataSource();
  good: LocalDataSource = new LocalDataSource();
  columnFilters1: any = [];
  loading1 = false;
  columnFilters: any = [];
  array: any = [];
  constructor(
    private goodSssubtypeService: GoodSssubtypeService,
    private goodServices: GoodService,
    private goodprocessService: GoodprocessService,
    private affairService: AffairService,
    private massiveGoodService: MassiveGoodService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        ...REAL_STATE_COLUMNS,
        seleccion: {
          title: 'Selección',
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectDelegation(instance),
          sort: false,
          filter: false,
        },
      },
    };
    this.settings1 = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        scan: {
          title: 'Doc. Escaneados',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnScanComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              //console.log(row);
              this.onSelectScanner(row);
            });
          },
        },
        office: {
          title: 'Oficio',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnDocComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              //console.log(row);
              this.onSelectOffice(row);
            });
          },
        },
        ...REPORT_COLUMNS,
      },
    };
  }

  private tempArray: any[] = [];

  onSelectDelegation(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        // Haz una copia del array antes de la acción de selección o deselección
        this.tempArray = [...this.array];
        console.log(data.toggle, data.row.clasifGoodNumber);
        if (data.toggle) {
          // Si el checkbox se selecciona, agregar el elemento al array
          if (!this.array.includes(data.row.clasifGoodNumber)) {
            this.array.push(data.row.clasifGoodNumber);
          }
        } else {
          // Si el checkbox se deselecciona, eliminar el elemento del array
          const index = this.array.indexOf(data.row.clasifGoodNumber);
          if (index !== -1) {
            this.array.splice(index, 1);
          }
        }
        console.log(this.array);

        // Ahora puedes realizar la consulta, teniendo en cuenta los cambios en this.array
        this.params1
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.performQuery());
      },
    });
  }

  // Esta función realiza la consulta
  performQuery() {
    this.loading1 = true;
    this.dataGood = [];

    let params = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };
    console.log(this.array);
    params['filter.clasif'] = `$in:${this.array}`;
    console.log(params);

    this.affairService.getObtnGood(params).subscribe({
      next: (response: any) => {
        this.dataGood = response.data;
        this.totalItems1 = response.count;
        this.good.load(response.data);
        this.good.refresh();
        this.loading1 = false;
      },
      error: err => {
        console.log('error', err);
        this.totalItems1 = 0;
        this.good.load([]);
        this.good.refresh();
        this.loading1 = false;
      },
    });
  }
  onSelectScanner(event: any) {
    console.log(event.expediente);
    const proceedings = event.expediente;
    const valid: boolean = true;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      proceedings,
      valid,
      callback: (next: boolean) => {
        if (next)
          this.params1
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.performQuery());
      },
    };
    this.modalService.show(ScannedDocumentsComponent, modalConfig);
  }
  onSelectOffice(event: any) {
    console.log(event);
    if (event.no_of_gestion != null) {
      const noGes = event.no_of_gestion;
      const valid1: boolean = true;
      const modalConfig = MODAL_CONFIG;
      modalConfig.initialState = {
        noGes,
        valid1,
        callback: (next: boolean) => {
          if (next)
            this.params1
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.performQuery());
        },
      };
      this.modalService.show(OutsideTradesComponent, modalConfig);
    } else {
      this.alert(
        'warning',
        'advertencia',
        'Lo sentimos el Bien no tiene No. Gestión'
      );
    }
  }
  ngOnInit(): void {
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
          this.getDataAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataAll());

    this.good
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
              case 'numClasifGoods':
                searchFilter = SearchFilter.EQ;
                break;
              case 'expediente':
                searchFilter = SearchFilter.EQ;
                break;
              case 'bien':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cantidad':
                searchFilter = SearchFilter.EQ;
                break;
              case 'unidad_medida':
                searchFilter = SearchFilter.EQ;
                break;
              case 'clasif':
                searchFilter = SearchFilter.EQ;
                break;
              case 'no_trasferente':
                searchFilter = SearchFilter.EQ;
                break;
              case 'volante':
                searchFilter = SearchFilter.EQ;
                break;
              case 'no_almacen':
                searchFilter = SearchFilter.EQ;
                break;
              case 'num_fotos':
                searchFilter = SearchFilter.EQ;
                break;
              case 'no_of_gestion':
                searchFilter = SearchFilter.EQ;
                break;
              case 'fecha_desahogo':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'fecha_dictamen_procedencia':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'fecha_captura_acta_recepcion':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params1 = this.pageFilter(this.params1);
          this.performQuery();
        }
      });
    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.performQuery());
  }

  getDataAll() {
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    param['filter.typeNumber'] = `$eq:5`;
    console.log(param);
    this.goodprocessService.getGoodTypeMuebles(param).subscribe({
      next: (resp: any) => {
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  rowsSelected(event: any) {
    //console.log(event.isSelected);
  }

  onExportExcel() {
    this.loader.load = true;
    if (this.array.length === 0 || this.totalItems1 === 0) {
      this.alert('warning', 'Debe seleccionar un valor', '');
      this.loader.load = false;
      return;
    }
    this.loadingReport = true;
    this.generateReport();
    this.loadingReport = false;
  }

  generateReport() {
    console.log(this.array);

    const array = this.array;
    console.log(array);

    this.excelLoading = true;

    /*return this.massiveGoodService.getObtnGoodExcel(this.array).pipe(
      catchError(error => {
        this.excelLoading = false;
        this.alert('error', 'Error', UNEXPECTED_ERROR);
        return throwError(() => error);
      }),
      tap(response => {
        this.excelLoading = false;
        this._downloadExcelFromBase64(
          response.base64File,
          `lfiarchivo-${this.array}`
        );
        console.log(response);
      })
    );*/

    this.massiveGoodService.getObtnGoodExcel(this.array).subscribe({
      next: resp => {
        console.log(resp.nameFile);
        const date = new Date(Date());
        var formatted = new DatePipe('en-EN').transform(
          date,
          'dd/MM/yyyy',
          'UTC'
        );
        this.downloadDocument(
          `Informacion del Bien - ${formatted}`,
          'excel',
          resp.base64File
        );
      },
      error: err => {
        console.log(err);
        this.loader.load = false;
      },
    });
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
    this.loader.load = false;
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
