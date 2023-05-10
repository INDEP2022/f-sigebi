import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, skip } from 'rxjs';
import {
  convertFormatDate,
  generateUrlOrPath,
  showAlert,
  showQuestion,
  showToast,
} from 'src/app/common/helpers/helpers';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ITmpLcComer } from 'src/app/core/models/ms-captureline/captureline';
import { CapturelineService } from 'src/app/core/services/ms-captureline/captureline.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { GuarantyService } from 'src/app/core/services/ms-guaranty/guaranty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AddLcModalComponent } from '../components/add-lc-modal/add-lc-modal.component';
import { TableCheckPortalDialogComponent } from '../components/table-check-portal-dialog/table-check-portal-dialog.component';
import { TableCheckboxComponent } from '../components/table-checkbox/table-checkbox.component';
import { loadCheckLc } from '../tools/load-check';
import {
  SETTING_BATCH_REWORK,
  SETTING_CLIENT_ID,
  SETTING_DATA,
  SETTING_LCS,
  SETTING_RFC,
  SETTING_RFC_REWORK,
} from './massive-conversion-columns';

@Component({
  selector: 'app-massive-conversion-main',
  templateUrl: './massive-conversion-main.component.html',
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

  form = new FormGroup({
    eventId: new FormControl(null),
    batchId: new FormControl(null),
    status: new FormControl(null),
    operationId: new FormControl(null),
    insertDate: new FormControl(null),
    validityDate: new FormControl(null),
  });

  dataSource = new LocalDataSource();
  rfcSource = new LocalDataSource();
  clientSource = new LocalDataSource();
  lcsSource = new LocalDataSource();
  isLoadingLcs = false;
  pathGetBath = generateUrlOrPath('catalog', 'batch', true);

  constructor(
    private excelService: ExcelService,
    private modalService: BsModalService,
    private capturelineService: CapturelineService,
    private guarantyService: GuarantyService,
    private comerEventService: ComerEventosService,
    private httpClient: HttpClient
  ) {
    super();
  }

  ngOnInit(): void {
    this.rfcSettings.columns = this.modifyColumns(this.rfcSettings.columns);
    this.clientIdSettings.columns = this.modifyColumns(
      this.clientIdSettings.columns
    );

    this.dataParams.pipe(skip(1)).subscribe(params => {
      this.searchData(params);
    });
    this.lcsParams.pipe(skip(1)).subscribe(params => {
      this.searchLcs(params);
    });
  }

  searchEvent(): void {
    const eventId = this.form.controls['eventId'].value;
    if (!eventId) {
      showToast({
        title: 'Error',
        text: 'Debe ingresar un evento',
        icon: 'warning',
      });
      return;
    }
    this.enabledOrDisabledControl('eventId', false);
    this.comerEventService.getComerEventById(eventId).subscribe({
      next: (event: any) => {
        // this.enabledOrDisabledControl('eventId', true);
        console.log({ event });
        this.selectedEvent = event || null;
      },
      error: () => {
        this.enabledOrDisabledControl('eventId', true);
        showToast({
          title: 'Error',
          text: 'No se encontró el evento',
          icon: 'warning',
        });
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
    this.form.controls['batchId'].setValue(null);
    this.form.controls['status'].setValue(null);
    this.form.controls['operationId'].setValue(null);
    this.form.controls['insertDate'].setValue(null);
    this.form.controls['validityDate'].setValue(null);
  }

  consultInServer() {
    if (!this.validConsult()) {
      showToast({
        text: 'No se ha insertado ningún filtro de búsqueda.',
        icon: 'warning',
        title: 'Atención',
      });
      this.form.markAllAsTouched();
      return;
    }
    this.searchData();
    this.searchLcs();
  }

  searchData(list?: ListParams) {
    this.loading = true;
    const params = this.makeFiltersParams(list).getParams();
    this.capturelineService.getTmpLcComer(params).subscribe({
      next: res => {
        this.loading = false;
        this.dataSource.load(res.data);
        this.dataTotalItems = res.count;
        this.loading = false;
      },
      error: () => {
        this.dataSource.load([]);
        this.loading = false;
      },
    });
  }

  searchLcs(listParams?: ListParams) {
    this.isLoadingLcs = true;
    //TODO: decirle a Eduardo que haga opcional el campo de validityDate
    const paramsPaginate = {
      page: listParams?.page || 1,
      limit: listParams?.limit || 10,
    };
    this.capturelineService
      .postComerRefGuaranteesSearch({ ...this.form.value, ...paramsPaginate })
      .subscribe({
        next: res => {
          this.isLoadingLcs = false;
          this.lcsSource.load(res.data);
          this.lcsTotalItems = res.count;

          this.isLoadingLcs = false;
        },
        error: () => {
          this.lcsSource.load([]);
          this.isLoadingLcs = false;
        },
      });
  }

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
  onClickLoadFile(event: any, type: 'rfc' | 'client_id') {
    showQuestion({
      text: `¿Está seguro de que desea insertar el archivo por ${type}?`,
      title: 'Insertar archivo',
      confirmButtonText: 'Si, insertar',
      cancelButtonText: 'No, cancelar',
      icon: 'question',
    }).then(result => {
      if (result.isConfirmed) {
        this.isLoadingLoadFile = true;
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pmode', 'W');
        let url = '';
        if (type === 'client_id') {
          url =
            'http://sigebimsdev.indep.gob.mx/massivecaptureline/api/v1/application/pupInsertRecord';
        } else {
          url =
            'http://sigebimsdev.indep.gob.mx/massivecaptureline/api/v1/application/pupInsertRecordMassively';
        }

        this.httpClient.post(url, formData).subscribe({
          next: res => {
            showToast({ text: 'Éxito al insertar a datos', title: 'Éxito' });
            this.isLoadingLoadFile = false;
            event.target.value = null;
          },
          error: err => {
            console.log({ err });
            showAlert({
              icon: 'error',
              text:
                err?.error?.message ||
                'Ups! ocurrió un error al insertar los datos vuelve a intentarlo',
            });
            this.isLoadingLoadFile = false;
            event.target.value = null;
          },
        });
      }
    });
  }

  //#endregion on click load file

  isLoadingExportFile = false;
  exportFile() {
    if (!this.form.get('eventId').value) {
      showToast({
        text: 'No se ha seleccionado un evento',
        icon: 'error',
      });
      return;
    }
    this.isLoadingExportFile = true;
    const params = this.makeFiltersParams().getParams();
    this.guarantyService.getComerRefGuarantees(params).subscribe({
      next: res => {
        this.isLoadingExportFile = false;
        this.excelService.export(res.data, { filename: 'LCS' });
        this.searchLcs();
      },
      error: err => {
        this.isLoadingExportFile = false;
      },
    });
  }

  insertTmpLcComer(tmpLcComer: ITmpLcComer) {
    this.capturelineService.postTmpLcComer(tmpLcComer).subscribe({
      next: () => {
        showToast({
          text: 'Se insertó correctamente',
          icon: 'success',
        });
        this.searchData();
      },
      error: () => {
        showToast({
          text: 'Ocurrió un error al insertar',
          icon: 'error',
        });
      },
    });
  }

  loadChecks() {
    if (!this.selectedEvent) {
      showToast({
        text: this.form.get('eventId').value
          ? 'El evento seleccionado no existe, por favor ingrese uno correcto'
          : ' No se ha seleccionado un evento',
        icon: 'warning',
        title: 'Advertencia',
      });
      return;
    }

    loadCheckLc(
      this.form,
      this.capturelineService,
      this.openDialogCheckPortal.bind(this)
    );
    // .then((res: any) => {
    //   if (res.isConfirmed) {
    //     this.openDialogCheckPortal();
    //   }
    // });
    // if (this.form.invalid) {
    //   showToast({
    //     text: 'No se ha insertado ningún filtro de búsqueda.',
    //     title: 'Advertencia',
    //     icon: 'warning',
    //   });
    //   this.form.markAllAsTouched();
    //   return;
    // }
    // const { validityDate, eventId } = this.form.value;
    // let p_FLAG = Boolean(validityDate);

    // showQuestion({
    //   text: validityDate
    //     ? `La fecha de vigencia será ${convertFormatDate(
    //         validityDate
    //       )}. ¿Desea continuar?`
    //     : 'La Fecha de vigencia se tomará de la tabla. ¿Desea continuar?',
    // }).then((res: any) => {
    //   if (res.isConfirmed) {
    //     this.capturelineService
    //       .postLoadCheckPortal({
    //         event: eventId,
    //         validation: convertFormatDate(validityDate),
    //         p_FLAG,
    //       })
    //       .subscribe({
    //         next: () => {
    //           showToast({
    //             text: 'Se cargaron los checks correctamente',
    //             icon: 'success',
    //           });
    //           this.searchData();
    //         },
    //         error: () => {},
    //       });
    //   }
    // });
  }

  generateLcs() {
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
      this.onLoadToast(
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
      this.onLoadToast(
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

  // getData(listParams?: ListParams, notValidate: boolean = false): void {
  //   if (this.form.invalid && !notValidate) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }
  //   this.loading = true;
  //   const params = this.makeParams();
  //   params.page = listParams?.page || 1;
  //   params.limit = listParams?.pageSize || 10;
  //   this.capturelineService.getTmpLcComer(params.getParams()).subscribe({
  //     next: (res: any) => {
  //       this.loading = false;
  //       this.dataColumns.load(res.data);
  //       this.totalEntries = res.count;
  //     },
  //     error: (err: any) => {
  //       this.loading = false;
  //       this.onLoadToast('error', 'Error', err);
  //     },
  //   });
  // }

  // makeParams(): FilterParams {
  //   const params = new FilterParams();
  //   const values = this.form.value as any;
  //   params.addFilter('eventId', values.eventId);
  //   if (values.batchId) params.addFilter('batchId', values.batchId);
  //   if (values.status) params.addFilter('status', values.status);
  //   if (values.operationId) params.addFilter('operationId', values.operationId);
  //   if (values.insertDate)
  //     params.addFilter('insertDate', convertFormatDate(values.insertDate));
  //   if (values.validityDate)
  //     params.addFilter('validityDate', convertFormatDate(values.validityDate));
  //   if (values.rfc) params.addFilter('rfc', values.rfc, SearchFilter.IN);
  //   if (values.clientId)
  //     params.addFilter('clientId', values.clientId, SearchFilter.IN);
  //   return params;
  // }
}
