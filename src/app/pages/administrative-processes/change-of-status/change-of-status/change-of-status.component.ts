import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IStatusCode } from 'src/app/core/models/catalogs/status-code.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
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
      numberGood: [null, [Validators.required]],
      descriptionGood: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      currentStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      descriptionStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      processesGood: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  private buildFormNew() {
    this.formNew = this.fb.group({
      goodStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dateStatus: [null, [Validators.required]],
      extDomProcess: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      issuingUser: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [null, [Validators.required]],
    });
  }

  loadGood() {
    this.loading = true;
    this.goodServices.getById(this.numberGood.value).subscribe({
      next: response => {
        this.good = response;
        this.loadDescriptionStatus(this.good);
        this.loading = false;
        this.formNew.enable();
        this.dateStatus.disable();
        this.endProcess = true;
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
    let status: any;
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
    this.good.status =
      this.goodStatus.value === null ? this.good.status : this.goodStatus.value;
    this.good.observations = this.description.value;
    this.good.extDomProcess =
      this.extDomProcess.value === null
        ? this.good.extDomProcess
        : this.extDomProcess.value;
    this.good.userModification = this.token.decodeToken().preferred_username;
    this.goodServices.updateStatusGood(this.good).subscribe({
      next: response => {
        console.log(response);
        this.postHistoryGood();
        this.form.reset();
        this.formNew.reset();
        this.dateStatus.setValue(new Date());
        this.onLoadToast(
          'success',
          'Actualizado',
          'Se le ha cambiado el Estatus al bien'
        );
      },
      error: error => (this.loading = false),
    });
    this.endProcess = false;
  }
  postHistoryGood() {
    const historyGood: IHistoryGood = {
      propertyNum: this.numberGood.value,
      status: this.goodStatus.value,
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
      next: response => {},
      error: error => {
        this.loading = false;
      },
    });
  }
}
