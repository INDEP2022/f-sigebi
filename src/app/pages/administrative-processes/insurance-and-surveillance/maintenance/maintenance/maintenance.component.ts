import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared';
import { ChangeGoodsRandomComponent } from '../change-goods-random/change-goods-random.component';
import { ChangePeriodComponent } from '../change-period/change-period.component';
import { DeletePeriodComponent } from '../delete-period/delete-period.component';
import { EmailInformationComponent } from '../email-information/email-information.component';
import { SharedService } from '../service/services';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styles: [],
})
export class MaintenanceComponent extends BasePage implements OnInit {
  currentTab: number = 1;
  @ViewChild('tabset') tabset: TabsetComponent;
  @ViewChild('tab1') tab1: TabsetComponent;
  @ViewChild('tab2') tab2: TabsetComponent;
  @ViewChild('tab3') tab3: TabsetComponent;

  constructor(
    private survillanceService: SurvillanceService,
    private token: AuthService,
    private sharedService: SharedService
  ) {
    super();
  }

  @ViewChild(ChangeGoodsRandomComponent)
  changeGoodsRandomComponent: ChangeGoodsRandomComponent;
  @ViewChild(ChangePeriodComponent)
  changePeriodComponent: ChangePeriodComponent;
  @ViewChild(DeletePeriodComponent)
  deletePeriodComponent: DeletePeriodComponent;
  @ViewChild(EmailInformationComponent)
  emailInformationComponent: EmailInformationComponent;

  ngOnInit(): void {
    this.sharedService.setCurrentTab(1);
  }

  onClickChangeGoodsRandom() {
    const form = this.changeGoodsRandomComponent.getFormChangeGoodsRandom();
    const numberAleatory = form.get('random').value;
    const period = form.get('period').value;
    const textNotPass =
      'Debe seleccionar un bien de número aleatorio y periodo en cambio de bienes de número aleatorio';
    const textQuestion = `¿Está seguro de cambiar el bien de número aleatorio ${numberAleatory} del periodo ${period}?`;
    const title = 'Cambio Bienes de Número Aleatorio';

    const delegationName = this.changeGoodsRandomComponent.DelegacionName_();
    this.onClickStructure(
      Boolean(numberAleatory) && Boolean(period),
      textNotPass,
      textQuestion,
      title
    ).then(res => {
      const params = this.getParamsForChangeGoodsRandom();
      this.saveInServerChangeGoodsRandom(params, delegationName);
    });
  }

  onClickChangePeriod() {
    const form = this.changePeriodComponent.getFormChangePeriod();
    console.log(form);
    const changePeriodInitValue = form.get('period').value;
    const changePeriodEndValue = form.get('periodDestiny').value;
    const textNotPass =
      'Debe seleccionar un periodo de origen y destino en el bloque de cambio de periodo';
    const textQuestion = `¿Está seguro de cambiar la información del periodo ${changePeriodInitValue} al periodo ${changePeriodEndValue}?`;
    const title = 'Cambiar Periodo';
    this.onClickStructure(
      Boolean(changePeriodInitValue) && Boolean(changePeriodEndValue),
      textNotPass,
      textQuestion,
      title
    ).then(res => {
      const params = this.getParamsForChangePeriod();
      this.saveInServerChangePeriod(params);
    });
  }

  async onClickDeletePeriod() {
    const periodNumber = this.deletePeriodComponent
      .getFormDeletePeriod()
      .get('period').value;
    const textNotPass =
      'Debe seleccionar un periodo en el bloque de eliminación de periodo';
    const textPrecaution = `¿Está seguro de eliminar la carga del periodo ${periodNumber}?`;
    const title = 'Eliminar Periodo';
    this.onClickStructure(
      Boolean(periodNumber),
      textNotPass,
      textPrecaution,
      title
    ).then(() => {
      const params = this.getParamsForDeletedPeriod();
      this.saveInServerDeletePeriod(params);
    });
  }

