import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
// import { GoodService } from 'src/app/core/services/good/good.service';

// import { BehaviorSubject, takeUntil, tap } from 'rxjs';
// import {
//   FilterParams,
//   ListParams,
//   SearchFilter,
// } from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
// import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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
  selectRegDele = new DefaultSelect<any>();
  // get numberGood() {
  //   return this.form.get('numberGood');
  // }
  // get description() {
  //   return this.form.get('description');
  // }
  // get amount() {
  //   return this.form.get('amount');
  // }
  // get periods() {
  //   return this.form.get('periods');
  // }
  // get periods1() {
  //   return this.form.get('periods1');
  // }
  // get periods2() {
  //   return this.form.get('periods2');
  // }

  constructor(
    private fb: FormBuilder,
    private goodServices: GoodService,
    private notificationService: NotificationService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      numberGood: ['', [Validators.required]],
      description: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      amount: ['', [Validators.required]],
      periods: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      periods1: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      periods2: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  listGoodsId(params?: ListParams) {
    console.log('PARAMAS.', params);
    params['filter.goodId'] = `$eq:${params.text}`;
    delete params['search'];

    this.goodServices.getAll(params).subscribe({
      next: (data: any) => {
        data.data.map((data: any) => {
          // let descripcion = (data.description == null) ? '' : data.description;
          // data.descriptionAndId = `${data.id} - ${descripcion} `;
          return data;
        }),
          console.log('RESP', data);
        this.selectRegDele = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.selectRegDele = new DefaultSelect();
      },
    });
  }

  cleanForm() {}

  getGood(item: any) {
    this.loading = true;
    console.log('ITEM', item);

    if (item != undefined) {
      // let id = item.goodId;
      // let obj = {
      //   propertyNum: id,
      //   status: "ABN"
      // }

      // this.historyGoodService.getHistoryStatusGoodById(obj).subscribe({
      //   next: response => {

      //     if (response) {
      //       this.onLoadToast('warning', 'Aplicación de Abandono', 'El Bien previamente ha tenido un estatus de Abandono')
      //       this.cleanForm();
      //     }

      //   },
      //   error: error => {

      this.loading = false;
      this.form.get('description').setValue(item.description);
      this.form.get('amount').setValue(item.quantity);
      // this.form.get('periods').setValue(item.description);
      // this.form.get('periods1').setValue(item.unit);
      // this.form.get('periods2').setValue(item.clarification);

      //   },
      // });
    } else {
      this.cleanForm();
    }
  }

  // Antiguo desarrollador

  // prepareForm() {
  //   this.buildForm();

  //   this.params
  //     .pipe(
  //       takeUntil(this.$unSubscribe),
  //       tap(() => this.getGoods())
  //     )
  //     .subscribe();
  // }

  // getGoods() {
  //   const params = this.params.getValue();
  //   console.log(params);
  //   this.filterParams.getValue().removeAllFilters();
  //   this.filterParams.getValue().page = params.page;

  //   if (this.form.value.numberGood) {
  //     this.filterParams
  //       .getValue()
  //       .addFilter('goodId', this.form.value.numberGood, SearchFilter.ILIKE);
  //   }
  //   if (this.form.value.amount) {
  //     this.filterParams
  //       .getValue()
  //       .addFilter('quantity', this.form.value.amount, SearchFilter.ILIKE);
  //   }
  //   if (this.form.value.periods) {
  //     this.filterParams
  //       .getValue()
  //       .addFilter('period', this.form.value.periods, SearchFilter.ILIKE);
  //   }

  //   if (this.form.value.periods) {
  //     this.filterParams
  //       .getValue()
  //       .addFilter('period1', this.form.value.periods, SearchFilter.ILIKE);
  //   }

  //   if (this.form.value.periods) {
  //     this.filterParams
  //       .getValue()
  //       .addFilter('period2', this.form.value.periods, SearchFilter.ILIKE);
  //   }

  //   console.log(
  //     'this.filterParams: ',
  //     this.filterParams.getValue().getParams()
  //   );

  //   this.loading = true;
  //   this.loadingText = 'Cargando';

  //   this.goodService
  //     .getAll(this.filterParams.getValue().getParams())
  //     .subscribe({
  //       next: response => {
  //         console.log('Goods Response: ', response);
  //         this.loading = false;
  //         this.data = response.data;

  //         this.totalItems = this.data.length;
  //       },
  //       error: () => (this.loading = false),
  //     });
  // }
}
