/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-declaration-abandonment-insurance',
  templateUrl: './declaration-abandonment-insurance.component.html',
  styleUrls: ['./declaration-abandonment-insurance.component.scss'],
})
export class DeclarationAbandonmentInsuranceComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public idBien: string = '';
  public form: FormGroup;
  good: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  notifications: any[] = [];

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private goodService: GoodService,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.paramMap.get('id');
    if (id) this.idBien = String(id);
    this.getGood(id);

    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      noBien: [this.idBien ? this.idBien : ''],
      descripcion: [''],
      cantidad: [''],
      estatus: ['', [Validators.pattern(STRING_PATTERN)]],
      fechaNotificacion: [''],
      fechaNotificacion2: [''],
      fechaNotificacion3: [''],
      fechaTerminoPeriodo: [''],
      fechaTerminoPeriodo2: [''],
      fechaTerminoPeriodo3: [''],
      declaracionAbandonoSERA: ['', [Validators.pattern(STRING_PATTERN)]],
    });
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

  private loadGood(good: any) {
    this.form.get('descripcion').setValue(good.description);
    this.form.get('quantity').setValue(good.quantity);
    this.form.get('estatus').setValue(good.status);
    this.form.get('declaracionAbandonoSERA').setValue(good.descriptionGoodSae);
    this.form.get('estatus').setValue(good.status);
    this.form.get('goodEstatus').setValue(good.goodStatus);
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

  private ratificacion() {
    let notificationPropertyRequest = {
      numberProperty: this.good.id,
      notificationDate: '2002-04-09T00:00:00.000Z',
    };

    this.GetNotificationxPropertyFilter(notificationPropertyRequest);
  }

  public btnRatificacion() {
    this.ratificacion();
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
