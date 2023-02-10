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
  ERROR_EXPORT,
  ERROR_FORM,
  ERROR_FORM_FECHA,
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
  base64Preview = '';

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
      .subscribe(() => this.consultarSatForm());
    this.paramsSatTransferencia
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.consultarSatTransferForm());
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
      issue: [null, [Validators.maxLength(30)]],
      delegationNumber: [null],
      officeNumber: [null, [Validators.maxLength(30)]],
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

  consultarSatForm() {
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
        this.loadingGestionSat = true;
        this.setEmptyGestionSat();
        this.getGestionTramiteSat();
      } else {
        this.onLoadToast('warning', 'Fechas incorrectas', ERROR_FORM_FECHA);
      }
    } else {
      this.onLoadToast('error', 'Error', ERROR_FORM);
    }
  }

  consultarSatTransferForm(resetValues: boolean = false) {
    if (this.satTransferForm.valid) {
      this.loadingSatTransferencia = true;
      this.setEmptySatTransferencia();
      this.getSatTransferencia(resetValues);
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
    let filtrados = this.formFieldstoParamsService.validFieldsFormToParams(
      this.satForm.value,
      this.paramsGestionSat.value,
      this.filtroPaginado,
      'filter',
      'processEntryDate'
    );
    delete filtrados.page;
    delete filtrados.limit;
    this.satSubjectsRegisterService.getReport(filtrados).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data.base64) {
          this.downloadFile(data.base64, 'Reporte_Tramite_Bien');
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
  downloadFile(base64: any, fileName: any) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.target = '_blank';
    downloadLink.click();
    // const src = `data:application/pdf;base64,${base64}`;
    // const link = document.createElement('a');
    // link.href = src;
    // link.download = fileName;
    // link.click();

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
    let filtrados =
      await this.formFieldstoParamsService.validFieldsFormToParams(
        this.satTransferForm.value,
        this.paramsSatTransferencia.value,
        this.filtroPaginado,
        'filter'
      );
    if (resetValues == true) {
      this.satTransferForm.get('job').reset();
      this.satTransferForm.updateValueAndValidity();
    }
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
    let subscription = this.satSubjectsRegisterService
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
    let subscription = this.satSubjectsRegisterService
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
    this.satForm.get('delegationNumber').setValue(null);
    this.satForm.get('delegationNumber').updateValueAndValidity();
  }

  /**
   * Dejar en blanco el campo de delegación
   */
  resetStatusProcess() {
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
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.excelService.export(data, {
      filename:
        opcion == 'gestion'
          ? `GestionSat__Listado_Tramites_SAT${new Date().getTime()}`
          : `SatTransferencia_Listado_Cves_SAT${new Date().getTime()}`,
    });
  }

  selectRow(row: any) {
    this.satTransferForm.get('satProceedings').setValue(row.proceedingsNumber);
    this.satTransferForm.get('job').setValue(row.officeNumber);
    this.satTransferForm.updateValueAndValidity();
    setTimeout(() => {
      this.consultarSatTransferForm(true);
    }, 100);
  }
}