  saveInServerDeletePeriod(params: any) {
    console.log('Estos son los parametros para eliminar ---->', params);
    this.survillanceService.postDeletePeriod(params).subscribe({
      next: response => {
        console.log({ response });
        if (response.P_EST_PROCESO === 1) {
          this.alert('success', 'Eliminar Proceso', response.P_MSG_PROCESO);
          this.limpiarPeriodoDelete();
        } else {
          this.limpiarPeriodoDelete();
          this.alert('warning', 'Eliminar Proceso', response.P_MSG_PROCESO);
        }
      },
      error: error => {
        console.error({ error });
        if (
          error.error.message ==
          'Error, no se pudo obtener la dirección del correo.'
        ) {
          this.alert(
            'warning',
            'No se encontraron los correos',
            'Verifique que estos pertenezcan a la delegación seleccionada'
          );
        } else {
          this.alert('error', 'Ha Ocurrido un Error', error.error.message);
        }
      },
    });
  }

  saveInServerChangePeriod(params: any) {
    this.survillanceService.postChangePeriod(params).subscribe({
      next: response => {
        console.log({ response });
        if (response.P_EST_PROCESO === 1) {
          this.alert('success', 'Cambiar Periodos', response.P_MSG_PROCESO);
          this.limpiarPeriodoCambiar();
        } else {
          this.alert('warning', 'Cambiar Periodos', response.P_MSG_PROCESO);
          this.limpiarPeriodoCambiar();
        }
      },
      error: error => {
        if (
          error.error.message ==
          'Error, no se pudo obtener la dirección del correo.'
        ) {
          this.alert(
            'warning',
            'No se encontraron los correos',
            'Verifique que estos pertenezcan a la delegación seleccionada'
          );
          return;
        }

        if (
          error.error.message ==
          'duplicate key value violates unique constraint "pk_vig_supervision_mae"'
        ) {
          this.alert(
            'error',
            'Ha Ocurrido un Error',
            'Ya existe el período destino indicado'
          );
        } else {
          this.alert('error', 'Ha Ocurrido un Error', error.error.message);
        }
      },
    });
  }

  saveInServerChangeGoodsRandom(params: any, delegationName: any) {
    this.survillanceService.postChangeGoodAle(params).subscribe({
      next: response => {
        console.log({ response });
        if (response.P_EST_PROCESO === 1) {
          let proceso = null;
          if (params.pProcessChange == 1) {
            proceso = 'Supervisión';
          } else {
            proceso = 'Validación';
          }
          this.alert(
            'success',
            'Cambio Bienes de Número Aleatorio',
            `Se Realizó el Cambio de Bien ${params.pGoodNumber} en el Número Aleatorio ${params.pRandom}, para la ${delegationName} del proceso de ${proceso}`
          );
        } else {
          let proceso = null;
          if (params.pProcessChange == 1) {
            proceso = 'Supervisión';
          } else {
            proceso = 'Validación';
          }
          this.alert(
            'success',
            'Cambio Bienes de Número Aleatorio',
            `Se Realizó el Cambio de Bien ${params.pGoodNumber} en el Número Aleatorio ${params.pRandom}, para la ${delegationName} del proceso de ${proceso}`
          );
        }
      },
      error: error => {
        console.error({ error });
        if (
          error.error.message ==
          'Error, no se pudo obtener la dirección del correo.'
        ) {
          this.alert(
            'warning',
            'No se encontraron los correos',
            'Verifique que estos pertenezcan a la delegación seleccionada'
          );
        } else {
          this.alert('error', 'Ha Ocurrido un Error', error.error.message);
        }
      },
    });
  }

