import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { catchError, lastValueFrom, map, of, throwError } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { EventProgrammingService } from 'src/app/core/services/ms-event-programming/event-programing.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { IndicatorsParametersService } from 'src/app/core/services/ms-parametergood/indicators-parameter.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { ClassWidthAlert } from 'src/app/core/shared/alert-class';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { SweetAlertIcon } from 'sweetalert2';
import { settingKeysProceedings } from '../scheduled-maintenance-1/scheduled-maintenance-detail/const';
import { KeyProceedingsService } from './key-proceedings.service';

export class CaptureEventUpdateForm {
  type = new FormControl('RT', [Validators.required]);
  prog = new FormControl(null, [Validators.required]);
  transference = new FormControl(null);
  area = new FormControl(null);
  user = new FormControl(null);
  folio = new FormControl(null);
  year = new FormControl(null);
  month = new FormControl(null);
  keysProceedings = new FormControl(null, [
    Validators.maxLength(60),
    Validators.required,
  ]);
}
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
  @Input() formInput: FormGroup;
  @Input() formField = 'claveActa';
  @Input() set statusActaValue(value: string) {
    console.log(value);
    if (!value) return;
    if (value.includes('CERRAD')) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    // this.updateSettingsKeysProceedings(value);
    // this.updateTableKeysProceedings(this.claveActa);
  }
  @Input() numFile: number;
  @Input() typeProceeding: string;
  transfers = new DefaultSelect();
  users = new DefaultSelect();
  form = this.fb.group(new CaptureEventUpdateForm());
  typeEvent: string;
  authUser: string = null;
  authUserName: string = null;
  // row: any;
  // rowOldValue: any;
  update = false;
  disabled = false;
  tempType: string;
  tempTrans: string;
  tempArea: string;
  tempFolio: string;
  typeOtions = new DefaultSelect([
    { value: 'RT', label: 'RT' },
    { value: 'A', label: 'A' },
    { value: 'D', label: 'D' },
  ]);

  progOptions = new DefaultSelect([
    { value: 'R', label: 'R' },
    { value: 'E', label: 'E' },
  ]);
  // areas: IRNomencla[];
  areas = new DefaultSelect();
  private _toastrService = inject(ToastrService);
  source: LocalDataSource;
  settingKeysProceedings = settingKeysProceedings;
  constructor(
    private fb: FormBuilder,
    private dynamicCatalogService: DynamicCatalogService,
    private authService: AuthService,
    private expedientService: ExpedientService,
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

    // this.users = [{ value: this.authUser, title: this.authUser }];
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
        map(res => (res ? res.data[0].procedureArea.id : null))
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

  async getAreas(params: FilterParams) {
    const stage = await this.getStage();
    const delegation = await this.getUserDelegation();
    params.addFilter('stageedo', stage);
    params.addFilter('numberDelegation2', delegation);
    this.rNomenclaService.getAll(params.getParams()).subscribe({
      next: resp => {
        this.areas = new DefaultSelect(resp.data, resp.count);
      },
    });
    // const params: FilterParams = new FilterParams();
    // const stage = await this.getStage();
    // const delegation = await this.getUserDelegation();
    // params.addFilter('stageedo', stage);
    // params.addFilter('numberDelegation2', delegation);
    // params.limit = 1000;
    // this.rNomenclaService.getAll(params.getParams()).subscribe({
    //   next: resp => {
    //     this.areas = resp.data;
    //     this.settingKeysProceedings = {
    //       ...this.settingKeysProceedings,
    //       columns: {
    //         ...this.settingKeysProceedings.columns,
    //         3: {
    //           ...this.settingKeysProceedings.columns[3],
    //           editor: {
    //             type: 'list',
    //             config: {
    //               selectText: 'Select',
    //               list: this.areas.map(item => {
    //                 return { value: item.delegation, title: item.delegation };
    //               }),
    //             },
    //           },
    //         },
    //       },
    //     };
    //   },
    // });
  }

  async ngOnInit() {
    // this.updateSettingsKeysProceedings('ABIERTA');
    // const params = new FilterParams();
    // await this.getAreas();
    if (this.typeProceeding) {
      this.typeEvent = await this.getType();
    }
    // if (this.claveActa) {
    //   this.form.get('keysProceedings').setValue(this.claveActa);
    // }
    console.log(this.claveActa);
    if (this.claveActa) {
      this.updateTableKeysProceedings(this.claveActa);
      await this.transferClick();
    }
  }

  get claveActa() {
    return this.formInput
      ? this.formInput.get(this.formField)
        ? this.formInput.get(this.formField).value
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
    const { type, area, year } = this.registerControls;

    const body = {
      typeProceeding,
      type: type.value,
      regional: area.value,
      year: `${year.value}`.slice(-2),
    };
    return await lastValueFrom(
      this.eventProgrammingService.getFolio(body).pipe(
        catchError(error => {
          if (error.status >= 500) {
            this.alert('error', 'Error', 'Error en la localización del folio');
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

  get registerControls() {
    return this.form.controls;
  }

  private setProg() {
    const prog = this.typeProceeding == 'EVENTREC' ? 'R' : 'E';
    this.registerControls.prog.setValue(prog);
  }

  private async getExpedientById(id: string | number) {
    return await lastValueFrom(
      this.expedientService
        .getById(id)
        .pipe(map(expedient => expedient.identifier))
    );
  }

  async getTransferType(expedientId: string | number) {
    return await lastValueFrom(
      this.dynamicCatalogService.getIncapAndClave(expedientId).pipe(
        map(res => {
          return { type: res.data[0].coaelesce, key: res.data[0].clave };
        })
      )
    );
  }

  private async getTTrans(expedientId: string | number) {
    return await lastValueFrom(
      this.dynamicCatalogService
        .getDescEmisora(expedientId)
        .pipe(map(res => res.data[0].desc_emisora))
    );
  }

  private async getTAseg(expedientId: string | number) {
    return await lastValueFrom(
      this.dynamicCatalogService
        .getClaveCTransparente(expedientId)
        .pipe(map(res => res.data[0].clave))
    );
  }

  private async transferInit() {
    // debugger;
    const expedientnumber = this.numFile;
    const { transference, type } = this.registerControls;
    if (!expedientnumber) {
      transference.reset();
      return;
    }
    const identifier = await this.getExpedientById(expedientnumber);
    if (identifier == 'TRANS') {
      const { type, key } = await this.getTransferType(expedientnumber);
      if (type == 'E') {
        const tTrans = await this.getTTrans(expedientnumber);
        transference.setValue(tTrans);
      } else {
        transference.setValue(key);
      }
    } else {
      const tAseg = await this.getTAseg(expedientnumber);
      transference.setValue(tAseg);
    }
    const transferent = transference.value;
    this.transfers = new DefaultSelect([
      { value: transferent, label: transferent },
    ]);
    if (['PGR', 'PJF'].includes(transference.value)) {
      type.setValue('A');
      this.typeOtions = new DefaultSelect([{ value: 'A', label: 'A' }]);
    } else {
      type.setValue('RT');
      this.typeOtions = new DefaultSelect([{ value: 'RT', label: 'RT' }]);
    }
  }

  async transferClick() {
    await this.transferInit();
    await this.generateCve();
  }

  async generateCve() {
    const {
      keysProceedings,
      year,
      month,
      user,
      area,
      folio,
      prog,
      transference,
      type,
    } = this.registerControls;
    // debugger;
    const splitedArea = keysProceedings?.value?.split('/');
    const _area = splitedArea ? splitedArea[3] : null;
    const cons = splitedArea ? splitedArea[5] : null;
    const existingTrans = splitedArea ? splitedArea[2] : null;
    const _user = splitedArea ? splitedArea[4] : null;
    const _month = splitedArea ? splitedArea[7] : null;
    const _year = splitedArea ? splitedArea[6] : null;
    if (existingTrans) {
      if (['PGR', 'PJF'].includes(existingTrans)) {
        // if (type.value !== 'A') {
        //   this.alert(
        //     'error',
        //     'Tipo',
        //     'No permitido para transferente PGR y PJF'
        //   );
        // }
        type.setValue('A');
      } else {
        type.setValue('RT');
      }
    }
    this.setProg();
    const currentDate = new Date();
    const currentMonth = `${currentDate.getMonth() + 1}`.padStart(2, '0');
    if (!year.value) {
      year.setValue(_year ?? currentDate.getFullYear().toString().slice(2, 4));
    }
    if (!month.value) month.setValue(_month ?? currentMonth);
    if (!user.value) user.setValue(_user ?? this.authUser);
    this.users = new DefaultSelect([
      {
        value: _user ?? this.authUser,
        label: _user ?? this.authUserName,
      },
    ]);
    this.validateTransfer(type.value ?? 'RT', transference.value);
    console.log({ area, _area });
    if (!area.value) {
      if (!_area) {
        this.tempArea = null;
        this.tempFolio = null;
      } else {
        this.tempArea = _area;
        this.tempFolio = cons;
      }
    } else {
      if (cons) {
        this.tempArea = area.value;
        area.setValue(this.tempArea);
        this.tempFolio = cons;
        folio.setValue(this.tempFolio);
      } else {
        this.tempArea = area.value;
        const indicator = await this.getProceedingType();
        const _folio = await this.getFolio(indicator.certificateType);
        this.tempFolio = `${_folio}`.padStart(5, '0');
      }
    }
    if (!this.tempType) {
      this.tempType = 'RT';
    }
    folio.setValue(this.tempFolio);
    const cve = `${this.tempType ?? ''}/${prog.value ?? ''}/${
      this.tempTrans ?? ''
    }/${this.tempArea ?? ''}/${user.value ?? ''}/${this.tempFolio ?? ''}/${
      year.value ?? ''
    }/${month.value ?? ''}`;
    // .slice(-2)
    if (!area.value && this.tempArea) {
      area.setValue(this.tempArea);
    }
    if (!transference.value && this.tempTrans) {
      transference.setValue(this.tempTrans);
      this.transfers = new DefaultSelect([
        { value: this.tempTrans, label: this.tempTrans },
      ]);
    }
    keysProceedings.setValue(cve);
  }

  invalidTransfer() {
    this.tempTrans = null;
    this.alert('error', 'Error', 'La transferente no es válida para este tipo');
  }

  validateTransfer(_type: string, transfer: string) {
    // this.global.tran = transfer;
    const { keysProceedings } = this.registerControls;
    const splitedArea = keysProceedings?.value?.split('/');
    const cveType = splitedArea ? splitedArea[0] : null;
    const tran = splitedArea ? splitedArea[2] : null;
    const area = splitedArea ? splitedArea[3] : null;
    if (!transfer) {
      if (!cveType) {
        this.tempType = _type;
      } else {
        this.tempType = cveType == _type ? cveType : _type;
      }

      if (!tran) {
        this.tempTrans = null;
      } else {
        if (
          (tran == 'PGR' || tran == 'PJF') &&
          (_type == 'D' || _type == 'A')
        ) {
          this.tempTrans = tran;
          this.tempType = _type;
        } else if (
          tran != 'PGR' &&
          tran != 'PJF' &&
          (_type == 'D' || _type == 'A')
        ) {
          this.invalidTransfer();
        } else if ((tran == 'PGR' || tran == 'PJF') && _type == 'RT') {
          this.invalidTransfer();
        } else if (tran != 'PGR' && tran != 'PJF' && _type == 'RT') {
          this.tempTrans = tran;
          this.tempType = _type;
        }
      }
    } else {
      if (
        (transfer == 'PGR' || transfer == 'PJF') &&
        (_type == 'D' || _type == 'A')
      ) {
        this.tempTrans = transfer;
        this.tempType = _type;
      } else if (
        transfer != 'PGR' &&
        transfer != 'PJF' &&
        (_type == 'D' || _type == 'A')
      ) {
        this.invalidTransfer();
      } else if ((transfer == 'PGR' || transfer == 'PJF') && _type == 'RT') {
        this.invalidTransfer();
      } else if (transfer != 'PGR' && transfer != 'PJF' && _type == 'Rt') {
        this.tempTrans = transfer;
        this.tempType = _type;
      }
    }
  }

  private updateTableKeysProceedings(keysProceedings: string) {
    if (!keysProceedings) return;
    if (keysProceedings.length === 0) return;
    // let keys = [];
    let key = {};
    keysProceedings.split('/').forEach((letra, index) => {
      // key = { ...key, [index]: letra };
      if (index === 0) {
        this.registerControls.type.setValue(letra);
      }
      if (index === 1) {
        this.registerControls.prog.setValue(letra);
      }
      if (index === 2) {
        this.registerControls.transference.setValue(letra);
      }
      if (index === 3) {
        this.registerControls.area.setValue(letra);
      }
      if (index === 4) {
        this.users = new DefaultSelect([
          {
            value: letra ?? this.authUser,
            label: letra ?? this.authUserName,
          },
        ]);
        this.registerControls.user.setValue(letra);
      }
      if (index === 5) {
        this.registerControls.folio.setValue(letra);
      }
      if (index === 6) {
        this.registerControls.year.setValue(letra);
      }
      if (index === 7) {
        this.registerControls.month.setValue(letra);
      }
      if (index === 7) {
        this.registerControls.keysProceedings.setValue(keysProceedings);
      }
    });
  }
}
