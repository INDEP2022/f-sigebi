import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  PGR_PAPERWORK_MAILBOX_COLUMNS,
  PGR_TRANSFERS_COLUMNS,
} from './subject-register-columns';

//params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Rxjs
import { BehaviorSubject, takeUntil } from 'rxjs';
// Interfaces
// Service
import compareDesc from 'date-fns/compareDesc';
import { ExcelService } from 'src/app/common/services/excel.service';
import { FormFieldsToParamsService } from 'src/app/common/services/form-fields-to-params.service';
import { IPgrTransfer } from 'src/app/core/models/ms-interfacefgr/ms-interfacefgr.interface';
import { IManagamentProcessPgr } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { PgrSubjectsRegisterService } from '../service/pgr-subjects-register.service';
import {
  DOWNLOAD_PROCESS,
  ERROR_EXPORT,
  ERROR_FORM,
  ERROR_FORM_FECHA,
  ERROR_FORM_NOT_INSERT,
  ERROR_FORM_SEARCH_AVERIGUACION_PREVIA,
  ERROR_FORM_SEARCH_OFICIO_AVERIGUACION_PREVIA,
  ERROR_FORM_SEARCH_OFICIO_PGR,
  ERROR_INTERNET,
  INFO_DOWNLOAD,
  NOT_FOUND_MESSAGE,
} from '../utils/pgr-subjects-register.messages';

@Component({
  selector: 'app-subjects-register',
  templateUrl: './subjects-register.component.html',
  styles: [],
})
export class SubjectsRegisterComponent extends BasePage implements OnInit {
  cordinators = new DefaultSelect();
  processStatus = new DefaultSelect();
  // Gestion SAT
  mailboxSettings = {
    ...this.settings,
    columns: { ...PGR_PAPERWORK_MAILBOX_COLUMNS },
  };
  pgrForm: FormGroup;
  listGestionPgr: IManagamentProcessPgr[] = [];
  paramsGestionPgr = new BehaviorSubject<ListParams>(new ListParams());
  loadingGestionPgr: boolean = false;
  totalGestionPgr: number = 0;
  // PGR Transferencia
  transfersSettings = {
    ...this.settings,
    columns: { ...PGR_TRANSFERS_COLUMNS },
  };
  pgrTransferForm: FormGroup;
  listPgrTransferencia: IPgrTransfer[] = [];
  paramsPgrTransferencia = new BehaviorSubject<ListParams>(new ListParams());
  loadingPgrTransferencia: boolean = false;
  totalPgrTransferencia: number = 0;
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
    private pgrSubjectsRegisterService: PgrSubjectsRegisterService,
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

