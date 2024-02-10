import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, firstValueFrom, takeUntil } from 'rxjs';
import {
  convertFormatDate,
  generateUrlOrPath,
} from 'src/app/common/helpers/helpers';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITmpLcComer } from 'src/app/core/models/ms-captureline/captureline';
import { CapturelineService } from 'src/app/core/services/ms-captureline/captureline.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { GuarantyService } from 'src/app/core/services/ms-guaranty/guaranty.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AddLcModalComponent } from '../components/add-lc-modal/add-lc-modal.component';
import { TableCheckPortalDialogComponent } from '../components/table-check-portal-dialog/table-check-portal-dialog.component';
import { TableCheckboxComponent } from '../components/table-checkbox/table-checkbox.component';
import {
  SETTING_BATCH_REWORK,
  SETTING_CLIENT_ID,
  SETTING_DATA,
  SETTING_LCS,
  SETTING_REPROCESS,
  SETTING_RFC,
  SETTING_RFC_REWORK,
} from './massive-conversion-columns';

interface IExcelToJson {
  id: number;
  CLIENTEID: number;
  PALETAID: number;
  LOTE: number;
  MONTO_INT: number;
  NO_CHEQUE_IN: number;
  EXP_CHEQUE_IN: string;
  FECVIGENCIA_IN: string;
}

