/** BASE IMPORT */
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil, tap } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NotificationService } from '../../../../core/services/ms-notification/notification.service';
import { MONITOR_RETUR_ABANDONMENT } from './monitor-return-abandonment-columns';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-monitor-return-abandonment',
  templateUrl: './monitor-return-abandonment.component.html',
  styleUrls: [
    './monitor-return-abandonment.component.scss',
    './monitor-return-abandonment.component.css',
  ],
})
export class MonitorReturnAbandonmentComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public form: FormGroup;
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  goods: any[] = [];
  id: string | number;
  dateNoti: string | Date;
  judicialDate: string | Date;
  //historygood

  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private notificationService: NotificationService,
    private datePipe: DatePipe,
    private route: Router
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      mode: '',
      // rowClassFunction: (row: any) => {
      //   if (row.data.id === '54597100') {
      //     console.log("pintala negra");
      //     return 'bg-black-unavailable';
      //   } else {
      //     return 'bg-green-to-confirm';
      //   }
      // },
      columns: { ...MONITOR_RETUR_ABANDONMENT },
    };

    this.settings['rowClassFunction'] = (row: any) => {
      // console.log("Este es el row: ", row.data.id);
      // TODO: Confirmar la regla para poner el fondo negro o verde, esta es solo una prueba del background dinamico
      // row.data.appraisalCurrencyKey === 'USD'
      if (row.data.appraisalCurrencyKey === 'USD') {
        // console.log(row.data.appraisalCurrencyKey, "background: bg-black-unavailable");
        return 'bg-black-unavailable'; // Color from row with negative in score
      } else if (row.data.appraisalCurrencyKey === 'MN') {
        // console.log(row.data.appraisalCurrencyKey, "background: bg-green-to-confirm");
        return 'bg-green-to-confirm';
      }
      // console.log("NO background especial");
      return '';
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.getGoods();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      diEstatusBien: ['', Validators.required],
    });

    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => this.getGoods())
      )
      .subscribe();
  }

  get statusgood() {
    return this.form.get('diEstatusBien');
  }

  public btnDeclaracion() {
    // console.log('Este es el Id: ', this.id);
    // console.log('Esta es la judicialDate: ', this.judicialDate);

    if (this.id === undefined || this.id === null) {
      this.alert('info', 'Por favor seleccione un bien.', '');
      return;
    } else if (this.judicialDate === undefined || this.judicialDate === null) {
      this.alert(
        'info',
        'Debe capturar la fecha de Ratificación Judicial.',
        'Temporalmente deja continuar debido a que no hay manera de capturarlo'
      );
      // return;
    }
    const route = `pages/juridical/return-abandonment-monitor/${this.id}`;
    this.route.navigate([route]);
  }

  public goodSelect(good: IGood) {
    console.log(good);
    this.id = good.id;
    this.dateNoti = good.notifyDate;

    this.statusgood.setValue(good.goodStatus);
  }

  getGoods(): void {
    this.loading = true;
    let params = this.params.getValue();
    // console.log("Los paramentros que vamos a enviar", params);
    this.id = null;
    this.judicialDate = null;

    this.goods = [];

    this.goodService.getAll(params).subscribe(
      response => {
        this.goods = response.data;
        // console.log('Datos regresados: ', this.goods);
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }
}
