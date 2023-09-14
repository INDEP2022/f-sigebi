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
  ratificado: boolean = false;

  //estatus: string = '';
  estatusFinalM: string = '';
  usuario: string = '';
  statusGood: string = '';

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
      message: 'El Bien ya se Encuentra Ratificado',
    };
    const id = this.activateRoute.snapshot.paramMap.get('id');
    if (id) this.idBien = String(id);

    this.getGood(id, toast);

    this.prepareForm();
    this.loading = true;

    //this.getDataNotixGood('PRP');
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
        console.log('getGood ', response);
        this.good = response;
        if (response.notifyDate != null) {
          this.form
            .get('fechaNotificacion')
            .setValue(this.formatDate(response.notifyDate));
        }

        this.getScreenStatusFinal(response, toast);
        this.loadGood(response);
        this.getScreenStatus(this.good);
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
        console.log('response 1', response);
        this.form.get('descripcion').setValue(good.description);
        this.form.get('cantidad').setValue(good.quantity);
        this.form.get('estatus').setValue(response.data[0].description);
        this.form
          .get('declaracionAbandonoSERA')
          .setValue(good.seraAbnDeclaration);
        let status = localStorage.getItem('status_bien');
        this.getDataNotixGood(status);
        this.statusGood = good.estatus.id;
        console.log(' this.statusGood ->', this.statusGood);
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
    if (this.ratificado != true) {
      console.log('estatus good ', this.statusGood);
      console.log('estatus usuario ', this.usuario);
      let status = localStorage.getItem('status_bien');
      if (this.usuario == null && this.statusGood != status) {
        //this.updateGood();
        this.UpdateNotificationXProperty();
      } else {
        this.ratificado = false;
        this.alert('error', 'No Se Puede Ratificar', '');
      }
    }
  }

  // BUSCAMOS EL STATUSFINAL EN LA TABLA STATUSXSCREEN //
  getScreenStatus(good: any) {
    let obj = {
      estatus: good.status,
      vc_pantalla: 'FACTJURDECLABAND',
    };
    console.log('getScreenStatus -> ', obj);
    let _statusFinal: any = {
      status: null,
    };

    this.screenStatusService.getAllFiltro(obj).subscribe({
      next: response => {
        const { data } = response;
        localStorage.setItem(
          'status_bien',
          response.data[0].statusFinal.status
        );
        _statusFinal.status = data[0].statusfinal;
        console.log('Status -> ', _statusFinal.status);
        console.log('data --> ', data[0]);
        //this.getDataNotixGood(_statusFinal);
      },
      error: err => {
        // this.getDataNotixGood(_statusFinal);
        // this.onLoadToast(
        //   'warning',
        //   'Estatus por Pantalla',
        //   '¡No se Encontró el Estatus Final!'
        // );
      },
    });
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
          console.log('NOTIFICATION X BIEN', response);

          const { data } = response;
          if (data[0].periodEndDate != null) {
            this.form
              .get('fechaTerminoPeriodo')
              .setValue(this.formatDate(data[0].periodEndDate));
          }
          if (data[0].notificationDate != null) {
            this.form
              .get('fechaNotificacion')
              .setValue(this.formatDate(data[0].notificationDate));
          }
          this.usuario = data[0].userCorrectsKey;
          console.log('Response -> ', response);
          console.log('Response data[0] -> ', data[0]);

          /*
          if (
            data[0].userCorrectsKey == null &&
            this.good.status != _statusFinal.status
          ) {
            console.log('status final -> ', _statusFinal);
            //this.UpdateNotificationXProperty(data[0]);
            //this.updateGood(data[0], _statusFinal);
          } else if (
            data[0].userCorrectsKey != null &&
            this.good.status != _statusFinal.status
          ) {
            this.onLoadToast(
              'warning',
              'Notificación por Bien',
              'Se encontró una Cve. de Usuario que Ractifica'
            );
          } else if (
            data[0].userCorrectsKey == null &&
            this.good.status == _statusFinal.status
          ) {
            this.onLoadToast(
              'warning',
              'Notificación por Bien',
              'El Estatus Bien y el Estatus Final son Iguales'
            );
          }*/
        },
        error: err => {
          this.onLoadToast(
            'error',
            'Notificación por Bien',
            'No se Encontró Registros en Notificación por Bien'
          );
        },
      });
  }

  // ACTUALIZAMOS EN LA TABLA NOTIFICACIÓNXBIENES
  async UpdateNotificationXProperty() {
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
      numberProperty: this.idBien,
      periodEndDate: this.form.get('fechaTerminoPeriodo').value || new Date(),
      userCorrectsKey: this.token.decodeToken().preferred_username,
    };

    console.log('formData ', formData);
    this.notificationService
      .updateNotiXProperty(
        this.idBien,
        this.formatDate2(this.form.get('fechaNotificacion').value),
        formData
      )
      .subscribe({
        next: response => {
          this.onLoadToast(
            'success',
            'Ratificado',
            'Se Modificó la Cve. del Usuario que Ratifica'
          );
          this.updateGood();
        },
        error: err => {
          console.log('error', err);
        },
      });
  }

  // ACTUALIZAR STATUS DEL BIEN //
  async updateGood() {
    // data.status = _status.status;
    // data.seraAbnDeclaration = this.form.get('declaracionAbandonoSERA').value;
    let status = localStorage.getItem('status_bien');
    let obj = {
      id: this.idBien,
      goodId: this.idBien,
      status: status,
      seraAbnDeclaration: this.form.get('declaracionAbandonoSERA').value,
    };

    this.goodService.updateWithParams(obj).subscribe({
      next: response => {
        this.delayedFunction('Se Ratificó el Bien Correctamente');

        //this.getGood(this.idBien, toast);
        this.form.get('estatus').setValue(status);
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
  getScreenStatusFinal(good: any, toast?: any) {
    let obj = {
      vc_pantalla: 'FACTJURDECLABAND',
    };

    this.screenStatusService.getAllFiltroScreenKey(obj).subscribe(
      (response: any) => {
        const { data } = response;

        console.log(' data[0].statusFinal.status ', data[0].statusFinal.status);
        console.log('good.status', good.status);
        if (good.status == data[0].statusFinal.status) {
          this.alertInfo(
            toast.icon,
            'Declaración de Abandono por Aseguramiento',
            toast.message
          );

          this.ratificado = true;
          this.validRatificacion = false;
          return;
        } else {
          this.validRatificacion = true;
        }
      },
      error => {
        this.onLoadToast(
          'info',
          'Declaración de Abandono',
          'No se encontró Estatus en la Tabla Estatus_X_Pantalla '
        );
      }
    );
  }

  formatDate(fecha: string) {
    return fecha.split('T')[0].split('-').reverse().join('/');
  }
  formatDate2(fecha: string) {
    return fecha.split('T')[0].split('/').reverse().join('-');
  }

  delayedFunction(message: string) {
    console.log('Inicio de la función');

    setTimeout(() => {
      this.alertInfo(
        'success',
        'Declaración de Abandono por Aseguramiento',
        message
      );
    }, 3000); // 2000 milisegundos (2 segundos) de retraso
  }
}
