import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil, tap } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-notice-of-abandonment-by-return',
  templateUrl: './notice-abandonment-for-securing.component.html',
  styles: [],
})
export class NoticeAbandonmentForSecuringComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  loadingText = '';

  totalItems: number = 0;
  data: any[] = [];

  form: FormGroup;

  get numberGood() {
    return this.form.get('numberGood');
  }
  get description() {
    return this.form.get('description');
  }
  get amount() {
    return this.form.get('amount');
  }
  get periods() {
    return this.form.get('periods');
  }
  get periods1() {
    return this.form.get('periods1');
  }
  get periods2() {
    return this.form.get('periods2');
  }

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private notificationService: NotificationService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      numberGood: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      amount: [null, [Validators.required]],
      periods: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      periods1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      periods2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  prepareForm() {
    this.buildForm();

    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => this.getGoods())
      )
      .subscribe();
  }

  getGoods() {
    const params = this.params.getValue();
    console.log(params);
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;

    if (this.form.value.numberGood) {
      this.filterParams
        .getValue()
        .addFilter('goodId', this.form.value.numberGood, SearchFilter.ILIKE);
    }
    if (this.form.value.amount) {
      this.filterParams
        .getValue()
        .addFilter('quantity', this.form.value.amount, SearchFilter.ILIKE);
    }
    if (this.form.value.periods) {
      this.filterParams
        .getValue()
        .addFilter('period', this.form.value.periods, SearchFilter.ILIKE);
    }

    if (this.form.value.periods) {
      this.filterParams
        .getValue()
        .addFilter('period1', this.form.value.periods, SearchFilter.ILIKE);
    }

    if (this.form.value.periods) {
      this.filterParams
        .getValue()
        .addFilter('period2', this.form.value.periods, SearchFilter.ILIKE);
    }

    console.log(
      'this.filterParams: ',
      this.filterParams.getValue().getParams()
    );

    this.loading = true;
    this.loadingText = 'Cargando';

    this.goodService
      .getAll(this.filterParams.getValue().getParams())
      .subscribe({
        next: response => {
          console.log('Goods Response: ', response);
          this.loading = false;
          this.data = response.data;

          this.totalItems = this.data.length;
        },
        error: () => (this.loading = false),
      });
  }
}
