import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil, tap } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { COLUMNS } from './columns';

import { Router } from '@angular/router';
import { IGood } from 'src/app/core/models/good/good.model';

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
  isdisable: boolean = true;
  totalItems: number = 0;
  data: any[] = [];
  good = new DefaultSelect<IGood>();
  form: FormGroup;
  period: boolean = false;
  searching: boolean = false;
  selectedRows: any;
  selectedRow: any;
  selectedGood: IGood;

  get goodId() {
    return this.form.get('goodId');
  }
  get description() {
    return this.form.get('description');
  }
  get quantity() {
    return this.form.get('quantity');
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
    private notificationService: NotificationService,
    private goodTypesService: GoodTypeService,
    private router: Router
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
      goodId: [null, [Validators.required]],
      description: [null],
      quantity: [null],
      periods: [null],
      periods1: [null],
      periods2: [null],
    });
  }

  prepareForm() {
    this.buildForm();

    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => {})
      )
      .subscribe();
  }

  getGoodsxnotification() {
    const params = this.params.getValue();
    console.log(params);
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;

    if (this.form.value.goodId) {
      this.filterParams
        .getValue()
        .addFilter('numberProperty', this.form.value.goodId, SearchFilter.EQ);
    }

    this.loading = true;
    this.loadingText = 'Cargando';

    this.notificationService
      .getNotificationxPropertyFilter({
        numberProperty: this.form.value.goodId,
      })
      .subscribe({
        next: response => {
          console.log('Goods Response: ', response);
          this.loading = false;
          this.data = response.data;

          this.totalItems = this.data.length;
          this.searching = true;
        },
        error: () => (this.loading = false),
      });
  }

  getGoodIdDescription(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    let paramDinamyc = '';

    if (lparams.text.length > 0) {
      !isNaN(parseInt(lparams.text))
        ? (paramDinamyc = `filter.goodId=$eq:${lparams.text}`)
        : (paramDinamyc = `filter.description=$ilike:${lparams.text}`);
    }
    //     this.goodId.value
    // console.log('entre al filtro ', this.goodId.value , lparams);

    this.goodService.getAll(`${params.getParams()}&${paramDinamyc}`).subscribe({
      next: data => {
        this.good = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', ' Revise los datos ingresados');
      },
    });
  }
  onGoodIdDescription(goodChange: any) {
    let param = `filter.registerNumber=$eq:${goodChange.goodId}`;
    this.goodService.getAll(param).subscribe({
      next: data => {
        console.log('data filter', data.data[0].quantity);
        this.executeCamps(data.data[0]);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', 'Revise los datos ingresados');
      },
    });
  }
  executeCamps(data: any) {
    this.quantity.setValue(data.quantity);
    const params = new FilterParams();
    let paramDinamyc = `filter.id=$eq:${data.goodTypeId}`;

    this.goodTypesService.getAllS(`${params}&${paramDinamyc}`).subscribe({
      next: value => {
        const { maxAsseguranceTime, maxFractionTime, maxExtensionTime } =
          value.data[0];
        if (
          maxAsseguranceTime != null &&
          maxFractionTime !== null &&
          maxExtensionTime !== null
        ) {
          this.period = true;
          this.periods.setValue(maxAsseguranceTime);
          this.periods1.setValue(maxFractionTime);
          this.periods2.setValue(maxExtensionTime);
        } else {
          this.onLoadToast('error', 'No existen Periodos', 'periodos vacios');
        }
      },
    });
  }
  clean() {
    this.form.reset();
    this.searching = false;
    this.data = [];
  }

  search() {
    if (this.goodId.value != null) {
      this.getGoodsxnotification();
    } else {
      this.message('info', 'Error', 'Debe llenar algun filtro.');
    }
  }
  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }
  public onUserRowSelect(event: any) {
    if (event.selected.length == 1) {
      this.selectedRow = event.selected[0];
    }
  }
  accept() {
    /*console.log(this.selectedGood.status);
    let validateParams = {
      status: this.selectedGood.status,
      notifyDate: this.selectedRow.notificationDate,
      complianceLeaveDate: this.selectedRow.periodEndDate,
      judicialDate: this.selectedRow.abandonmentExpirationDate,
      goodsID: this.selectedGood.id,
      user: getUser(),
      screen: 'FACTJURNOTABANASE',
    };
    console.log('validateParams: ', validateParams);
    //count AE status of data
    let count = 0;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].statusNotified == 'AE') {
        count++;
      }
    }
    if (count == 3) {
      this.notificationService.validateGoodStatus(this.data).subscribe({
        next: response => {
          console.log('response: ', response);
          //redireccion
          if (
            this.selectedRow.definitiveSuspension == '0' &&
            this.selectedRow.statusNotified == 'AE'
          ) {
            this.onLoadToast(
              'success',
              'Exito',
              'Se ha validado correctamente.'
            );
            this.router.navigate([
              'pages',
              'juridical',
              'depositary',
              'abandonment-monitor-for-securing',
            ]);
          } else if (this.selectedRow.definitiveSuspension == '1') {
            this.onLoadToast(
              'error',
              'Error',
              'El Proceso ha sido Suspendido Temporalmente, favor de verificar.'
            );
          }
        },
        error: err => {
          console.log('err: ', err);
          this.onLoadToast('error', 'Error', err.message);
        },
      });
    } else if (count < 3) {
      this.message(
        'info',
        'Error',
        'Deben haber 3 notificaciones de aseguramiento para ir a Confirmación de Abandonos.'
      );
    }*/
  }

  onSelectedGood(event: any) {
    this.selectedGood = event;
  }
}