@Component({
  selector: 'app-massive-conversion-main',
  templateUrl: './massive-conversion-main.component.html',
  styleUrls: ['./massive-conversion.scss'],
  styles: [
    `
      .btn-event-search {
        position: absolute;
        width: 30px;
        height: 30px;
        padding: 5px;
        border-radius: 50%;
        border: none;
        right: 5px;
      }
    `,
  ],
  animations: [
    trigger('OnEventSelected', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class MassiveConversionMainComponent extends BasePage implements OnInit {
  selectedEvent: any = null;
  operationItems = new DefaultSelect();
  toggleFilter: boolean = true;
  maintenance: boolean = false;
  rowsAdded: boolean = false;
  operationId: number = 0;
  totalEntries: number = 0;
  generatedLcs: number = 0;
  dataTotalItems: number = 0;
  dataColumns = new LocalDataSource();
  validGenerateLCs = false;
  reprocessDisabled = false;
  layout: string = 'RFC'; // 'RFC' || 'clientId'
  reworkType: string = 'CLIENT'; // 'BATCH' || 'CLIENT'
  // lcSource: LocalDataSource;
  addRows: any[] = [];
  editedRowModal: any;
  editedRowTable: any;
  reworkEntries: any[] = [];
  lcsTotalItems: number = 0;
  rfcTotalItems: number = 0;
  clientIdTotalItems: number = 0;
  batchReworkTotalItems: number = 0;
  rfcReworkTotalItems: number = 0;
  // rfcColumns: any[] = [];
  // clientIdColumns: any[] = [];
  batchReworkColumns: any[] = [];
  rfcReworkColumns: any[] = [];
  dataParams = new BehaviorSubject<ListParams>(new ListParams());
  lcsParams = new BehaviorSubject<ListParams>(new ListParams());
  rfcParams = new BehaviorSubject<ListParams>(new ListParams());
  batchReworkParams = new BehaviorSubject<ListParams>(new ListParams());
  rfcReworkParams = new BehaviorSubject<ListParams>(new ListParams());
  clientIdParams = new BehaviorSubject<ListParams>(new ListParams());
  @ViewChild('lcsTabs', { static: false }) lcsTabs?: TabsetComponent;
  dataSettings = SETTING_DATA;
  lcsSettings = SETTING_LCS;
  rfcSettings = SETTING_RFC;
  clientIdSettings = SETTING_CLIENT_ID;
  batchReworkSettings = SETTING_BATCH_REWORK;
  rfcReworkSettings = SETTING_RFC_REWORK;
  reprocesSettings = SETTING_REPROCESS;

  dataSource: LocalDataSource = new LocalDataSource();
  rfcSource = new LocalDataSource();
  clientSource = new LocalDataSource();
  lcsSource = new LocalDataSource();
  isLoadingLcs = false;
  pathGetBath = generateUrlOrPath('catalog', 'batch', true);
  title: string = "Conversión Masiva de LC'S";

  paramsD = new BehaviorSubject<ListParams>(new ListParams());
  columnFiltersD: any = [];
  totalItemsD: number = 0;

  paramsLc = new BehaviorSubject<ListParams>(new ListParams());
  columnFiltersLc: any = [];
  totalItemsLc: number = 0;

  @ViewChild('tabset') tabset: TabsetComponent;

  activeTab: string = 'tab1';
  reProTabActive: boolean = true;
  tab3Active: boolean = false;
  reprocesSource: [];
  form: ModelForm<any>;
  validityDate: any;
  tipoConsul: string;
  fileReader = new FileReader();
  isLoadingExportFile = false;
  //data: IExcelToJson[] = [];
  consecutiveTmp: number;
  numRecordsCsv: number;
  data: any;
  fechaHoy: string;

  paramsGetMax = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private excelService: ExcelService,
    private modalService: BsModalService,
    private capturelineService: CapturelineService,
    private guarantyService: GuarantyService,
    private comerEventService: ComerEventosService,
    private prepareEventService: ComerEventService,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    super();
    //this.today = new Date();
  }

  ngOnInit(): void {
    this.dateToday();

    this.prepareForm();

    this.rfcSettings.columns = this.modifyColumns(this.rfcSettings.columns);
    this.clientIdSettings.columns = this.modifyColumns(
      this.clientIdSettings.columns
    );

    this.dataSource
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
              case 'batchId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'comerLots':
                searchFilter = SearchFilter.EQ;
                field = `filter.${'comerLots'}.lotPublic`;
                break;
              case 'customerId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'comerClient':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${'comerClient'}.rfc`;
                break;
              case 'validityDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'insertDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFiltersD[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersD[field];
            }
          });
          this.paramsD = this.pageFilter(this.paramsD);
          this.paramsD
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.searchData());
        }
      });

    this.paramsD
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchData());

    this.lcsSource
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
              case 'idlcg':
                searchFilter = SearchFilter.EQ;
                break;
              case 'dateValidity':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'dateRecord':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFiltersLc[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersLc[field];
            }
          });
          this.paramsLc = this.pageFilter(this.paramsLc);
          this.paramsLc
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.guarantyData());
        }
      });

    this.paramsLc
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.guarantyData());
  }

  prepareForm() {
    this.form = this.fb.group({
      eventId: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      batchId: [
        { value: null, disabled: true },
        [Validators.pattern(NUMBERS_PATTERN)],
      ],
      insertDate: [{ value: null, disabled: true }],
      status: [{ value: null, disabled: true }],
      operationId: [
        { value: null, disabled: true },
        [Validators.pattern(NUMBERS_PATTERN)],
      ],

      validityDate: [{ value: null, disabled: true }],
    });
  }

  searchEvent(): void {
    const eventId = this.form.controls['eventId'].value;
    if (!eventId) {
      this.alert('warning', this.title, 'Debe ingresar un evento');
      return;
    }
    //this.enabledOrDisabledControl('eventId', false);
    this.comerEventService.getComerEventById(eventId).subscribe({
      next: (event: any) => {
        // this.enabledOrDisabledControl('eventId', true);
        this.form.enable();
        console.log({ event });
        this.selectedEvent = event || null;
      },
      error: () => {
        this.enabledOrDisabledControl('eventId', true);
        this.alert('warning', this.title, 'No se encontró el evento');
      },
    });
  }

  enableInputEvent(): void {
    this.selectedEvent = null;
    this.enabledOrDisabledControl('eventId', true);
    this.clearTables();
  }

  enabledOrDisabledControl(control: string, enabled: boolean) {
    if (enabled) {
      this.form.get(control).enable();
    } else {
      this.form.get(control).disable();
    }
  }

  resetFilter() {
    this.enableInputEvent();
    this.cleanFiltersTable();
    this.form.controls['batchId'].setValue(null);
    this.form.controls['status'].setValue(null);
    this.form.controls['operationId'].setValue(null);
    this.form.controls['insertDate'].setValue(null);
    this.form.controls['validityDate'].setValue(null);
    this.form.controls['eventId'].setValue(null);

    this.tabset.tabs.forEach((tab, i) => {
      tab.active = i === 0;
      this.reProTabActive = true;
      this.tab3Active = false;
    });

    this.validGenerateLCs = false;
  }

  //ViewChild('dataSource') miTabla: Ng2SmartTableComponent;
  cleanFiltersTable(): void {
    this.dataSource.setFilter([]);
    this.lcsSource.setFilter([]);
    this.rfcSource.setFilter([]);
    this.clientSource.setFilter([]);
    //this.reprocesSource.setFilter([]);
  }

  consultInServer() {
    let fromButton = true;

    if (this.form.controls['eventId'].value == null) {
      this.alert(
        'warning',
        this.title,
        'No se ha insertado ningún filtro de búsqueda.'
      );
      this.form.markAllAsTouched();
      return;
    }
    this.searchData(fromButton);
    // this.searchLcs();
    this.guarantyData(fromButton);
  }

  searchData(fromButton?: boolean) {
    this.loading = true;

    if (this.searchInsertFile == true) {
      let params = {
        ...this.paramsD.getValue(),
        ...this.columnFiltersD,
      };

      this.capturelineService
        .getTmpLcComer(params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: res => {
            this.dataSource.load(res.data);
            this.dataSource.refresh();
            this.totalItemsD = res.count;
            this.loading = false;
            this.validGenerateLCs = true;
            this.form.enable();
            console.log('datos: ', res.data, 'count: ', res.count);
            this.validityDate = res.data[0].validityDate;
          },
          error: error => {
            console.log('Error', error);
            this.loading = false;
            this.validGenerateLCs = false;
            this.dataSource.load([]);
            this.dataSource.refresh();
            this.totalItemsD = 0;
            if (fromButton) {
              this.alert('warning', 'Advertencia', 'No se encontraron Datos');
            }
          },
        });
    }

    let params = {
      ...this.paramsD.getValue(),
      ...this.columnFiltersD,
    };

    params['filter.eventId'] = `$eq:${this.form.controls['eventId'].value}`;

    if (this.form.controls['batchId'].value) {
      params['filter.batchId'] = `$eq:${this.form.controls['batchId'].value}`;
    }

    if (this.form.controls['insertDate'].value) {
      const insertDate = this.returnParseDate(
        this.form.controls['insertDate'].value
      );
      params['filter.insertDate'] = `$eq:${insertDate}`;
    }

    if (this.form.controls['status'].value) {
      params['filter.status'] = `$eq:${this.form.controls['status'].value}`;
    }

    if (this.form.controls['operationId'].value) {
      params[
        'filter.operationId'
      ] = `$eq:${this.form.controls['operationId'].value}`;
    }

    if (this.form.controls['validityDate'].value) {
      const validityDate = this.returnParseDate(
        this.form.controls['validityDate'].value
      );
      params['filter.validityDate'] = `$eq:${validityDate}`;
    }

    //const params = this.makeFiltersParams(list).getParams();
    this.capturelineService
      .getTmpLcComer(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: res => {
          this.dataSource.load(res.data);
          this.dataSource.refresh();
          this.totalItemsD = res.count;
          this.loading = false;
          this.validGenerateLCs = true;
          this.form.enable();
          console.log('datos: ', res.data, 'count: ', res.count);
          this.validityDate = res.data[0].validityDate;
        },
        error: error => {
          console.log('Error', error);
          this.loading = false;
          this.validGenerateLCs = false;
          this.dataSource.load([]);
          this.dataSource.refresh();
          this.totalItemsD = 0;
          if (fromButton) {
            this.alert('warning', 'Advertencia', 'No se encontraron Datos');
          }
        },
      });
  }

  guarantyData(fromButton?: boolean) {
    this.isLoadingLcs = true;
    let params = {
      ...this.paramsLc.getValue(),
      ...this.columnFiltersLc,
    };
    params['filter.idEvent'] = `$eq:${this.form.controls['eventId'].value}`;

    this.guarantyService
      .getComerRefGuarantees(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: res => {
          this.lcsSource.load(res.data);
          this.lcsSource.refresh();
          this.totalItemsLc = res.count;
          this.isLoadingLcs = false;
        },
        error: error => {
          this.lcsSource.load([]);
          this.lcsSource.refresh();
          this.isLoadingLcs = false;
          this.totalItemsLc = 0;
          if (fromButton) {
            this.alert('warning', 'Advertencia', 'No se encontraron Lc´s');
          }
        },
      });
  }

  /*searchLcs(listParams?: ListParams) {
    this.isLoadingLcs = true;
    
    //TODO: decirle a Eduardo que haga opcional el campo de validityDate
    const paramsPaginate = {
      page: listParams?.page || 1,
      limit: listParams?.limit || 10,
    };
    this.capturelineService
      .postComerRefGuaranteesSearch({ ...this.form.value, ...paramsPaginate })
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: res => {
          this.isLoadingLcs = false;
          this.lcsSource.load(res.data);
          this.totalItems = res.count;

          this.isLoadingLcs = false;
        },
        error: () => {
          this.lcsSource.load([]);
          this.isLoadingLcs = false;
        },
      });
  }*/

  makeFiltersParams(
    list?: ListParams,
    keyOthers: { [key: string]: string } | null = null
  ): FilterParams {
    const params = new FilterParams();
    params.page = list?.page || 1;
    params.limit = list?.limit || 10;
    const filters: any = this.form.getRawValue();
    if (filters.insertDate) {
      filters.insertDate = convertFormatDate(filters.insertDate);
    }
    if (filters.validityDate) {
      filters.validityDate = convertFormatDate(filters.validityDate);
    }
    Object.keys(filters).forEach((key: string) => {
      if (filters[key]) {
        const _key = keyOthers ? keyOthers?.[key] || key : key;
        params.addFilter(_key, filters[key]);
      }
    });
    return params;
  }

  validConsult(): boolean {
    return Object.values(this.form.getRawValue()).some((value: any) =>
      Boolean(value)
    );
  }

  clearTables() {
    this.dataSource.load([]);
    this.lcsSource.load([]);
    this.dataTotalItems = 0;
    this.lcsTotalItems = 0;
  }

  //#region on click load file
  isLoadingLoadFile = false;
  async onClickLoadFile() {
    const result = await this.alertQuestion(
      'question',
      'Atención',
      `¿Insertar el archivo?`
    );
    if (result.isConfirmed) {
      this.tipoConsul = 'INSERT';
      //	PUP_ABRIR_ARCHIVO

      //this.isLoadingLoadFile = true;

      /*const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pmode', 'W');
      let url = '';
      if (type === 'client_id') {
        url = `${environment.API_URL}massivecaptureline/api/v1/application/pupInsertRecord`;
      } else {
        url = `${environment.API_URL}massivecaptureline/api/v1/application/pupInsertRecordMassively`;
      }

      this.httpClient
        .post(url, formData)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: (res: any) => {
            this.alert(
              'success',
              this.title,
              'Se insertó correctamente a datos'
            );
            this.isLoadingLoadFile = false;
            event.target.value = null;
            //
            let listParams = new ListParams();
            listParams['filter.operationId'] = '$eq:' + res.data.operationId;
            //this.searchData(listParams);
          },
          error: err => {
            console.log({ err });
            this.alert(
              'error',
              this.title,
              err?.error?.message ||
                'Ocurrió un error al insertar los datos vuelve a intentarlo'
            );
            this.isLoadingLoadFile = false;
            event.target.value = null;
          },
        });*/
    }
  }

  onFileChange(event: Event) {
    if (this.form.controls['eventId'].value != null) {
      this.alertQuestion('question', 'Atención', `¿Insertar el archivo?`).then(
        question => {
          if (question.isConfirmed) {
            this.tipoConsul = 'INSERT';

            const files = (event.target as HTMLInputElement).files;
            if (files.length != 1)
              throw 'No files selected, or more than of allowed';
            const fileReader = new FileReader();
            /*fileReader.onload = (e) => {
            console.log("Entrando a fileReader.onload");
            const fileContent = fileReader.result as string;
            const rows = fileContent.split('\n'); // Suponiendo que cada fila del archivo CSV está separada por una nueva línea
            const data = rows.map(row => {
              const columns = row.split(','); // Suponiendo que las columnas están separadas por comas
              // Asumiendo que la fecha está en la primera columna
              const dateParts = columns[6].split('/'); // Dividir la fecha en partes: día, mes, año
              // Crear un objeto Date con las partes de la fecha en el orden correcto (año, mes - 1, día)
              const date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
              // Suponiendo que las otras columnas contienen otros datos
              // Aquí puedes procesar las otras columnas según sea necesario
              return {
                date: date,
                // Otras propiedades de las filas...
              };
            });
            console.log(data);
          }*/
            fileReader.readAsBinaryString(files[0]);
            fileReader.onload = () => this.readExcel(fileReader.result);
          }
        }
      );
    } else if (this.form.controls['eventId'].value === null) {
      this.alertQuestion(
        'question',
        'Sin Evento Ingresado',
        'La inserción se hará sin ID de Evento'
      ).then(question => {
        if (question.isConfirmed) {
          this.alertQuestion(
            'question',
            'Atención',
            `¿Insertar el archivo?`
          ).then(question => {
            if (question.isConfirmed) {
              this.tipoConsul = 'INSERT';

              const files = (event.target as HTMLInputElement).files;
              if (files.length != 1)
                throw 'No files selected, or more than of allowed';
              const fileReader = new FileReader();
              /*fileReader.onload = (e) => {
            console.log("Entrando a fileReader.onload");
            const fileContent = fileReader.result as string;
            const rows = fileContent.split('\n'); // Suponiendo que cada fila del archivo CSV está separada por una nueva línea
            const data = rows.map(row => {
              const columns = row.split(','); // Suponiendo que las columnas están separadas por comas
              // Asumiendo que la fecha está en la primera columna
              const dateParts = columns[6].split('/'); // Dividir la fecha en partes: día, mes, año
              // Crear un objeto Date con las partes de la fecha en el orden correcto (año, mes - 1, día)
              const date = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
              // Suponiendo que las otras columnas contienen otros datos
              // Aquí puedes procesar las otras columnas según sea necesario
              return {
                date: date,
                // Otras propiedades de las filas...
              };
            });
            console.log(data);
          }*/
              fileReader.readAsBinaryString(files[0]);
              fileReader.onload = () => this.readExcel(fileReader.result);
            } else return;
          });
        }
      });
    }
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.data = this.excelService.getData<IExcelToJson>(binaryExcel);
      this.numRecordsCsv = this.data.length;
      //Verificar que el archivo sea correcto
      //Subir archivo
      this.uploadToTpmLcComer(this.numRecordsCsv, this.data);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  searchInsertFile: boolean = false;

  async uploadToTpmLcComer(numRecords: number, dataCsv: IExcelToJson) {
    console.log('Número de registros', numRecords);
    console.log('Evento campo: ', this.form.controls['eventId'].value);

    if (this.form.controls['eventId'].value === null) {
      for (let i = 0; i < numRecords; i++) {
        let consecutiveMax: any = await this.getConsecutiveMaxTmc();
        console.log('consecutiveMax siguiente', consecutiveMax);
        console.log('Registros: ', dataCsv[i]);

        const dataJson = {
          id: consecutiveMax,
          //eventId: this.form.controls['eventId'].value,
          customerId: dataCsv[i].CLIENTEID,
          palletteId: dataCsv[i].PALETAID,
          batchId: dataCsv[i].LOTE,
          amount: dataCsv[i].MONTO_IN,
          checkNumber: dataCsv[i].NO_CHEQUE_IN,
          bankExpCheck: dataCsv[i].EXP_CHEQUE_IN,
          validityDate: this.fechaHoy,
          //validityDate: dataCsv[i].FECVIGENCIA_IN
        };

        console.log('Objeto a enviar ', dataJson);

        this.capturelineService.postTmpLcComer(dataJson).subscribe({
          next: resp => {
            console.log('Inserción Masiva desde Excel Correcto: ', resp);
          },
          error: error => {
            console.log('Inserción Masiva desde Excel incorrecto: ', error);
          },
        });
      }

      this.alertInfo(
        'success',
        'Archivo Insertado',
        'Se actualizará la tabla solo con los registros válidos'
      ).then(question => {
        if (question.isConfirmed) {
          this.searchInsertFile = true;
          this.searchData();
        }
      });
    }

    if (this.form.controls['eventId'].value != null) {
      for (let i = 0; i < numRecords; i++) {
        let consecutiveMax: any = await this.getConsecutiveMaxTmc();
        console.log('consecutiveMax siguiente', consecutiveMax);
        console.log('Registros: ', dataCsv[i]);
        const dataJson = {
          id: consecutiveMax,
          eventId: this.form.controls['eventId'].value,
          customerId: dataCsv[i].CLIENTEID,
          palletteId: dataCsv[i].PALETAID,
          batchId: dataCsv[i].LOTE,
          amount: dataCsv[i].MONTO_IN,
          checkNumber: dataCsv[i].NO_CHEQUE_IN,
          bankExpCheck: dataCsv[i].EXP_CHEQUE_IN,
          validityDate: this.fechaHoy,
          //validityDate: dataCsv[i].FECVIGENCIA_IN
        };

        console.log('Objeto a enviar ', dataJson);

        this.capturelineService.postTmpLcComer(dataJson).subscribe({
          next: resp => {
            console.log('Inserción Masiva desde Excel Correcto: ', resp);
          },
          error: error => {
            console.log('Inserción Masiva desde Excel incorrecto: ', error);
          },
        });
      }

      this.alertInfo(
        'success',
        'Archivo Insertado',
        'Se actualizará la tabla solo con los registros válidos'
      ).then(question => {
        if (question.isConfirmed) {
          this.searchData();
        }
      });
    }
  }

  getConsecutiveMaxTmc() {
    return new Promise((resolve, reject) => {
      //Consultar el número más grande
      this.paramsGetMax;
      let params = {
        ...this.paramsGetMax.getValue(),
      };

      params['sortBy'] = 'id:DESC';

      this.capturelineService.getTmpLcComer(params).subscribe({
        next: resp => {
          this.consecutiveTmp = resp.data[0].id;
          console.log('consecutiveMax Actual ', this.consecutiveTmp);
          const consecutiveMax = this.consecutiveTmp + 1;
          resolve(consecutiveMax);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  exportFile() {
    if (!this.form.get('eventId').value) {
      this.alert('warning', this.title, 'No se ha seleccionado un evento');
      return;
    }
    this.isLoadingExportFile = true;
    let params = {
      ...this.paramsLc.getValue(),
      ...this.columnFiltersLc,
    };
    params['filter.idEvent'] = `${this.form.controls['eventId'].value}`;

    this.guarantyService.getExcelComerRefGuarantees(params).subscribe({
      next: res => {
        this.isLoadingExportFile = false;
        console.log('Respuesta Excel', res.base64File);
        const filename: string = 'test';
        this._downloadExcelFromBase64(res.base64File, res.nameFile);

        //this.searchLcs();
      },
      error: err => {
        this.alert('error', 'Error', 'No se logró generar el archivo');
        this.isLoadingExportFile = false;
      },
    });
  }

  insertTmpLcComer(tmpLcComer: ITmpLcComer) {
    this.capturelineService
      .postTmpLcComer(tmpLcComer)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: () => {
          this.alert('success', this.title, 'Se insertó correctamente');
          this.searchData();
        },
        error: () => {
          this.alert('error', this.title, 'Ocurrió un error al insertar');
        },
      });
  }

  loadChecks() {
    if (this.form.controls['eventId'].value == null) {
      this.alert('warning', 'Atención', 'Se necesita un ID de Evento');
      return;
    }

    if (this.form.controls['validityDate'].value != null) {
      const fechaOriginal: Date = new Date(
        this.form.controls['validityDate'].value
      );
      const fechaFormateada: string = this.datePipe.transform(
        fechaOriginal,
        'dd/MM/yyyy',
        'es-MX'
      );

      this.alertQuestion(
        'question',
        `La fecha de vigencia será: ${fechaFormateada}`,
        '¿Continuar?'
      ).then(question => {
        if (question.isConfirmed) {
          this.loadingChecks(
            this.form.controls['eventId'].value,
            this.form.controls['validityDate'].value,
            true
          );
        }
      });
    } else {
      const fechaOriginal: Date = new Date(this.validityDate);
      const fechaFormateada: string = this.datePipe.transform(
        fechaOriginal,
        'dd/MM/yyyy',
        'es-MX'
      );

      this.alertQuestion(
        'question',
        `La Fecha de vigencia se tomará de la tabla: ${fechaFormateada}`,
        '¿Desea continuar?'
      ).then(question => {
        if (question.isConfirmed) {
          this.loadingChecks(
            this.form.controls['eventId'].value,
            this.validityDate,
            true
          );
        }
      });
    }
  }

  loadingChecks(event1: string, validation1: string, p_flag1: boolean) {
    this.capturelineService
      .postLoadCheckPortal({
        event: event1,
        p_FLAG: p_flag1,
        validation: validation1,
      })
      .subscribe({
        next: resp => {
          console.log('Respuesta: ', resp);
          this.alert(
            'success',
            'Cheques cargados',
            'Se cargaron los cheques correctamente'
          );
        },
        error: error => {
          console.log('Error', error);
          this.alert(
            'warning',
            'Atención',
            'No hay resultados para este evento'
          );
        },
      });
  }

  /*async loadCheckLc(
    form: FormGroup,
    capturelineService: CapturelineService,
    cbOpenCheckPortal: (item: any) => void
  ) {
    const { validityDate, eventId } = form.getRawValue();
    let p_FLAG = Boolean(validityDate);
    console.log(form.getRawValue());
    const res = await this.alertQuestion(
      'question',
      this.title,
      validityDate
        ? `La fecha de vigencia será ${convertFormatDate(
            validityDate
          )}. ¿Desea continuar?`
        : 'La Fecha de vigencia se tomará de la tabla. ¿Desea continuar?'
    );
    if (res.isConfirmed) {
      capturelineService
        .postLoadCheckPortal({
          event: eventId,
          validation: validityDate ? convertFormatDate(validityDate) : '',
          p_FLAG,
        })
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: res => {
            console.log(res);
            if (res.data) {
              this.alert(
                'success',
                this.title,
                'Se cargaron los cheques correctamente'
              );
              cbOpenCheckPortal({ list: res.data });
            } else {
              this.alert('warning', this.title, 'No se encontraron cheques');
            }
          },
          error: () => {
            this.alert(
              'error',
              this.title,
              'Ocurrió un error al intentar cargar cheques'
            );
          },
        });
    }
  }*/

  async reprocess() {
    if (this.form.controls['eventId'].value == null) {
      this.alert('warning', 'Atención', 'Se necesita un ID de Evento');
      return;
    }

    this.searchEvent();

    this.tabset.tabs.forEach((tab, i) => {
      tab.active = i === 2;
      this.reProTabActive = false;
      this.tab3Active = true;
    });

    if (this.form.controls['eventId'].value) {
      this.reprocessDisabled = true;
    }
    let count = await firstValueFrom(
      this.prepareEventService.getCountEventMassiveConversionLc(
        this.form.controls['eventId'].value
      )
    );
    console.log('count:', count);
    if (Number(count) === 0) {
      this.alertInfo(
        'warning',
        'Advertencia',
        'Evento no válido para ingresar a este proceso'
      ).then(question => {
        if (question.isConfirmed) {
          this.tabset.tabs.forEach((tab, i) => {
            tab.active = i === 0;
            this.reProTabActive = true;
            this.tab3Active = false;
          });
        }
      });

      this.reprocessDisabled = false;
      return;
    }
  }

  get eventId() {
    return this.form ? this.form.get('eventId') : null;
  }

  get eventIdValue() {
    return this.eventId ? this.eventId.value : null;
  }

  generateLcs() {
    if (this.form.controls['eventId'].value == null) {
      this.alert('warning', 'Atención', 'Se necesita un ID de Evento');
      return;
    }

    this.alertQuestion(
      'question',
      'Atención',
      '¿Generar las Líneas de Captura?'
    ).then(question => {
      if (question.isConfirmed) {
        const masiveData = {
          event_id: this.form.controls['eventId'].value,
          n_NUM_DIAS: null,
          c_TIPO_LC: null,
          c_TABLA_APLICA: null,
          c_IND_FEC: null,
          c_IND_MONTO: null,
          c_RESUL: null,
        };

        console.log('Objeto a enviar', masiveData);

        //	PUP_GEN_LCS_MASIV
        this.comerEventService.pupGenLcsMasiv(masiveData).subscribe({
          next: resp => {
            console.log('Respuesta', resp);
            this.alertInfo('success', 'Líneas de Captura', 'Proceso Terminado');
            this.searchData();
            this.guarantyData();
          },
          error: error => {
            console.log('Error', error);
            this.alertInfo(
              'warning',
              'Líneas de Captura',
              'No se crearon las LC´s'
            );
          },
        });

        //	PUP_GEN_CONSULTA
      }
    });

    // this.lcsColumns = this.lcsTestData;
    // this.lcsTotalItems = this.lcsColumns.length;
    // if (this.layout == 'RFC') {
    //   this.rfcColumns = this.rfcTestdata;
    //   this.rfcColumns = this.modifyType(this.rfcColumns);
    //   this.rfcTotalItems = this.rfcColumns.length;
    //   // this.lcSource = new LocalDataSource(this.rfcColumns);
    // }
    // if (this.layout == 'clientId') {
    //   this.clientIdColumns = this.clientIdTestData;
    //   this.clientIdColumns = this.modifyType(this.clientIdColumns);
    //   this.clientIdTotalItems = this.clientIdColumns.length;
    //   // this.lcSource = new LocalDataSource(this.clientIdColumns);
    // }
    // this.batchReworkColumns = this.batchReworkTestData;
    // this.batchReworkTotalItems = this.batchReworkColumns.length;
    // this.rfcReworkColumns = this.rfcReworkTestData;
    // this.rfcReworkTotalItems = this.rfcReworkColumns.length;
    // this.maintenance = true;
    // this.lcsTabs.tabs[1].active = true;
  }

  // hideActions() {
  //   setTimeout(() => {
  //     let actions = document.querySelectorAll('a.ng2-smart-action');
  //     actions.forEach((a, i) => {
  //       let action = actions.item(i);
  //       action.classList.add('d-none');
  //     });
  //   }, 400);
  // }

  // modifyType(columns: any[]) {
  //   columns = columns.map((c, i) => {
  //     let type: boolean;
  //     c.type == 'CHECK' ? (type = true) : (type = false);
  //     c = {
  //       ...c,
  //       typeCheck: type,
  //       typeLine: !type,
  //     };
  //     delete c.type;
  //     return c;
  //   });
  //   return columns;
  // }

  // revertType(obj: any) {
  //   let type: string;
  //   obj.typeCheck == true ? (type = 'CHECK') : (type = 'LINE');
  //   obj = {
  //     ...obj,
  //     type: type,
  //   };
  //   delete obj.typeCheck;
  //   delete obj.typeLine;
  //   return obj;
  // }

  modifyColumns(columns: any) {
    columns = {
      ...columns,
      typeCheck: {
        title: 'Cheque',
        type: 'custom',
        sort: false,
        renderComponent: TableCheckboxComponent,
      },
      typeLine: {
        title: 'Línea',
        type: 'custom',
        sort: false,
        renderComponent: TableCheckboxComponent,
      },
    };
    delete columns.type;
    return columns;
  }

  openModal(context?: Partial<AddLcModalComponent>) {
    const modalRef = this.modalService.show(AddLcModalComponent, {
      initialState: { ...context, layout: this.layout },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onAdd.subscribe(data => {
      if (data) this.addRow(data);
    });
    modalRef.content.onEdit.subscribe(data => {
      if (data) this.editRow(data);
    });
  }

  openDialogCheckPortal(context?: Partial<TableCheckPortalDialogComponent>) {
    this.modalService.show(TableCheckPortalDialogComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  openForm(lc?: any) {
    if (this.addRows.length == 0) {
      this.alert(
        'error',
        'Acción no permitida',
        'No se permite alteración de registros previos.'
      );
      return;
    }
    this.openModal({ lc });
    if (lc) {
      // this.editedRowModal = this.revertType(lc);
      this.editedRowTable = lc;
    }
  }

  delete(lc: any) {
    if (this.addRows.length == 0) {
      this.alert(
        'error',
        'Acción no permitida',
        'No se permite alteración de registros previos.'
      );
      return;
    }
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        // this.lcSource.remove(lc);
        // let row = this.revertType(lc);
        // let idx = this.addRows.findIndex(
        //   c => JSON.stringify(c) == JSON.stringify(row)
        // );
        // if (idx != -1) {
        //   this.addRows.splice(idx, 1);
        // }
      }
    });
  }

  addRow(lc: any) {
    let arr = [lc];
    // arr = this.modifyType(arr);
    // this.lcSource.append(arr[0]);
    // this.layout == 'RFC'
    //   ? (this.rfcTotalItems = this.lcSource.count())
    //   : (this.clientIdTotalItems = this.lcSource.count());
    this.addRows.push(lc);
  }

  editRow(lc: any) {
    let arr = [lc];
    // arr = this.modifyType(arr);
    // this.lcSource.update(this.editedRowTable, arr[0]);
    let idx = this.addRows.findIndex(
      c => JSON.stringify(c) == JSON.stringify(this.editedRowModal)
    );
    if (idx != -1) {
      this.addRows[idx] = lc;
    }
  }

  saveRows() {
    console.log(this.addRows);
    this.onLoadToast(
      'success',
      'Líneas de Captura',
      'Registros agregados exitosamente'
    );
  }

  reworkSelect(data: any) {
    this.reworkEntries = data;
  }

  rework() {
    this.alertQuestion(
      'question',
      '¿Desea continuar?',
      'La siguiente operación reprocesará el evento',
      'Sí'
    ).then(question => {
      if (question.isConfirmed) {
        console.log(this.reworkEntries);
        this.onLoadToast(
          'success',
          'Reproceso',
          'El reproceso se ejecutó con éxito'
        );
      }
    });
  }

  exportExcel() {
    const filename: string = 'Líneas_de_Captura';
    this.lcsSource.getAll().then((data: any) => {
      this.excelService.export(data, { filename });
    });
  }

  onTabSelected(event: any) {
    console.log('Tab seleccionado', event);
  }

  dateToday() {
    const fecha = new Date();
    const isoDateString = fecha.toISOString();
    this.fechaHoy = isoDateString.split('T')[0];
  }

  generateWhereClause(
    tipoProc: string,
    evento: string,
    lote: string,
    fecInsert: Date,
    estatus: number,
    idOperacion: string,
    param02: string,
    param03: string
  ): string {
    let whereClause: string = '1 = 1';

    if (tipoProc === 'TMP_LC_COMER') {
      if (evento !== null && evento !== undefined) {
        whereClause += ` AND ID_EVENTO IN (${evento})`;
      }

      if (lote !== null && lote !== undefined) {
        whereClause += ` AND ID_LOTE IN (${lote})`;
      }

      if (fecInsert !== null && fecInsert !== undefined) {
        const formattedDate = fecInsert.toLocaleDateString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        whereClause += ` AND TRUNC(FEC_INSERT) = TO_DATE('${formattedDate}', 'MM/DD/YYYY')`;
      }

      if (estatus !== null && estatus !== undefined) {
        whereClause += ` AND ESTATUS = ${estatus}`;
      }

      if (idOperacion !== null && idOperacion !== undefined) {
        whereClause += ` AND ID_OPERACION IN (${idOperacion})`;
      }
    }

    if (whereClause === '1 = 1') {
      whereClause = ''; // No es necesario incluir WHERE si no hay condiciones.
    } else {
      whereClause = whereClause.replace('1 = 1 AND ', ''); // Remover la primera ocurrencia de '1 = 1 AND'
    }

    return whereClause;
  }
}
