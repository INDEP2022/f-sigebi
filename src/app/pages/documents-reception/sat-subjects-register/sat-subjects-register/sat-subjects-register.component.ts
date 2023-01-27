import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

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
import { SatSubjectsRegisterService } from '../service/sat-subjects-register.service';
import { ISatSubjectsRegisterGestionSat } from './utils/interfaces/sat-subjects-register.gestion-sat.interface';
import { ISatSubjectsRegisterSatTransferencia } from './utils/interfaces/sat-subjects-register.sat-transferencia.interface';
import {
  ERROR_EXPORT,
  ERROR_FORM,
  ERROR_FORM_FECHA,
  ERROR_INTERNET,
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
    columns: SAT_PAPERWORK_MAILBOX_COLUMNS,
  };
  satForm: FormGroup;
  listGestionSat: ISatSubjectsRegisterGestionSat[] = [];
  paramsGestionSat = new BehaviorSubject<ListParams>(new ListParams());
  loadingGestionSat: boolean = false;
  totalGestionSat: number = 0;
  // Sat Transferencia
  transfersSettings = { ...this.settings, columns: SAT_TRANSFER_COLUMNS };
  satTransferForm: FormGroup;
  listSatTransferencia: ISatSubjectsRegisterSatTransferencia[] = [];
  paramsSatTransferencia = new BehaviorSubject<ListParams>(new ListParams());
  loadingSatTransferencia: boolean = false;
  totalSatTransferencia: number = 0;
  // Filtro de paginado
  filtroPaginado: string[] = ['page', 'limit'];

  constructor(
    private fb: FormBuilder,
    private satSubjectsRegisterService: SatSubjectsRegisterService,
    private excelService: ExcelService,
    private datePipe: DatePipe
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
      issue: [null],
      delegationNumber: [null],
      officeNumber: [null, Validators.pattern(STRING_PATTERN)],
      processStatus: [null, Validators.pattern(STRING_PATTERN)],
    });

    this.satTransferForm = this.fb.group({
      satOnlyKey: [null, [Validators.maxLength(30)]],
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

  consultarSatTransferForm() {
    if (this.satTransferForm.valid) {
      this.loadingSatTransferencia = true;
      this.setEmptySatTransferencia();
      this.getSatTransferencia();
    } else {
      this.onLoadToast('error', 'Error', ERROR_FORM);
    }
  }

  /**
   * Revisar el objeto que se pasa como parametro y se retorna el mismo objeto con los campos vacios si es que son null o undefined
   * @param object Objeto del formulario
   * @param params Se pasa el objeto donde se encuentran los parametros de la paginación
   * @param validParams Listado de parametros en string a utilizar en la paginación
   * @param pref Prefijo a utilizar en el filtro. Por ejemplo 'filter'
   * @param nameDateBtw Nombre de el campo para el filtro de rango de fechas
   * @returns
   */
  validarCampos(
    object: any,
    params: ListParams,
    validParams: any[],
    pref: string,
    nameDateBtw?: string
  ) {
    let clearObj: ListParams = {};
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const param = params[key];
        if (param) {
          if (validParams.includes(key)) {
            // Guardar los parametros que se envian de la paginación
            clearObj[key] = param;
          }
        }
      }
    }
    let from: Date;
    let to: Date;
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        var element = object[key];
        // Guardar la fecha de inicio
        if (key == 'from') {
          from = element;
        }
        // Guardar la fecha máxima
        if (key == 'to') {
          if (element) {
            to = element;
          } else {
            element = new Date();
            to = element;
          }
        }
        if (element) {
          if (from && to) {
            // Validar rangos de fechas
            let fromParse = this.datePipe.transform(from, 'yyyy-MM-dd');
            let toParse = this.datePipe.transform(to, 'yyyy-MM-dd');
            clearObj[pref + '.' + nameDateBtw] = `$btw:${fromParse},${toParse}`;
            from = null;
            to = null;
          }
          if (key != 'from' && key != 'to') {
            // Agregar campos a filtrar
            clearObj[pref + '.' + key] = `$eq:${encodeURI(element)}`;
          }
        }
      }
    }
    return clearObj;
  }

  /**
   * Obtener el listado de Gestion de Tramites
   */
  getGestionTramiteSat() {
    let filtrados = this.validarCampos(
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
          this.listGestionSat = data.data;
          this.totalGestionSat = data.count;
          this.loadingGestionSat = false;
        },
        error: error => {
          this.loadingGestionSat = false;
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
      err.status === 0 ? ERROR_INTERNET : err.message
    );
  }

  /**
   * Obtener el listado de la vista SAT Transferencia
   */
  async getSatTransferencia() {
    let filtrados = await this.validarCampos(
      this.satTransferForm.value,
      this.paramsSatTransferencia.value,
      this.filtroPaginado,
      'filter'
    );
    this.satTransferForm.get('job').reset();
    this.satSubjectsRegisterService
      .getSatTransferenciaBySearch(filtrados)
      .subscribe({
        next: data => {
          if (data.data) {
            this.listSatTransferencia = data.data;
            this.totalSatTransferencia = data.count;
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
              i.description = '#' + i.noRegister + ' -- ' + i.description;
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
            err.status === 0 ? ERROR_INTERNET : err.message
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
            err.status === 0 ? ERROR_INTERNET : err.message
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
          ? `GestionSat_${new Date().getTime()}`
          : `SatTransferencia_${new Date().getTime()}`,
    });
  }

  selectRow(row: any) {
    this.satTransferForm.get('satProceedings').setValue(row.proceedingsNumber);
    this.satTransferForm.get('job').setValue(row.officeNumber);
    this.satTransferForm.updateValueAndValidity();
    setTimeout(() => {
      this.consultarSatTransferForm();
    }, 100);
  }
}
