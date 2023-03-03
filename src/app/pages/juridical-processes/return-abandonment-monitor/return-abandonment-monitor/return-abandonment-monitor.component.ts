/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { NotificationService } from '../../../../core/services/ms-notification/notification.service';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-return-abandonment-monitor',
  templateUrl: './return-abandonment-monitor.component.html',
  styleUrls: ['./return-abandonment-monitor.component.scss'],
})
export class ReturnAbandonmentMonitorComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public idBien: string = '';
  public form: FormGroup;
  good: IGood;
  notifications: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  notificationPropertyResponse: any;

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private goodService: GoodService,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    const id: string | number = this.activateRoute.snapshot.paramMap.get('id');
    if (id) this.idBien = String(id);

    this.getGood(id);

    this.prepareForm();
    this.loading = true;
  }

  private getGood(id: number | string) {
    this.goodService.getById(id).subscribe(
      response => {
        setTimeout(() => {
          this.good = response;
          this.loadGood(response);
        }, 1000);
      },

      error => (this.loading = false)
    );
  }

  private loadGood(good: IGood) {
    this.form.get('descripcion').setValue(good.description);
    this.form.get('quantity').setValue(good.quantity);
    this.form.get('estatus').setValue(good.status);
    this.form.get('declaracionAbandonoSERA').setValue(good.descriptionGoodSae);
    this.form.get('estatus').setValue(good.status);
    this.form.get('goodEstatus').setValue(good.goodStatus);
  }

  private prepareForm() {
    this.form = this.fb.group({
      noBien: [this.idBien ? this.idBien : '', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(150)]],
      quantity: ['', [Validators.required]],
      estatus: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      goodEstatus: ['', [Validators.required, Validators.maxLength(50)]],
      fechaNotificacion: ['', [Validators.required]],
      fechaNotificacion2: ['', [Validators.required]],
      fechaTerminoPeriodo: ['', [Validators.required]],
      fechaTerminoPeriodo2: ['', [Validators.required]],
      declaracionAbandonoSERA: [
        '',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(150)],
      ],
    });
  }

  getNotification(): void {
    this.notificationService.getAll(this.params.getValue()).subscribe(
      response => {
        this.notifications = response.data;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  public btnRatificacion() {
    this.ratificacion();
  }

  private ratificacion() {
    let notificationPropertyRequest = {
      numberProperty: this.good.id,
      notificationDate: '2002-04-09T00:00:00.000Z',
    };

    this.GetNotificationxPropertyFilter(notificationPropertyRequest);
  }

  private GetNotificationxPropertyFilter(data: any) {
    this.notificationService
      .getByNotificationxProperty(data.numberProperty)
      .subscribe({
        next: response => {
          const { data } = response;

          delete data[0].userCorrectsKey;

          let form = {
            userCorrectsKey: 'sigebiadmon',
            ...data[0],
          };

          this.notificationService
            .updateNotificationxPropertyFilter(
              Number(data[0].numberProperty),
              data[0].notificationDate,
              form
            )
            .subscribe({
              next: response => {
                this.onLoadToast(
                  'success',
                  'Ratificado',
                  'Se Ratifico correctamente'
                );
              },
              error: err => {
                this.onLoadToast('error', 'Ratificado', 'No se pudo Ratificar');
              },
            });
        },
        error: err => {
          this.onLoadToast('error', 'Ratificado', 'Error al  ratificar');
        },
      });
  }
}