  validateAllForms(): boolean {
    const forms = this.getAllForms();
    let message = [];
    const controlReasonForChange =
      forms.emailInformation.get('reasonForChange');
    const controlFrom = forms.emailInformation.get('from');
    const controlTo = forms.emailInformation.get('to');
    const controlCc = forms.emailInformation.get('cc');
    const controlBody = forms.emailInformation.get('body');

    if (controlReasonForChange.invalid) {
      message.push(
        'El motivo de cambio del bloque información de correo, es información obligatoria'
      );
      controlReasonForChange.markAsTouched();
      this.alert('warning', 'Información de Correo', message.join(',\n '));
      return false;
    }

    if (controlFrom.invalid) {
      message.push(
        'El identificador de envío del bloque información de correo, es información obligatoria'
      );
      controlFrom.markAsTouched();
      this.alert('warning', 'Información de Correo', message.join(',\n '));
      return false;
    }

    if (controlTo.invalid) {
      message.push(
        'El correo electrónico del destino (Para) del bloque información de correo, es información obligatoria'
      );
      controlTo.markAsTouched();
      this.alert('warning', 'Información de Correo', message.join(',\n '));
      return false;
    }

    if (controlCc.invalid) {
      message.push(
        'El correo electrónico del destino (CC) del bloque información de correo, es información obligatoria'
      );
      controlCc.markAsTouched();
      this.alert('warning', 'Información de Correo', message.join(',\n '));
      return false;
    }

    if (controlBody.invalid) {
      message.push(
        'El identificador de tipo (Cuerpo de correo) del bloque información de correo, es información obligatoria'
      );
      controlBody.markAsTouched();
      this.alert('warning', 'Información de Correo', message.join(',\n '));
      return false;
    }

    // if (message.length > 0) {
    //   this.alert('warning', 'Información de Correo', message.join(',\n '));
    //   return false;
    // }
    return true;
  }

  getParamsForDeletedPeriod() {
    const {
      pProcessType,
      pYearProcess,
      pNumPeriod,
      pDelegationKey,
      pUsrAuthorize,
      pSoliciDate,
      pMtvoRequest,
      pIdSend,
      pIdFor,
      pIdCopy,
      pIdBody,
    } = this.getParams();

    return {
      pProcessType,
      pYearProcess,
      pNumPeriod,
      pDelegationKey,
      pUsrAuthorize,
      pSoliciDate,
      pMtvoRequest,
      pIdSend,
      pIdFor,
      pIdCopy,
      pIdBody,
    };
  }

  getParamsForChangePeriod() {
    const {
      pYearOrigin,
      pPeriodOrigin,
      pProcessOrigin,
      pDelegateOrigin,
      pYearDestination,
      pPeriodDestination,
      pProcessDestination,
      pDelegateDestination,
      pUsrAuthorize,
      pSoliciDate,
      pMtvoRequest,
      pIdSend,
      pIdFor,
      pIdCopy,
      pIdBody,
    } = this.getParams();
    return {
      pYearOrigin,
      pPeriodOrigin,
      pProcessOrigin,
      pDelegateOrigin,
      pYearDestination,
      pPeriodDestination,
      pProcessDestination,
      pDelegateDestination,
      pUsrAuthorize,
      pSoliciDate,
      pMtvoRequest,
      pIdSend,
      pIdFor,
      pIdCopy,
      pIdBody,
    };
  }

  getParamsForChangeGoodsRandom() {
    const {
      pYearChange,
      pPeriodChange,
      pProcessChange,
      pDelegationChange,
      pRandom,
      pGoodNumber,
      pAddress,
      pTransferee,
      pUsrAuthorize,
      pSoliciDate,
      pMtvoRequest,
      pIdSend,
      pIdFor,
      pIdCopy,
      pIdBody,
      pUser,
    } = this.getParams();

    return {
      pYearChange,
      pPeriodChange,
      pProcessChange,
      pDelegationChange,
      pRandom,
      pGoodNumber,
      pAddress,
      pTransferee,
      pUsrAuthorize,
      pSoliciDate,
      pMtvoRequest,
      pIdSend,
      pIdFor,
      pIdCopy,
      pIdBody,
      pUser,
    };
  }

