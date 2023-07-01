/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';

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
  test: boolean = true;
  good: any;
  statusFinal: any = null;
  params = new BehaviorSubject<ListParams>(new ListParams());
  notifications: any[] = [];
  validRatificacion: boolean = true;
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
    const id = this.activateRoute.snapshot.paramMap.get('id');
    if (id) this.idBien = String(id);
    this.getGood(id, toast);

    this.prepareForm();
    this.loading = true;
  }

  // PREPARAMOS EL FORMULARIO //
  private prepareForm() {
    this.form = this.fb.group({
      noBien: [this.idBien ? this.idBien : ''],
      descripcion: [''],
      cantidad: [''],
      estatus: [''],
      fechaNotificacion: [''],
      fechaNotificacion2: [''],
      fechaNotificacion3: [''],
      fechaTerminoPeriodo: [''],
      fechaTerminoPeriodo2: [''],
      fechaTerminoPeriodo3: [''],
      declaracionAbandonoSERA: [
        '',
        [Validators.required, Validators.maxLength(1000)],
      ],
    });
  }

  // OBTENEMOS DATA DEL BIEN //
  private getGood(id: number | string, toast: any) {
    this.goodService.getGoodById(id).subscribe(
      response => {
        console.log('RESPONSE', response);
        setTimeout(() => {
          this.good = response;

          this.getScreenStatusFinal(response, toast);
          this.loadGood(response);
        }, 100);
      },

      error => (this.loading = false)
    );
  }

  // LLENAR FORM - Y CARGAR DATA DEL BIEN - //
  async loadGood(good: any) {
    // DATA DE STATUSGOOD - PARA OBTENER LA DESCRIPCIÓN DE STATUS BIEN//
    let params = new ListParams();
    params['filter.status'] = `$ilike:${good.status}`;
    await this.statusGoodService.getAll(params).subscribe({
      next: (response: any) => {
        this.form.get('descripcion').setValue(good.description);
        this.form.get('cantidad').setValue(good.quantity);
        this.form.get('estatus').setValue(response.data[0].description);
        this.form
          .get('declaracionAbandonoSERA')
          .setValue(good.seraAbnDeclaration);
      },
      error: err => {
        this.form.get('descripcion').setValue(good.description);
        this.form.get('cantidad').setValue(good.quantity);
        this.form.get('estatus').setValue(good.status);
        this.form
          .get('declaracionAbandonoSERA')
          .setValue(good.seraAbnDeclaration);
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
      vc_pantalla: 'FACTJURDECLABAND',
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
          'Estatus por Pantalla',
          '¡No se encontró el Estatus Final!'
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
            this.updateGood(data[0], _statusFinal);
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
    // const formData: any = {
    //   numberProperty: data.numberProperty,
    //   notificationDate: this.form.get('fechaNotificacion').value,
    //   notifiedTo: data.notifiedTo,
    //   notifiedPlace: data.notifiedPlace,
    //   duct: data.duct,
    //   editPublicationDate: data.editPublicationDate,
    //   newspaperPublication: data.newspaperPublication,
    //   insertMethod: data.insertMethod,
    //   periodEndDate: this.form.get('fechaTerminoPeriodo').value,
    //   observation: data.observation,
    //   abandonmentExpirationDate: data.abandonmentExpirationDate,
    //   registerNumber: data.registerNumber,
    //   nameInstitutionNotified: data.nameInstitutionNotified,
    //   namePersonNotified: data.namePersonNotified,
    //   positionPersonNotified: data.positionPersonNotified,
    //   statusNotified: data.statusNotified,
    //   responseNotifiedDate: data.responseNotifiedDate,
    //   resolutionDescription: data.resolutionDescription,
    //   temporarySuspension: data.userCorrectsKey,
    //   definitiveSuspension: data.definitiveSuspension,
    //   userCorrectsKey: this.token.decodeToken().preferred_username,
    // };

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
  async updateGood(data: any, _status: any) {
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
      vc_pantalla: 'FACTJURDECLABAND',
    };

    this.screenStatusService.getAllFiltroScreenKey(obj).subscribe(
      (response: any) => {
        const { data } = response;

        console.log('SCREEN', data);

        if (good.status == data[0].statusFinal.status) {
          this.alertInfo(
            toast.icon,
            'Declaración de Abandono por Aseguramiento',
            toast.message
          );

          this.validRatificacion = false;
        } else {
          this.validRatificacion = true;
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
