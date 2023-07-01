import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IStatusCode } from 'src/app/core/models/catalogs/status-code.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { COLUMNS_STATUS, COLUMNS_USER } from './columns';

@Component({
  selector: 'app-change-of-status',
  templateUrl: './change-of-status.component.html',
  styles: [],
})
export class ChangeOfStatusComponent extends BasePage implements OnInit {
  //Reactive Forms
  form: FormGroup;
  good: IGood;
  status = new DefaultSelect<IStatusCode>();
  columns: any = COLUMNS_STATUS;
  columnsUser: any = COLUMNS_USER;
  params = new BehaviorSubject<ListParams>(new ListParams());
  statusSelect: IStatusCode;
  endProcess: boolean = false;
  //Criterio por clasificación de bienes
  get numberGood() {
    return this.form.get('numberGood');
  }
  get descriptionGood() {
    return this.form.get('descriptionGood');
  }
  get currentStatus() {
    return this.form.get('currentStatus');
  }
  get descriptionStatus() {
    return this.form.get('descriptionStatus');
  }

  get processesGood() {
    return this.form.get('processesGood');
  }

  //Reactive Forms
  formNew: FormGroup;

  get goodStatus() {
    return this.formNew.get('goodStatus');
  }
  get dateStatus() {
    return this.formNew.get('dateStatus');
  }
  get extDomProcess() {
    return this.formNew.get('extDomProcess');
  }
  get issuingUser() {
    return this.formNew.get('issuingUser');
  }
  get description() {
    return this.formNew.get('description');
  }

  constructor(
    private fb: FormBuilder,
    private readonly goodServices: GoodService,
    private token: AuthService,
    private readonly historyGoodService: HistoryGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.buildFormNew();
    this.dateStatus.setValue(new Date());
    this.form.disable();
    this.formNew.disable();
    this.numberGood.enable();
  }

  //disbaledInpust;

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      numberGood: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      descriptionGood: [null],
      currentStatus: [null],
      descriptionStatus: [null],
      processesGood: [null],
    });
  }
  private buildFormNew() {
    this.formNew = this.fb.group({
      goodStatus: [null, [Validators.required]],
      dateStatus: [null],
      extDomProcess: [null, [Validators.pattern(STRING_PATTERN)]],
      issuingUser: [null, [Validators.pattern(STRING_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  clearAll() {
    this.endProcess = false;
    this.form.get('numberGood').reset();
    this.form.get('descriptionGood').reset();
    this.form.get('currentStatus').reset();
    this.form.get('descriptionStatus').reset();
    this.form.get('processesGood').reset();
    this.formNew.get('goodStatus').reset();
    this.formNew.get('dateStatus').reset();
    this.formNew.get('extDomProcess').reset();
    this.formNew.get('issuingUser').reset();
    this.formNew.get('description').reset();
  }

  loadGood() {
    this.loading = true;
    this.dateStatus.setValue(new Date());
    this.goodServices.getById(this.numberGood.value).subscribe({
      next: (response: any) => {
        this.good = response.data[0];
        this.loadDescriptionStatus(this.good);
        this.loading = false;
        this.formNew.enable();
        this.dateStatus.disable();
        this.endProcess = true;
      },
      error: error => {
        this.alert('error', 'Error', 'Este bien no existe');
      },
    });
  }

  setGood(good: IGood, status: any) {
    this.descriptionGood.setValue(good.description);
    this.currentStatus.setValue(good.status);
    this.descriptionStatus.setValue(status.status_descripcion);
    this.processesGood.setValue(good.extDomProcess);
  }

  loadDescriptionStatus(good: IGood) {
    this.goodServices.getStatusByGood(good.id).subscribe({
      next: response => {
        this.setGood(good, response);
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  accept() {
    //5457740
    //IF OBSERVACIÓN
    const observations =
      this.goodStatus.value != null && this.goodStatus.value.status == 'CAN'
        ? `${this.good.observations}. ${this.description.value}`
        : this.description.value != null
        ? this.description.value
        : null;
    // MODEL PARA ACTUALIZAR EL GOOD

    this.alertQuestion(
      'question',
      `¿Desea actualizar?`,
      `Se va a actualizar el estatus ${
        this.extDomProcess.value != null ? 'y proceso' : ''
      }`
    ).then(q => {
      if (q.isConfirmed) {
        const putGood: IGood = {
          id: Number(this.good.id),
          goodId: Number(this.good.id),
          status:
            this.goodStatus.value === null
              ? this.good.status
              : this.goodStatus.value.status,
          extDomProcess:
            this.extDomProcess.value === null
              ? this.good.extDomProcess
              : this.extDomProcess.value,
          userModification: this.token.decodeToken().preferred_username,
          observations: observations,
        };
        this.goodServices.update(putGood).subscribe({
          next: response => {
            this.postHistoryGood();
          },
          error: error => {
            this.loading = false;
            console.error(error);
            this.alert(
              'error',
              'Error',
              'Error al cambiar el estatus del bien'
            );
          },
        });
      }
    });
  }

  postHistoryGood() {
    const historyGood: IHistoryGood = {
      propertyNum: this.numberGood.value,
      status: this.goodStatus.value.status,
      changeDate: new Date(),
      userChange: this.token.decodeToken().preferred_username,
      statusChangeProgram: 'CAMMUEESTATUS',
      reasonForChange: this.description.value,
      registryNum: null,
      extDomProcess:
        this.extDomProcess.value === null
          ? this.good.extDomProcess
          : this.extDomProcess.value,
    };
    this.historyGoodService.create(historyGood).subscribe({
      next: response => {
        const id = this.good.id;

        this.form.reset();
        this.formNew.reset();
        this.dateStatus.setValue(new Date());
        this.alert(
          'success',
          'Actualizado',
          'Se le ha cambiado el Estatus al bien'
        );
        this.numberGood.setValue(id);
        this.loadGood();
        this.endProcess = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }
}