  getAllFormsValues() {
    return {
      changeGoodsRandom:
        this.changeGoodsRandomComponent.getFormChangeGoodsRandom().value,
      changePeriod: this.changePeriodComponent.getFormChangePeriod().value,
      deletePeriod: this.deletePeriodComponent.getFormDeletePeriod().value,
      emailInformation:
        this.emailInformationComponent.getFormEmailInformation().value,
    };
  }

  getAllForms() {
    return {
      changeGoodsRandom:
        this.changeGoodsRandomComponent.getFormChangeGoodsRandom(),
      changePeriod: this.changePeriodComponent.getFormChangePeriod(),
      deletePeriod: this.deletePeriodComponent.getFormDeletePeriod(),
      emailInformation:
        this.emailInformationComponent.getFormEmailInformation(),
    };
  }

  onClickStructure(
    pass: boolean,
    textNotPass: string,
    textQuestion?: string,
    titleQuestion?: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!pass) {
        this.alert('warning', titleQuestion, textNotPass);
        reject(false);
        return;
      }
      this.alertQuestion('question', titleQuestion, textQuestion).then(
        result => {
          if (!result.isConfirmed) {
            reject(false);
            return;
          }
          if (this.validateAllForms()) {
            resolve(true);
            return;
          }
          reject(false);
          //return;
        }
      );
    });
  }

  getParams() {
    const { deletePeriod, emailInformation, changePeriod, changeGoodsRandom } =
      this.getAllFormsValues();
    return {
      pProcessType: deletePeriod.process,
      pYearProcess: deletePeriod.year,
      pNumPeriod: deletePeriod.period,
      pDelegationKey: deletePeriod.delegation,

      pUsrAuthorize: this.token.decodeToken().preferred_username,
      pSoliciDate: emailInformation.date,
      pMtvoRequest: emailInformation.reasonForChange,
      pIdSend: emailInformation.from,
      pIdFor: emailInformation.to,
      pIdCopy: emailInformation.cc,
      pIdBody: emailInformation.body,

      pYearOrigin: changePeriod.year,
      pPeriodOrigin: changePeriod.period,
      pProcessOrigin: changePeriod.process,
      pDelegateOrigin: changePeriod.delegation,
      pYearDestination: changePeriod.yearDestiny,
      pPeriodDestination: changePeriod.periodDestiny,
      pProcessDestination: changePeriod.processDestiny,
      pDelegateDestination: changePeriod.delegationDestiny,

      pYearChange: changeGoodsRandom.year,
      pPeriodChange: changeGoodsRandom.period,
      pProcessChange: changeGoodsRandom.process,
      pDelegationChange: changeGoodsRandom.delegation,
      pRandom: changeGoodsRandom.random,
      pGoodNumber: changeGoodsRandom.goodNumber,

      pAddress: changeGoodsRandom.description,
      pTransferee: changeGoodsRandom.transference,
      pUser: this.token.decodeToken().preferred_username,
    };
  }

  limpiarPeriodoDelete() {
    this.deletePeriodComponent.limpiarPeriodo();
  }

  limpiarPeriodoCambiar() {
    this.changePeriodComponent.limpiarPeriodo();
  }

  returnParseDate_(data: Date) {
    const formattedDate = moment(data).format('YYYY-MM-DD');
    return formattedDate;
  }

  changeTab(tabNumber: number): void {
    console.log('tabNumber', tabNumber);
    this.currentTab = tabNumber;
    this.sharedService.setCurrentTab(tabNumber);
  }
  onTabChanged(event: any) {
    const tab = event.target.outerText;

    if (tab == 'Eliminar Periodos') this.currentTab = 1;
    if (tab == 'Cambiar Periodos') this.currentTab = 2;
    if (tab == 'Cambiar Bienes de Número Aleatorio') this.currentTab = 3;
    this.sharedService.setCurrentTab(this.currentTab);

    console.log('tab', event.target.outerText);
  }
}
