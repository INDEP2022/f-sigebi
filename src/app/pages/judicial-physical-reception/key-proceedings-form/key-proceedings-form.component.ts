import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { catchError, lastValueFrom, map, of, throwError } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IRNomencla } from 'src/app/core/models/ms-parametergood/r-nomencla.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { EventProgrammingService } from 'src/app/core/services/ms-event-programming/event-programing.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { IndicatorsParametersService } from 'src/app/core/services/ms-parametergood/indicators-parameter.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { ClassWidthAlert } from 'src/app/core/shared/alert-class';
import { SharedModule } from 'src/app/shared/shared.module';
import { SweetAlertIcon } from 'sweetalert2';
import { settingKeysProceedings } from '../scheduled-maintenance-1/scheduled-maintenance-detail/const';
import { KeyProceedingsService } from './key-proceedings.service';

@Component({
  selector: 'app-key-proceedings-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './key-proceedings-form.component.html',
  styleUrls: ['./key-proceedings-form.component.scss'],
})
export class KeyProceedingsFormComponent
  extends ClassWidthAlert
  implements OnInit
{
  @Input() form: FormGroup;
  @Input() formField = 'claveActa';
  @Input() set statusActaValue(value: string) {
    console.log(value);
    if (!value) return;
    if (value.includes('CERRAD')) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    this.updateSettingsKeysProceedings(value);
    this.updateTableKeysProceedings(this.claveActa);
  }
  @Input() typeProceeding: string;

  typeEvent: string;
  authUser: string = null;
  authUserName: string = null;
  row: any;
  rowOldValue: any;
  disabled = false;
  // typeOtions = [
  //   { value: 'RT', label: 'RT' },
  //   { value: 'A', label: 'A' },
  //   { value: 'D', label: 'D' },
  // ];

  // progOptions = [
  //   { value: 'R', label: 'R' },
  //   { value: 'E', label: 'E' },
  // ];
  areas: IRNomencla[];
  users: any[] = [];
  private _toastrService = inject(ToastrService);
  source: LocalDataSource;
  settingKeysProceedings = settingKeysProceedings;
  constructor(
    private authService: AuthService,
    private gParameterService: GoodParametersService,
    private segAccessXAreas: SegAcessXAreasService,
    private rNomenclaService: RNomenclaService,
    private keyProceedingsService: KeyProceedingsService,
    private indicatorParametersService: IndicatorsParametersService,
    private eventProgrammingService: EventProgrammingService
  ) {
    super();
    this.authUser = this.authService.decodeToken().preferred_username;
    // this.authUserName = this.authService.decodeToken().name;
    // console.log(this.authUser);

    this.users = [{ value: this.authUser, title: this.authUser }];
    this.settingKeysProceedings = {
      ...this.settingKeysProceedings,
      columns: {
        ...this.settingKeysProceedings.columns,
        4: {
          ...this.settingKeysProceedings.columns[4],
          editor: {
            type: 'list',
            config: { selectText: 'Select', list: this.users },
          },
        },
      },
    };
    // console.log(this.settingKeysProceedings);
  }

  protected onLoadToast(icon: SweetAlertIcon, title: string, text?: string) {
    const throwToast = {
      success: (title: string, text: string) =>
        this._toastrService.success(text, title),
      info: (title: string, text: string) =>
        this._toastrService.info(text, title),
      warning: (title: string, text: string) =>
        this._toastrService.warning(text, title),
      error: (title: string, text: string) =>
        this._toastrService.error(text, title),
      question: (title: string, text: string) =>
        this._toastrService.info(text, title),
    };
    return throwToast[icon](title, text);
  }

  private async getStage() {
    return await lastValueFrom(
      this.gParameterService
        .getPhaseEdo()
        .pipe(map(response => response.stagecreated))
    );
  }

  private getType() {
    const params = new FilterParams();
    params.addFilter('certificateType', this.typeProceeding);
    return lastValueFrom(
      this.indicatorParametersService.getAll(params.getParams()).pipe(
        catchError(() => of(null)),
        map(res => res.data[0].procedureArea.id)
      )
    );
  }

  private async getUserDelegation() {
    const params = new FilterParams();
    params.addFilter('user', this.authUser);
    return lastValueFrom(
      this.segAccessXAreas
        .getAll(params.getParams())
        .pipe(map(res => res.data[0].delegationNumber))
    );
  }

  private async getAreas() {
    const params: FilterParams = new FilterParams();
    const stage = await this.getStage();
    const delegation = await this.getUserDelegation();
    params.addFilter('stageedo', stage);
    params.addFilter('numberDelegation2', delegation);
    params.limit = 1000;
    this.rNomenclaService.getAll(params.getParams()).subscribe({
      next: resp => {
        this.areas = resp.data;
        this.settingKeysProceedings = {
          ...this.settingKeysProceedings,
          columns: {
            ...this.settingKeysProceedings.columns,
            3: {
              ...this.settingKeysProceedings.columns[3],
              editor: {
                type: 'list',
                config: {
                  selectText: 'Select',
                  list: this.areas.map(item => {
                    return { value: item.delegation, title: item.delegation };
                  }),
                },
              },
            },
          },
        };
      },
    });
  }

  async ngOnInit() {
    // this.updateSettingsKeysProceedings('ABIERTA');

    await this.getAreas();
    if (this.typeProceeding) {
      this.typeEvent = await this.getType();
    }
    this.updateTableKeysProceedings(this.claveActa);
  }

  get claveActa() {
    return this.form
      ? this.form.get(this.formField)
        ? this.form.get(this.formField).value
        : ''
      : '';
  }

  private async getProceedingType() {
    const params = new FilterParams();
    params.addFilter('procedureArea', this.typeEvent);
    return await lastValueFrom(
      this.indicatorParametersService.getAll(params.getParams()).pipe(
        catchError(error => {
          this.alert('error', 'Error', 'No se localizo el tipo de acta');
          return throwError(() => error);
        }),

        map(response => response.data[0])
      )
    );
  }

  private async getFolio(typeProceeding: string) {
    // const { type, area, year } = this.registerControls;

    const body = {
      typeProceeding,
      type: this.row[0],
      regional: this.row[3],
      year: (this.row[6] + '').slice(-2),
    };
    return await lastValueFrom(
      this.eventProgrammingService.getFolio(body).pipe(
        catchError(error => {
          if (error.status >= 500) {
            this.onLoadToast(
              'error',
              'Error',
              'Error en la localización del folio'
            );
          }
          return throwError(() => error);
        }),
        map(response => response.folio)
      )
    );
  }

  private isNullCell(item: any, column: number) {
    if (item[column]) {
      if (item[column] + ''.trim() === '') {
        return true;
      }
      return false;
    }
    return true;
  }

  private nullCells(data: any) {
    let validation = false;
    for (let index = 0; index < 6; index++) {
      validation = validation || this.isNullCell(data, index);
    }
    return validation;
  }

  async updateRow(data: any) {
    // let newData = { ...data };
    debugger;
    let { newData, confirm } = data;
    // if (this.nullCells(newData)) {
    //   this.alert('error', 'Clave Acta', 'Llene todos los campos');
    //   return;
    // }
    if (newData[0]) {
      if (this.typeEvent === 'RF') {
        newData[1] = 'R';
      } else {
        newData[1] = 'E';
      }
    }

    const currentDate = new Date();
    const currentMonth = `${currentDate.getMonth() + 1}`.padStart(2, '0');

    if (!newData[4]) {
      newData[4] =
        this.authUser.length > 22
          ? this.authUser.substring(0, 22)
          : this.authUser;
    }
    if (!newData[6]) {
      newData[6] = currentDate.getFullYear();
    }
    if (!newData[7]) {
      newData[7] = currentMonth;
    }
    const existingTrans = this.rowOldValue[2];
    if (existingTrans == 'PGR' || existingTrans == 'PJF') {
      newData[0] = 'A';
    } else {
      newData[0] = 'RT';
    }
    this.validateTransfer(newData[0] ?? 'RT', newData[2]);

    if (!newData[3]) {
      if (!this.rowOldValue[3]) {
        newData[5] = null;
        newData[3] = null;
      } else {
        newData[5] = this.rowOldValue[5];
        newData[3] = this.rowOldValue[3];
      }
    } else {
      const indicator = await this.getProceedingType();
      const _folio = await this.getFolio(indicator.certificateType);
      if (!_folio) {
        this.revert();
        return;
      }
      newData[5] = `${_folio}`.padStart(5, '0');
    }
    if (!newData[0]) {
      newData[0] = 'RT';
    }
    confirm.resolve(newData);
    this.fillActKey(newData);
  }

  invalidTransfer() {
    this.row[2] = null;
    this.onLoadToast(
      'error',
      'Error',
      'La transferente no es válida para este tipo'
    );
  }

  private validateTransfer(_type: string, transfer: string) {
    // this.global.tran = transfer;
    // const { keysProceedings } = this.registerControls;
    // const splitedArea = keysProceedings?.value?.split('/');
    const cveType = this.rowOldValue ? this.rowOldValue[0] : null;
    const tran = this.rowOldValue ? this.rowOldValue[2] : null;
    const area = this.rowOldValue ? this.rowOldValue[3] : null;
    if (!transfer) {
      if (!cveType) {
        this.row[0] = _type;
      } else {
        this.row[0] = cveType == _type ? cveType : _type;
      }

      if (!tran) {
        this.row[2] = null;
      } else {
        if (
          (tran == 'PGR' || tran == 'PJF') &&
          (_type == 'D' || _type == 'A')
        ) {
          this.row[2] = tran;
          this.row[0] = _type;
        } else if (
          tran != 'PGR' &&
          tran != 'PJF' &&
          (_type == 'D' || _type == 'A')
        ) {
          console.log('1');
          this.invalidTransfer();
        } else if ((tran == 'PGR' || tran == 'PJF') && _type == 'RT') {
          console.log('2');
          this.invalidTransfer();
        } else if (tran != 'PGR' && tran != 'PJF' && _type == 'RT') {
          this.row[2] = tran;
          this.row[0] = _type;
        }
      }
    } else {
      if (
        (transfer == 'PGR' || transfer == 'PJF') &&
        (_type == 'D' || _type == 'A')
      ) {
        this.row[2] = transfer;
        this.row[0] = _type;
      } else if (
        transfer != 'PGR' &&
        transfer != 'PJF' &&
        (_type == 'D' || _type == 'A')
      ) {
        console.log('3');
        this.invalidTransfer();
      } else if ((transfer == 'PGR' || transfer == 'PJF') && _type == 'RT') {
        console.log('4');
        this.invalidTransfer();
      } else if (transfer != 'PGR' && transfer != 'PJF' && _type == 'Rt') {
        this.row[2] = transfer;
        this.row[0] = _type;
      }
      // }
    }
  }

  // updateKeysProcedding(event: any) {
  //   console.log(event);
  //   let { newData, confirm } = event;
  //   confirm.resolve(newData);
  //   this.fillActKey(newData);
  // }

  private fillActKey(newData: any) {
    this.form
      .get(this.formField)
      .setValue(
        newData[0] +
          '/' +
          newData[1] +
          '/' +
          newData[2] +
          '/' +
          newData[3] +
          '/' +
          newData[4] +
          '/' +
          newData[5] +
          '/' +
          newData[6] +
          '/' +
          newData[7]
      );
  }

  haveError(row: any) {
    return this.haveErrorRequired(row) || this.haveNumericError(row);
  }

  haveErrorRequired(row: any) {
    // console.log(row);
    return !row || (row && (row + '').trim() == '');
  }

  haveNumericError(row: any) {
    var RE = /^[0-9]+$/;
    if (RE.test(row)) {
      return false;
    } else {
      return true;
    }
  }

  revert() {
    // console.log(this.row, this.rowOldValue);
    this.row = { ...this.rowOldValue };
  }

  private updateTableKeysProceedings(keysProceedings: string) {
    if (!keysProceedings) return;
    if (keysProceedings.length === 0) return;
    let keys = [];
    let key = {};
    keysProceedings.split('/').forEach((letra, index) => {
      key = { ...key, [index]: letra };
    });
    key = { ...key, editing: false };
    keys.push(key);
    this.row = { ...key };
    this.rowOldValue = { ...key };
    this.source = new LocalDataSource(keys);
  }

  private updateSettingsKeysProceedings(value: string) {
    this.settingKeysProceedings = {
      ...this.settingKeysProceedings,
      actions: {
        ...this.settingKeysProceedings.actions,
        edit: value.toUpperCase().includes('ABIERT'),
      },
    };
    this.updateTableKeysProceedings(this.claveActa);
  }
}
