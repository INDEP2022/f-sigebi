import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IRNomencla } from 'src/app/core/models/ms-parametergood/r-nomencla.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { IndicatorsParametersService } from 'src/app/core/services/ms-parametergood/indicators-parameter.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-key-proceedings-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './key-proceedings-form.component.html',
  styleUrls: ['./key-proceedings-form.component.scss'],
})
export class KeyProceedingsFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() formField = 'claveActa';
  @Input() set statusActaValue(value: string) {
    if (value.includes('CERRAD')) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    this.updateTableKeysProceedings(this.claveActa);
    // this.updateSettingsKeysProceedings(value);
  }
  @Input() typeProceeding: string;
  typeEvent: string;
  authUser: string = null;
  authUserName: string = null;
  row: any;
  rowOldValue: any;
  disabled = false;
  typeOtions = [
    { value: 'RT', label: 'RT' },
    { value: 'A', label: 'A' },
    { value: 'D', label: 'D' },
  ];

  progOptions = [
    { value: 'R', label: 'R' },
    { value: 'E', label: 'E' },
  ];
  areas: IRNomencla[];
  users: any[] = [];
  // source: LocalDataSource;
  // settingKeysProceedings = settingKeysProceedings;
  constructor(
    private authService: AuthService,
    private gParameterService: GoodParametersService,
    private segAccessXAreas: SegAcessXAreasService,
    private rNomenclaService: RNomenclaService,
    private indicatorParametersService: IndicatorsParametersService
  ) {
    this.authUser = this.authService.decodeToken().preferred_username;
    this.authUserName = this.authService.decodeToken().name;
    this.users = [{ value: this.authUser, label: this.authUserName }];
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
      },
    });
  }

  async ngOnInit() {
    // this.updateSettingsKeysProceedings();
    this.updateTableKeysProceedings(this.claveActa);
    await this.getAreas();
    if (this.typeProceeding) {
      this.typeEvent = await this.getType();
    }
  }

  get claveActa() {
    return this.form
      ? this.form.get(this.formField)
        ? this.form.get(this.formField).value
        : ''
      : '';
  }

  updateRow(data: any) {
    // let newData = { ...data };
    if (this.typeEvent === 'RF') {
      data[1] = 'R';
    } else {
      data[1] = 'E';
    }
    this.valTransf(data[0] ? data[0] : 'RT', data[2]);
    this.fillActKey(data);
    if (!data[3]) {
      if (!this.rowOldValue[3]) {
        data[5] = null;
      }
    } else {
    }
  }

  private valTransf(tipo: string, transf: string) {}

  updateKeysProcedding(event: any) {
    console.log(event);
    let { newData, confirm } = event;
    confirm.resolve(newData);
    this.fillActKey(newData);
  }

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

  private updateTableKeysProceedings(keysProceedings: string) {
    let keys = [];
    let key = {};
    keysProceedings.split('/').forEach((letra, index) => {
      key = { ...key, [index]: letra };
    });
    key = { ...key, editing: false };
    // keys.push(key);
    this.row = key;
    this.rowOldValue = key;
    // this.source = new LocalDataSource(keys);
  }

  // private updateSettingsKeysProceedings(value: string) {
  //   this.settingKeysProceedings = {
  //     ...this.settingKeysProceedings,
  //     actions: {
  //       ...this.settingKeysProceedings.actions,
  //       edit: value !== 'CERRADA',
  //     },
  //   };
  //   this.updateTableKeysProceedings(this.claveActa);
  // }
}