  prepareForm() {
    this.pgrForm = this.fb.group({
      from: [null],
      to: [null],
      issue: [null, [Validators.maxLength(30)]],
      delegationNumber: [null],
      officeNumber: [null, [Validators.maxLength(30)]],
      processStatus: [null],
    });
    this.pgrTransferForm = this.fb.group({
      pgrGoodNumber: [null, [Validators.maxLength(400)]],
      saeGoodNumber: [null, [Validators.maxLength(400)]],
      estatus: [null, [Validators.maxLength(60)]],
      office: [null],
      aveprev: [null],
    });
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
    this.paramsGestionPgr
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.consultarPgrForm(true));
    this.paramsPgrTransferencia
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.consultarPgrTransferForm(false, true));
  }

  /**
   * Set empty
   */
  setEmptyGestionPgr() {
    this.listGestionPgr = [];
    this.totalGestionPgr = 0;
  }

  setEmptyPgrTransferencia() {
    this.listPgrTransferencia = [];
    this.totalPgrTransferencia = 0;
  }
  /**
   * Set empty
   */

  /**
   * Obtener el listado de Coordinadores de acuerdo a los criterios de búsqueda
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getCoordinador(params: ListParams) {
    let subscription = this.pgrSubjectsRegisterService
      .getCoordinadorBySearch(params)
      .subscribe(
        data => {
          this.cordinators = new DefaultSelect(
            data.data.map(i => {
              i.description = '#' + i.id + ' -- ' + i.description;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        err => {
          this.onLoadToast(
            'error',
            'Error',
            err.status === 0 ? ERROR_INTERNET : err.error.message
          );
          subscription.unsubscribe();
        },
        () => {
          subscription.unsubscribe();
        }
      );
  }

  /**
   * Obtener el listado de Estatus del proceso de acuerdo a los criterios de búsqueda
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getStatusProcess(params: ListParams) {
    params.take = 20;
    params['order'] = 'DESC';
    let subscription = this.pgrSubjectsRegisterService
      .getStatusBySearch(params)
      .subscribe(
        data => {
          this.processStatus = new DefaultSelect(
            data.data.map(i => {
              i.description = '#' + i.id + ' -- ' + i.description;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        err => {
          this.onLoadToast(
            'error',
            'Error',
            err.status === 0 ? ERROR_INTERNET : err.error.message
          );
          subscription.unsubscribe();
        },
        () => {
          subscription.unsubscribe();
        }
      );
  }

  /**
   * Dejar en blanco el campo de delegación
   */
  resetDelegation() {
    this.pgrForm.get('delegationNumber').setValue(null);
    this.pgrForm.get('delegationNumber').updateValueAndValidity();
  }

  /**
   * Dejar en blanco el campo de delegación
   */
  resetStatusProcess() {
    this.pgrForm.get('processStatus').setValue(null);
    this.pgrForm.get('processStatus').updateValueAndValidity();
  }

  validationFieldsGestionPgr(start: boolean = false) {
    let valid = false;
    if (
      this.pgrForm.get('from').value ||
      this.pgrForm.get('issue').value ||
      this.pgrForm.get('delegationNumber').value ||
      this.pgrForm.get('officeNumber').value ||
      this.pgrForm.get('processStatus').value
    ) {
      valid = true;
    } else {
      if (!start) {
        this.onLoadToast('warning', '¡Advertencia!', ERROR_FORM_NOT_INSERT);
      }
    }
    return valid;
  }
  validationFieldsPgrTransferencia(start: boolean = false) {
    let valid = false;
    if (
      this.pgrTransferForm.get('pgrGoodNumber').value ||
      this.pgrTransferForm.get('saeGoodNumber').value ||
      this.pgrTransferForm.get('estatus').value
    ) {
      valid = true;
    } else {
      if (!start) {
        this.onLoadToast('warning', '¡Advertencia!', ERROR_FORM_NOT_INSERT);
      }
    }
    return valid;
  }

  consultarPgrForm(start: boolean = false) {
    if (this.pgrForm.valid) {
      let validDate = null;
      if (!this.pgrForm.get('from').value && !this.pgrForm.get('to').value) {
        validDate = 0;
      } else {
        validDate = compareDesc(
          this.pgrForm.get('from').value,
          this.pgrForm.get('to').value
        );
      }
      if (this.pgrForm.get('from').value && !this.pgrForm.get('to').value) {
        validDate = 0;
      }
      if (validDate >= 0) {
        // Validar que se tengan al menos un campo para realizar la consulta
        if (this.validationFieldsGestionPgr(start)) {
          this.loadingGestionPgr = true;
          this.setEmptyGestionPgr();
          this.getGestionTramitePgr();
        }
      } else {
        this.onLoadToast('warning', 'Fechas incorrectas', ERROR_FORM_FECHA);
      }
    } else {
      this.onLoadToast('error', 'Error', ERROR_FORM);
    }
  }

  consultarPgrTransferForm(
    resetValues: boolean = false,
    start: boolean = false
  ) {
    if (this.pgrTransferForm.valid) {
      // Validar que se tengan al menos un campo para realizar la consulta
      if (this.validationFieldsPgrTransferencia(start)) {
        this.loadingPgrTransferencia = true;
        this.setEmptyPgrTransferencia();
        this.getPgrTransferencia(resetValues);
      }
    } else {
      this.onLoadToast('error', 'Error', ERROR_FORM);
    }
  }

  /**
   * Obtener el listado de Gestion de Tramites
   */
  getGestionTramitePgr() {
    let filtrados = this.formFieldstoParamsService.validFieldsFormToParams(
      this.pgrForm.value,
      this.paramsGestionPgr.value,
      this.filtroPaginado,
      'filter',
      'processEntryDate'
    );
    this.pgrSubjectsRegisterService
      .getGestionTramiteSatBySearch(filtrados)
      .subscribe({
        next: data => {
          if (data.count > 0) {
            this.listGestionPgr = data.data;
            this.totalGestionPgr = data.count;
          } else {
            this.onLoadToast(
              'warning',
              '',
              NOT_FOUND_MESSAGE('Gestión Trámites PGR')
            );
          }
          this.loadingGestionPgr = false;
        },
        error: error => {
          this.loadingGestionPgr = false;
          this.errorGet(error);
        },
      });
  }

  /**
   * Obtener el listado de la vista PGR Transferencia
   */
  async getPgrTransferencia(resetValues: boolean = false) {
    let filtrados =
      await this.formFieldstoParamsService.validFieldsFormToParams(
        this.pgrTransferForm.value,
        this.paramsPgrTransferencia.value,
        this.filtroPaginado,
        'filter'
      );
    if (resetValues == true) {
      this.pgrTransferForm.get('aveprev').reset();
      this.pgrTransferForm.get('office').reset();
      this.pgrTransferForm.updateValueAndValidity();
    }
    this.pgrSubjectsRegisterService
      .getPgrTransferenciaBySearch(filtrados)
      .subscribe({
        next: data => {
          if (data.count > 0) {
            this.listPgrTransferencia = data.data;
            this.totalPgrTransferencia = data.count;
          } else {
            this.onLoadToast(
              'warning',
              '',
              NOT_FOUND_MESSAGE('Transferencias PGR')
            );
          }
          this.loadingPgrTransferencia = false;
        },
        error: error => {
          this.loadingPgrTransferencia = false;
          this.errorGet(error);
        },
      });
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
   * Exportar a XLSX
   */
  exportXlsx(opcion: string, data: any[]) {
    if (data.length == 0) {
      this.onLoadToast('warning', 'Reporte', ERROR_EXPORT);
    }
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.excelService.export(data, {
      filename:
        opcion == 'gestion'
          ? `GestionPgr__Listado_Tramites_PGR${new Date().getTime()}`
          : `PgrTransferencia_Listado_Cves_PGR${new Date().getTime()}`,
    });
  }

  /**
   * Obtener el listado de Gestion de Tramites
   */
  getReportTramitePgr() {
    let objParams: any = {
      from: this.pgrForm.value.from,
      to: this.pgrForm.value.to,
      issue: this.pgrForm.value.issue,
      delegationNumber: this.pgrForm.value.delegationNumber,
      officeNumber: this.pgrForm.value.officeNumber,
      statusProcedure: this.pgrForm.value.processStatus,
    };

    // procedureNumber: number;
    // no_tramite;
    // statusProcedure: string;
    // estatus_tramite;
    // procedureAdmissionDate: Date;
    // fec_ingreso_tramite;
    // whell: number;
    // no_volante;
    // proceedingNumber: number;
    // no_expediente;
    // issue: string;
    // asunto;
    // officeNumber: string;
    // no_oficio;
    // delegationNumber: number;
    // no_delegacion;
    // turnedUser: string;
    // usr_turnado;

    /**
 * 
      from: [null],
      to: [null],
      issue: [null, [Validators.maxLength(30)]],
      delegationNumber: [null],
      officeNumber: [null, [Validators.maxLength(30)]],
      processStatus: [null],
    });

    
    this.pgrTransferForm = this.fb.group({
      pgrGoodNumber: [null, [Validators.maxLength(400)]],
      saeGoodNumber: [null, [Validators.maxLength(400)]],
      estatus: [null, [Validators.maxLength(60)]],
      office: [null],
      aveprev: [null],
    });

 */

    let filtrados = this.formFieldstoParamsService.validFieldsFormToParams(
      objParams,
      this.paramsGestionPgr.value,
      this.filtroPaginado,
      'filter',
      'procedureAdmissionDate'
    );
    delete filtrados.page;
    // delete filtrados.limit;
    filtrados.limit = this.maxLimitReport; // Valor de cero para obtener todos los resultados
    this.downloading = true;
    this.pgrSubjectsRegisterService
      .getReport(filtrados, 'gestion_pgr')
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data.base64) {
            this.downloadFile(
              data.base64,
              `GestionSat__Listado_Tramites_PGR${new Date().getTime()}`
            );
          } else {
            this.onLoadToast(
              'warning',
              '',
              NOT_FOUND_MESSAGE('Gestión Trámites PGR')
            );
          }
          this.loadingGestionPgr = false;
        },
        error: error => {
          this.loadingGestionPgr = false;
          this.errorGet(error);
        },
      });
  }
  /**
   * Obtener el listado de Transferencia PGR
   */
  getReportTransferenciaPgr() {
    let filtrados = this.formFieldstoParamsService.validFieldsFormToParams(
      this.pgrTransferForm.value,
      this.paramsPgrTransferencia.value,
      this.filtroPaginado,
      'filter',
      'processEntryDate'
    );
    delete filtrados.page;
    // delete filtrados.limit;
    filtrados.limit = 0; // Valor de cero para obtener todos los resultados
    this.pgrSubjectsRegisterService
      .getReport(filtrados, 'transferencia_pgr')
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data.base64) {
            this.downloadFile(data.base64, 'Listado_Cves_PGR');
          } else {
            this.onLoadToast(
              'warning',
              '',
              NOT_FOUND_MESSAGE('Transferencias PGR')
            );
          }
          this.loadingPgrTransferencia = false;
        },
        error: error => {
          this.loadingPgrTransferencia = false;
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

  selectRow(row: any) {
    this.pgrTransferForm.get('aveprev').setValue(row.issue);
    this.pgrTransferForm.get('office').setValue(row.officeNumber);
    this.pgrTransferForm.updateValueAndValidity();
    if (row.issue && row.officeNumber) {
      this.onLoadToast(
        'info',
        '¡Búsqueda!',
        ERROR_FORM_SEARCH_OFICIO_AVERIGUACION_PREVIA
      );
    } else {
      if (row.issue) {
        this.onLoadToast(
          'info',
          '¡Búsqueda!',
          ERROR_FORM_SEARCH_AVERIGUACION_PREVIA
        );
      }
      if (row.officeNumber) {
        this.onLoadToast('info', '¡Búsqueda!', ERROR_FORM_SEARCH_OFICIO_PGR);
      }
    }
    setTimeout(() => {
      this.consultarPgrTransferForm(true, true);
    }, 100);
  }
}
