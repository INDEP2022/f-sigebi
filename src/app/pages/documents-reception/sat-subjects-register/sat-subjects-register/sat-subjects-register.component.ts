import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import {
  SAT_PAPERWORK_MAILBOX_COLUMNS,
  SAT_TRANSFER_COLUMNS,
} from './sat-subjects-register-columns';

//params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Rxjs
import { BehaviorSubject, takeUntil } from 'rxjs';
// Services
import compareDesc from 'date-fns/compareDesc';
import { ExcelService } from 'src/app/common/services/excel.service';
import { FormFieldsToParamsService } from 'src/app/common/services/form-fields-to-params.service';
import { SatSubjectsRegisterService } from '../service/sat-subjects-register.service';
// Interfaces
import { IManagamentProcessSat } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { ISatSubjectsRegisterSatTransferencia } from './utils/interfaces/sat-subjects-register.sat-transferencia.interface';
import {
  DOWNLOAD_PROCESS,
  ERROR_EXPORT,
  ERROR_FORM,
  ERROR_FORM_FECHA,
  ERROR_FORM_NOT_INSERT,
  ERROR_FORM_SEARCH_EXPEDIENTE_SAT,
  ERROR_FORM_SEARCH_OFICIO_EXPEDIENTE_SAT,
  ERROR_FORM_SEARCH_OFICIO_SAT,
  ERROR_INTERNET,
  INFO_DOWNLOAD,
  NOT_FOUND_MESSAGE,
} from './utils/sat-subjects-register.messages';

@Component({
  selector: 'app-sat-subjects-register',
  templateUrl: './sat-subjects-register.component.html',
  styles: [],
})
export class SatSubjectsRegisterComponent extends BasePage implements OnInit {
  cordinators = new DefaultSelect();
  processStatus = new DefaultSelect();
  // Gestion SAT
  mailboxSettings = {
    ...this.settings,
    columns: { ...SAT_PAPERWORK_MAILBOX_COLUMNS },
  };
  satForm: FormGroup;
  listGestionSat: IManagamentProcessSat[] = [];
  paramsGestionSat = new BehaviorSubject<ListParams>(new ListParams());
  loadingGestionSat: boolean = false;
  totalGestionSat: number = 0;
  // Sat Transferencia
  transfersSettings = {
    ...this.settings,
    columns: { ...SAT_TRANSFER_COLUMNS },
  };
  satTransferForm: FormGroup;
  listSatTransferencia: ISatSubjectsRegisterSatTransferencia[] = [];
  paramsSatTransferencia = new BehaviorSubject<ListParams>(new ListParams());
  loadingSatTransferencia: boolean = false;
  totalSatTransferencia: number = 0;
  // Filtro de paginado
  filtroPaginado: string[] = ['page', 'limit'];
  INFO_DOWNLOAD = INFO_DOWNLOAD;
  DOWNLOAD_PROCESS = DOWNLOAD_PROCESS;
  base64Preview = '';
  maxLimitReport = 20000;
  downloading: boolean = false;
  downloadingTransferente: boolean = false;

  constructor(
    private fb: FormBuilder,
    private satSubjectsRegisterService: SatSubjectsRegisterService,
    private excelService: ExcelService,
    private formFieldstoParamsService: FormFieldsToParamsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setSettingsTables();
    this.prepareForm();
    this.initPage();
  }

  setSettingsTables() {
    this.mailboxSettings.actions.add = false;
    this.mailboxSettings.actions.edit = false;
    this.mailboxSettings.actions.delete = false;
    this.transfersSettings.actions.add = false;
    this.transfersSettings.actions.edit = false;
    this.transfersSettings.actions.delete = false;
  }

