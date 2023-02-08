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
    console.log(this.good);

    this.prepareForm();
    this.loading = true;
  }

  private getGood(id: number | string) {
    this.goodService.getById(id).subscribe(
      response => {
        this.good = response.data;
        this.loadGood(this.good);
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
      noBien: [this.idBien ? this.idBien : ''],
      descripcion: [''],
      quantity: [''],
      estatus: ['', [Validators.pattern(STRING_PATTERN)]],
      goodEstatus: [''],
      fechaNotificacion: [''],
      fechaNotificacion2: [''],
      fechaTerminoPeriodo: [''],
      fechaTerminoPeriodo2: [''],
      declaracionAbandonoSERA: ['', [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getNotification(): void {
    this.notificationService.getAll(this.params.getValue()).subscribe(
      response => {
        this.notifications = response.data;
        console.log(this.notifications);
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  public btnRatificacion() {
    //this.getNotification();
    this.ratificacion();
    //console.log(this.notificationPropertyResponse);
  }

  private ratificacion() {
    let notificationPropertyRequest = {
      numberProperty: this.good.id,
      notificationDate: '2002-04-09T00:00:00.000Z',
    };
    //console.log(notificationPropertyRequest);

    this.notificationService
      .createNotificationxPropertyFilter(notificationPropertyRequest)
      .subscribe({
        next: response => {
          console.log(response);
          this.GetNotificationxPropertyFilter(response.data);
        },
        error: err => {
          //error
        },
      });
  }

  private GetNotificationxPropertyFilter(data: any) {
    console.log(data[0]);
    this.notificationService
      .updateupdateNotification(
        data[0].numberProperty,
        data[0].notificationDate,
        data[0]
      )
      .subscribe({
        next: response => {
          this.onLoadToast(
            'success',
            'Ratificado',
            'Se ratifico correctamente'
          );
        },
        error: err => {
          this.onLoadToast('error', 'Ratificado', 'Error al  ratificar');
        },
      });
  }
}
