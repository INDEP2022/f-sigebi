/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  validRatificacion: boolean = true;
  notifications: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  notificationPropertyResponse: any;

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private goodService: GoodService,
    private notificationService: NotificationService,
    private statusGoodService: StatusGoodService,
    private screenStatusService: ScreenStatusService,
    private token: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    let toast = {
      icon: 'warning',
      message: 'El Bien ya se encuentra Ratificado',
    };

    const id: string | number = this.activateRoute.snapshot.paramMap.get('id');
    if (id) this.idBien = String(id);

    this.prepareForm();
    this.getGood(id, toast);

    this.loading = true;
  }

  // PREPARAMOS EL FORMULARIO //
  private prepareForm() {
    this.form = this.fb.group({
      noBien: [this.idBien ? this.idBien : '', [Validators.required]],
      descripcion: [''],
      quantity: [''],
      estatus: [''],
      goodEstatus: [''],
      fechaNotificacion: [''],
      fechaNotificacion2: [''],
      fechaTerminoPeriodo: [''],
      fechaTerminoPeriodo2: [''],
      declaracionAbandonoSERA: [
        '',
        [Validators.maxLength(1000), Validators.required],
      ],
    });
  }

  // OBTENEMOS DATA DEL BIEN //
  private getGood(id: number | string, toast: any) {
    this.goodService.getGoodById(id).subscribe(
      response => {
        setTimeout(() => {
          this.good = response;

          this.getScreenStatusFinal(response, toast);
          this.loadGood(response);
        }, 1000);
      },

      error => (this.loading = false)
    );
  }

  // LLENAR FORM - Y CARGAR DATA DEL BIEN - //
  private async loadGood(good: IGood) {
    // DATA DE STATUSGOOD - PARA OBTENER LA DESCRIPCIÓN DE STATUS BIEN//
    let params = new ListParams();
    params['filter.status'] = `$ilike:${good.status}`;
    await this.statusGoodService.getAll(params).subscribe({
      next: (response: any) => {
        this.form.get('descripcion').setValue(good.description);
        this.form.get('quantity').setValue(good.quantity);
        this.form.get('estatus').setValue(response.data[0].description);
        this.form
          .get('declaracionAbandonoSERA')
          .setValue(good.seraAbnDeclaration);
        this.form.get('goodEstatus').setValue(good.goodStatus);
      },
      error: err => {
        this.form.get('descripcion').setValue(good.description);
        this.form.get('quantity').setValue(good.quantity);
        this.form.get('estatus').setValue(good.status);
        this.form
          .get('declaracionAbandonoSERA')
          .setValue(good.seraAbnDeclaration);
        this.form.get('goodEstatus').setValue(good.goodStatus);
      },
    });
  }

  // ACCIÓN DEL BOTÓN RATIFICAR
  public btnRatificacion() {
    this.getScreenStatus(this.good);
  }

  // BUSCAMOS EL STATUSFINAL EN LA TABLA STATUSXSCREEN //
  getScreenStatus(good: any) {
    let obj = {
      estatus: good.status,
      vc_pantalla: 'FACTJURDECABANDEV',
    };

    let _statusFinal: any = {
      status: null,
    };

    this.screenStatusService.getAllFiltro(obj).subscribe(
      (response: any) => {
        const { data } = response;
        _statusFinal.status = data[0].statusFinal.status;

        this.getDataNotixGood(_statusFinal);
      },
      error => {
        // this.getDataNotixGood(_statusFinal);
        this.onLoadToast(
          'warning',
          'No se encontró el Estatus Final',
          'Estatus por Pantalla'
        );
      }
    );
  }

  // OBTENEMOS DATA DE LA TABLA NOTIFICACIONES X BIENES //
  getDataNotixGood(_statusFinal: any) {
    let notificationPropertyRequest = {
      numberProperty: this.good.id,
    };

    this.notificationService
      .getByNotificationxProperty2(notificationPropertyRequest)
      .subscribe({
        next: response => {
          // console.log('NOTIFICATION X BIEN', response);
          const { data } = response;

          if (
            data[0].userCorrectsKey == null &&
            this.good.status != _statusFinal.status
          ) {
            this.UpdateNotificationXProperty(data[0]);
            this.updateGood(_statusFinal);
          } else if (
            data[0].userCorrectsKey != null &&
            this.good.status != _statusFinal.status
          ) {
            this.onLoadToast(
              'warning',
              'Notificación por Bien',
              'Se encontró un CVE usuario ractifica'
            );
          } else if (
            data[0].userCorrectsKey == null &&
            this.good.status == _statusFinal.status
          ) {
            this.onLoadToast(
              'warning',
              'Notificación por Bien',
              'El Estatus-Bien y el Estatus Final son iguales'
            );
          }
        },
        error: err => {
          this.onLoadToast('error', 'Notificación por Bien', err.error.message);
        },
      });
  }

  // ACTUALIZAMOS EN LA TABLA NOTIFICACIÓNXBIENES
  async UpdateNotificationXProperty(data: any) {
    const formData: any = {
      numberProperty: data.numberProperty,
      // periodEndDate: this.form.get('fechaTerminoPeriodo').value,
      userCorrectsKey: this.token.decodeToken().preferred_username,
    };

    this.notificationService
      .updateNotiXProperty(data.numberProperty, data.periodEndDate, formData)
      .subscribe({
        next: response => {
          this.onLoadToast(
            'success',
            'Ratificado',
            'Se modificó el CVE Usuario Ratifica'
          );
        },
        error: err => {
          this.onLoadToast(
            'error',
            'Declaración de Abandono',
            err.error.message
          );
        },
      });
  }

  // ACTUALIZAR STATUS DEL BIEN //
  async updateGood(_status: any) {
    // data.status = _status.status;
    // data.seraAbnDeclaration = this.form.get('declaracionAbandonoSERA').value;

    let obj = {
      id: this.idBien,
      goodId: this.idBien,
      status: _status.status,
      seraAbnDeclaration: this.form.get('declaracionAbandonoSERA').value,
    };

    this.goodService.updateWithParams(obj).subscribe({
      next: response => {
        let toast = {
          icon: 'success',
          message: 'Se Ratificó el Bien correctamente',
        };

        this.getGood(this.idBien, toast);
        this.form.get('estatus').setValue(_status.description);
        // this, this.onLoadToast('success', 'Ratificado', 'Estatus del Bien Actualizado')
      },
      error: err => {
        this.onLoadToast(
          'error',
          'Actualización del Status Bien',
          err.error.message
        );
      },
    });
  }

  // OBTENEMOS SCREEN STATUS FINAL //
  getScreenStatusFinal(good: any, toast: any) {
    let obj = {
      vc_pantalla: 'FACTJURDECABANDEV',
    };

    this.screenStatusService.getAllFiltroScreenKey(obj).subscribe(
      (response: any) => {
        const { data } = response;

        console.log('SCREEN', data);

        for (let i = 0; i < data.length; i++) {
          if (good.status == data[i].statusFinal.status) {
            this.alertInfo(toast.icon, toast.message, '');
            this.validRatificacion = false;
          } else {
            this.validRatificacion = true;
          }
        }
      },
      error => {
        this.onLoadToast(
          'info',
          'Declaración de Abandono',
          'No se encontró Estatus en la tabla Estatus_X_Pantalla'
        );
      }
    );
  }
}