  async initPage() {
    this.paramsGestionSat
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.consultarSatForm(true));
    this.paramsSatTransferencia
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.consultarSatTransferForm(false, true));
  }

  /**
   * Set empty
   */
  setEmptyGestionSat() {
    this.listGestionSat = [];
    this.totalGestionSat = 0;
  }

  setEmptySatTransferencia() {
    this.listSatTransferencia = [];
    this.totalSatTransferencia = 0;
  }
  /**
   * Set empty
   */

  prepareForm() {
    this.satForm = this.fb.group({
      from: [null],
      to: [null],
      issue: [null, [Validators.maxLength(400)]],
      delegationNumber: [null],
      officeNumber: [null, [Validators.maxLength(50)]],
      processStatus: [null],
    });

    this.satTransferForm = this.fb.group({
      satOnlyKey: [null, [Validators.maxLength(25)]],
      satProceedings: [null, [Validators.maxLength(150)]],
      satHouseGuide: [null, [Validators.maxLength(60)]],
      satMasterGuide: [null, [Validators.maxLength(50)]],
      job: [null],
    });
  }

  validationFieldsGestionSat(start: boolean = false) {
    let valid = false;
    if (
      this.satForm.get('from').value ||
      this.satForm.get('issue').value ||
      this.satForm.get('delegationNumber').value ||
      this.satForm.get('officeNumber').value ||
      this.satForm.get('processStatus').value
    ) {
      valid = true;
    } else {
      if (!start) {
        this.onLoadToast('warning', '¡Advertencia!', ERROR_FORM_NOT_INSERT);
      }
    }
    return valid;
  }
  validationFieldsSatTransferencia(start: boolean = false) {
    let valid = false;
    if (
      this.satTransferForm.get('satOnlyKey').value ||
      this.satTransferForm.get('satProceedings').value ||
      this.satTransferForm.get('satHouseGuide').value ||
      this.satTransferForm.get('satMasterGuide').value ||
      this.satTransferForm.get('job').value
    ) {
      valid = true;
    } else {
      if (!start) {
        this.onLoadToast('warning', '¡Advertencia!', ERROR_FORM_NOT_INSERT);
      }
    }
    return valid;
  }

  consultarSatForm(start: boolean = false) {
    if (this.satForm.valid) {
      let validDate = null;
      if (!this.satForm.get('from').value && !this.satForm.get('to').value) {
        validDate = 0;
      } else {
        validDate = compareDesc(
          this.satForm.get('from').value,
          this.satForm.get('to').value
        );
      }
      if (this.satForm.get('from').value && !this.satForm.get('to').value) {
        validDate = 0;
      }
      if (validDate >= 0) {
        // Validar que se tengan al menos un campo para realizar la consulta
        if (this.validationFieldsGestionSat(start)) {
          this.loadingGestionSat = true;
          this.setEmptyGestionSat();
          this.getGestionTramiteSat();
        }
      } else {
        this.onLoadToast('warning', 'Fechas incorrectas', ERROR_FORM_FECHA);
      }
    } else {
      this.onLoadToast('error', 'Error', ERROR_FORM);
    }
  }

  consultarSatTransferForm(
    resetValues: boolean = false,
    start: boolean = false
  ) {
    if (this.satTransferForm.valid) {
      // Validar que se tengan al menos un campo para realizar la consulta
      if (this.validationFieldsSatTransferencia(start)) {
        this.loadingSatTransferencia = true;
        this.setEmptySatTransferencia();
        this.getSatTransferencia(resetValues);
      }
    } else {
      this.onLoadToast('error', 'Error', ERROR_FORM);
    }
  }

  /**
   * Obtener el listado de Gestion de Tramites
   */
  getGestionTramiteSat() {
    let filtrados = this.formFieldstoParamsService.validFieldsFormToParams(
      this.satForm.value,
      this.paramsGestionSat.value,
      this.filtroPaginado,
      'filter',
      'processEntryDate'
    );
    this.satSubjectsRegisterService
      .getGestionTramiteSatBySearch(filtrados)
      .subscribe({
        next: data => {
          if (data.count > 0) {
            this.listGestionSat = data.data;
            this.totalGestionSat = data.count;
          } else {
            this.onLoadToast(
              'warning',
              '',
              NOT_FOUND_MESSAGE('Gestión Trámites')
            );
          }
          this.loadingGestionSat = false;
        },
        error: error => {
          this.loadingGestionSat = false;
          this.errorGet(error);
        },
      });
  }

  /**
   * Obtener el listado de Gestion de Tramites
   */
  getReportTramiteSat() {
    let objParams: any = {
      from: this.satForm.value.from,
      to: this.satForm.value.to,
      issue: this.satForm.value.issue,
      delegationNumber: this.satForm.value.delegationNumber,
      tradeNumber: this.satForm.value.officeNumber,
      procedureStatus: this.satForm.value.processStatus,
    };
    let filtrados = this.formFieldstoParamsService.validFieldsFormToParams(
      objParams,
      this.paramsGestionSat.value,
      this.filtroPaginado,
      'filter',
      'dateEntryProcedure'
    );
    delete filtrados.page;
    // delete filtrados.limit;
    filtrados.limit = this.maxLimitReport; // Valor de cero para obtener todos los resultados
    this.downloading = true;
    this.satSubjectsRegisterService
      .getReport(filtrados, 'gestion_sat')
      .subscribe({
        next: (data: any) => {
          if (data.base64) {
            this.downloadFile(
              data.base64,
              `GestionSat__Listado_Tramites_SAT${new Date().getTime()}`
            );
          } else {
            this.onLoadToast(
              'warning',
              '',
              NOT_FOUND_MESSAGE('Gestión Trámites')
            );
          }
          this.downloading = false;
        },
        error: error => {
          this.downloading = false;
          this.errorGet(error);
        },
      });
  }

  /**
   * Obtener el listado de Transferencia SAT
   */
  getReportTransferenciaSat(filtroForm: boolean = false) {
    let objParams = {
      satCveUnique: this.satTransferForm.value.satOnlyKey,
      trade: this.satTransferForm.value.job,
      file: this.satTransferForm.value.satProceedings,
      satGuiaHouse: this.satTransferForm.value.satHouseGuide,
      satGuiaMaster: this.satTransferForm.value.satMasterGuide,
    };
    let filtrados = this.formFieldstoParamsService.validFieldsFormToParams(
      objParams,
      this.paramsSatTransferencia.value,
      this.filtroPaginado,
      'filter',
      'processEntryDate'
    );
    // delete filtrados.page;
    // delete filtrados.limit;
    if (filtroForm == true) {
      filtrados.limit = this.maxLimitReport; // Valor de cero para obtener todos los resultados
    }
    this.downloading = true;
    this.satSubjectsRegisterService
      .getReport(filtrados, 'transferencia_sat')
      .subscribe({
        next: (data: any) => {
          if (data.base64) {
            this.downloadFile(
              data.base64,
              `SatTransferencia_Listado_Cves_SAT${new Date().getTime()}`
            );
          } else {
            this.onLoadToast(
              'warning',
              '',
              NOT_FOUND_MESSAGE('Transferencias SAT')
            );
          }
          this.downloading = false;
        },
        error: error => {
          this.downloading = false;
          this.errorGet(error);
        },
      });
  }

  downloadFile(base64: any, fileName: any) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.target = '_blank';
    downloadLink.click();
    downloadLink.remove();
  }
  /**
   * Funcion de error de listados
   * @param err Error de la respuesta
   */
  errorGet(err: any) {
    this.onLoadToast(
      'error',
      'Error',
      err.status === 0 ? ERROR_INTERNET : err.error.message
    );
  }

  /**
   * Obtener el listado de la vista SAT Transferencia
   */
  async getSatTransferencia(resetValues: boolean = false) {
    if (resetValues == false) {
      this.satTransferForm.get('satProceedings').reset();
      this.satTransferForm.get('job').reset();
      this.satTransferForm.updateValueAndValidity();
    }
    let filtrados =
      await this.formFieldstoParamsService.validFieldsFormToParams(
        this.satTransferForm.value,
        this.paramsSatTransferencia.value,
        this.filtroPaginado,
        'filter'
      );
    this.satSubjectsRegisterService
      .getSatTransferenciaBySearch(filtrados)
      .subscribe({
        next: data => {
          if (data.count > 0) {
            this.listSatTransferencia = data.data;
            this.totalSatTransferencia = data.count;
          } else {
            this.onLoadToast(
              'warning',
              '',
              NOT_FOUND_MESSAGE('Transferencia SAT')
            );
          }
          this.loadingSatTransferencia = false;
        },
        error: error => {
          this.loadingSatTransferencia = false;
          this.errorGet(error);
        },
      });
  }

  /**
   * Obtener el listado de Coordinadores de acuerdo a los criterios de búsqueda
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getCoordinador(params: ListParams) {
    params['filter.description'] = '$ilike:' + params.text;
    delete params.take;
    delete params.text;
    if (params['search']) {
      delete params['search'];
    }
    let subscription = this.satSubjectsRegisterService
      .getCoordinadorBySearch(params)
      .subscribe({
        next: data => {
          this.cordinators = new DefaultSelect(
            data.data.map(i => {
              i.description = '#' + i.id + ' -- ' + i.description;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        error: err => {
          this.cordinators = new DefaultSelect();
          this.onLoadToast(
            'error',
            'Error',
            err.status === 0 ? ERROR_INTERNET : err.error.message
          );
          subscription.unsubscribe();
        },
      });
  }

  /**
   * Obtener el listado de Estatus del proceso de acuerdo a los criterios de búsqueda
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getStatusProcess(params: ListParams) {
    params.take = 10;
    params['orderColumn'] = 'id';
    params['order'] = 'DESC';
    params['filter.description'] = '$ilike:' + params.text;
    delete params.take;
    delete params.text;
    if (params['search']) {
      delete params['search'];
    }
    let subscription = this.satSubjectsRegisterService
      .getStatusBySearch(params)
      .subscribe({
        next: data => {
          this.processStatus = new DefaultSelect(
            data.data.map(i => {
              i.description = '#' + i.id + ' -- ' + i.description;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        error: err => {
          this.processStatus = new DefaultSelect();
          this.onLoadToast(
            'error',
            'Error',
            err.status === 0 ? ERROR_INTERNET : err.error.message
          );
          subscription.unsubscribe();
        },
      });
  }

  /**
   * Dejar en blanco el campo de delegación
   */
  resetDelegation() {
    this.satForm.get('delegationNumber').setValue(null);
    this.satForm.get('delegationNumber').updateValueAndValidity();
  }

  /**
   * Dejar en blanco el campo de delegación
   */
  resetStatusProcess() {
    this.satForm.get('processStatus').reset();
    this.satForm.get('processStatus').setValue(null);
    this.satForm.get('processStatus').updateValueAndValidity();
  }

  /**
   * Exportar a XLSX
   */
  exportXlsx(opcion: string, data: any[]) {
    if (data.length == 0) {
      this.onLoadToast('warning', 'Reporte', ERROR_EXPORT);
    }
    let dataChangeNames = this.setNombreData(opcion, data);
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.excelService.export(dataChangeNames, {
      filename:
        opcion == 'gestion'
          ? `GestionSat__Listado_Tramites_SAT${new Date().getTime()}`
          : `SatTransferencia_Listado_Cves_SAT${new Date().getTime()}`,
    });
  }

  setNombreData(opcion: string, data: any[]) {
    let dataSet: any[] = [];
    let gestionData = SAT_PAPERWORK_MAILBOX_COLUMNS;
    let transferData = SAT_TRANSFER_COLUMNS;
    data.forEach(elementData => {
      let newObj: any = {};
      for (const key in elementData) {
        if (Object.prototype.hasOwnProperty.call(elementData, key)) {
          if (opcion == 'gestion') {
            newObj[gestionData[key as keyof typeof gestionData].title] =
              elementData[key];
          } else {
            newObj[transferData[key as keyof typeof transferData].title] =
              elementData[key];
          }
        }
      }
      dataSet.push(newObj);
    });
    return dataSet;
  }

  selectRow(row: any) {
    if (row.proceedingsNumber && row.officeNumber) {
      this.satTransferForm
        .get('satProceedings')
        .setValue(row.proceedingsNumber);
      this.satTransferForm.get('job').setValue(row.officeNumber);
      this.satTransferForm.updateValueAndValidity();
      this.onLoadToast(
        'info',
        '¡Búsqueda!',
        ERROR_FORM_SEARCH_OFICIO_EXPEDIENTE_SAT
      );
    } else {
      if (row.proceedingsNumber) {
        this.satTransferForm
          .get('satProceedings')
          .setValue(row.proceedingsNumber);
        this.satTransferForm.updateValueAndValidity();
        this.onLoadToast(
          'info',
          '¡Búsqueda!',
          ERROR_FORM_SEARCH_EXPEDIENTE_SAT
        );
      }
      if (row.officeNumber) {
        this.satTransferForm.get('job').setValue(row.officeNumber);
        this.satTransferForm.updateValueAndValidity();
        this.onLoadToast('info', '¡Búsqueda!', ERROR_FORM_SEARCH_OFICIO_SAT);
      }
    }
    setTimeout(() => {
      this.consultarSatTransferForm(true, true);
    }, 300);
  }
}
