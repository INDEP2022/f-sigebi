import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

import { COLUMNS, goodCheck } from './columns';

@Component({
  selector: 'app-change-of-status-sti',
  templateUrl: './change-of-status-sti.component.html',
  styles: [],
})
export class ChangeOfStatusStiComponent extends BasePage implements OnInit {
  form: FormGroup;
  busco: boolean = false;
  get numberFile() {
    return this.form.get('numberFile');
  }
  get goodStatus() {
    return this.form.get('goodStatus');
  }
  get descriptionStatus() {
    return this.form.get('descriptionStatus');
  }
  get currentDate() {
    return this.form.get('currentDate');
  }
  get description() {
    return this.form.get('description');
  }

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  goodSelect: any[] = [];
  goods: IGood[] = [];
  constructor(
    private fb: FormBuilder,
    private readonly goodServices: GoodService,
    private token: AuthService,
    private readonly historyGoodService: HistoryGoodService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.busco) {
        this.listGoods();
      }
    });
    this.buildForm();
    this.form.disable();
    this.numberFile.enable();
    this.description.enable();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      numberFile: [null, [Validators.required]],
      goodStatus: [
        'ROP',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      descriptionStatus: [
        'Solicitud de transferencia improcedente.',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      currentDate: [new Date(), [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  accept() {
    if (goodCheck.length == 0) {
      this.onLoadToast('error', 'Error', 'Debe chechear al menos un Bien');
      return;
    }
    if (this.description.value == null) {
      this.onLoadToast('error', 'Error', 'La descripcion es obligatoria');
      return;
    }
    try {
      goodCheck.forEach(item => {
        const good: IGood = item.row;
        console.log(good);
        good.status = this.goodStatus.value;
        good.observations = `${good.observations}. ${this.description.value}`;
        good.userModification = this.token.decodeToken().preferred_username;
        this.goodServices.update(good).subscribe({
          next: response => {
            console.log(response);
            this.postHistoryGood(good);
          },
          error: error => (this.loading = false),
        });
      });
      this.onLoadToast(
        'success',
        'Actualizado',
        'Se ha cambiado el status de los bienes seleccionados'
      );
    } catch (error) {
      this.onLoadToast(
        'error',
        'ERROR',
        'Ha ocurrido un error en el proceso de cambio'
      );
    }
  }

  listGoods() {
    this.loading = true;
    this.busco = true;
    this.goodServices
      .getByExpedientAndStatus(
        this.numberFile.value,
        'STI',
        this.params.getValue()
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.length == 0) {
            this.onLoadToast('error', 'ERROR', 'No hay bienes con status STI');
            this.goods = [];
            this.loading = false;
            return;
          }
          this.goods = response.data;
          this.totalItems = response.count;
          this.loading = false;
          this.currentDate.disable();
        },
        error: error => {
          console.log(error);
          this.goods = [];
          this.loading = false;
        },
      });
  }

  postHistoryGood(good: IGood) {
    const historyGood: IHistoryGood = {
      propertyNum: good.id,
      status: this.goodStatus.value,
      changeDate: new Date(),
      userChange: this.token.decodeToken().preferred_username,
      statusChangeProgram: 'FCAMBIOESTATSTI',
      reasonForChange: 'CAMBIO ESTATUS STI',
      registryNum: null,
      extDomProcess: null,
    };
    this.historyGoodService.create(historyGood).subscribe({
      next: response => {
        this.listGoods();
      },
      error: error => {
        this.loading = false;
      },
    });
  }
}
