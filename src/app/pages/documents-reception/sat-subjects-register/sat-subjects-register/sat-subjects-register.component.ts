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
import { ExcelService } from 'src/app/common/services/excel.service';
import { SatSubjectsRegisterService } from '../service/sat-subjects-register.service';
import { ISatSubjectsRegisterGestionSat } from './utils/interfaces/sat-subjects-register.gestion-sat.interface';
import { ISatSubjectsRegisterSatTransferencia } from './utils/interfaces/sat-subjects-register.sat-transferencia.interface';
import {
  ERROR_FORM,
  ERROR_INTERNET,
} from './utils/sat-subjects-register.messages';

@Component({
  selector: 'app-sat-subjects-register',
  templateUrl: './sat-subjects-register.component.html',
  styles: [],
})
export class SatSubjectsRegisterComponent extends BasePage implements OnInit {
  cordinators = new DefaultSelect();
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

  constructor(
    private fb: FormBuilder,
    private satSubjectsRegisterService: SatSubjectsRegisterService,
    private excelService: ExcelService
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

  initPage() {
    this.paramsGestionSat
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGestionTramiteSat());
    this.paramsSatTransferencia
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSatTransferencia());
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
      satOnlyKey: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      satProceedings: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(150)],
      ],
      satHouseGuide: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      satMasterGuide: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
    });
  }

  consultarSatForm() {
    if (this.satForm.valid) {
      this.setEmptyGestionSat();
      this.getGestionTramiteSat();
    } else {
      this.onLoadToast('error', 'Error', ERROR_FORM);
    }
  }

  consultarSatTransferForm() {
    if (this.satTransferForm.valid) {
      this.setEmptySatTransferencia();
      this.getSatTransferencia();
    } else {
      this.onLoadToast('error', 'Error', ERROR_FORM);
    }
  }

  /**
   * Revisar el objeto que se pasa como parametro y se retorna el mismo objeto con los campos vacios si es que son null o undefined
   * @param object Objeto del formulario
   * @returns
   */
  validarCampos(object: any, params: any) {
    let clearObj: ListParams = {
      page: params.value.inicio,
      limit: params.value.pageSize,
    };
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const element = object[key];
        if (element) {
          clearObj['filter.' + key] = `$eq:${encodeURI(element)}`;
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
      this.paramsGestionSat
    );
    this.loadingGestionSat = true;
    this.satSubjectsRegisterService
      .getGestionTramiteSatBySearch(filtrados)
      .subscribe({
        next: data => {
          console.log('DATA', data.data);
          this.listGestionSat = data.data;
          this.totalGestionSat = data.count;
          this.loadingGestionSat = false;
        },
        error: error => {
          this.errorGestionSat(error);
        },
      });
  }
  errorGestionSat(err: any) {
    this.onLoadToast(
      'error',
      'Error',
      err.status === 0 ? ERROR_INTERNET : err.message
    );
    this.loadingGestionSat = false;
  }

  /**
   * Obtener el listado de la vista SAT Transferencia
   * http://localhost:4200/pages/commercialization/catalogs/brands-sub-brands
   */
  getSatTransferencia() {
    this.loadingSatTransferencia = true;
    let filtrados = this.validarCampos(
      this.satTransferForm.value,
      this.paramsSatTransferencia
    );
    this.satSubjectsRegisterService
      .getSatTransferenciaBySearch(filtrados)
      .subscribe({
        next: data => {
          console.log('DATA', data.data);
          if (data.data) {
            this.listSatTransferencia = data.data;
            this.totalSatTransferencia = data.count;
          }
          this.loadingSatTransferencia = false;
        },
        error: error => {
          this.errorGestionSat(error);
        },
      });
  }
  errorSatTransferencia(err: any) {
    this.onLoadToast(
      'error',
      'Error',
      err.status === 0 ? ERROR_INTERNET : err.message
    );
    this.loadingSatTransferencia = false;
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
              i.description =
                'No. Reg. ' + i.noRegister + ' -- ' + i.description;
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
   * Exportar a XLSX
   */
  exportXlsx(opcion: string, data: any[]) {
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.excelService.export(data, {
      filename:
        opcion == 'gestion'
          ? `GestionSat_${new Date().getTime()}`
          : `SatTransferencia_${new Date().getTime()}`,
    });
  }
}
