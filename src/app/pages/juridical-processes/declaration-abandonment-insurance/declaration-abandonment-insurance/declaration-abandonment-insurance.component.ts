/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { INotificationXProperty } from 'src/app/core/models/ms-notification/notification.model';
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
  good: any;
  statusFinal: any = null;
  params = new BehaviorSubject<ListParams>(new ListParams());
  notifications: any[] = [];

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
    const id = this.activateRoute.snapshot.paramMap.get('id');
    if (id) this.idBien = String(id);
    this.getGood(id);

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
      declaracionAbandonoSERA: ['', Validators.required],
    });
  }

  // OBTENEMOS DATA DEL BIEN //
  private getGood(id: number | string) {
    this.goodService.getGoodById(id).subscribe(
      response => {
        console.log('RESPONSE', response);
        setTimeout(() => {
          this.good = response;
          this.loadGood(response);
        }, 100);
      },

      error => (this.loading = false)
    );
  }

  // LLENAR FORM - Y CARGAR DATA DEL BIEN - //
  async loadGood(good: any) {
    if (
      good.numberChangeRatifiesDate != null &&
      good.numberChangeRatifiesUser != null
    ) {
      this.onLoadToast('error', 'Ratificado', 'No se puede Ratificar');
    } else {
      // DATA DE STATUS GOOD - PARA OBTENER LA DESCRIPCIÓN DE STATUS BIEN//
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

    console.log('OBJ', obj);
    this.screenStatusService.getAllFiltro(obj).subscribe(
      (response: any) => {
        const { data } = response;
        _statusFinal.status = data[0].status.status;

        this.getDataNotixGood(_statusFinal);
      },
      error => {
        this.onLoadToast(
          'error',
          'Ratificado',
          'No se encontró el Estatus Final en la tabla Estatus_X_Pantalla '
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
          console.log('NOTIFICATION X BIEN', response);
          const { data } = response;

          console.log('data[0].userCorrectsKey', data[0].userCorrectsKey);
          console.log('this.good.status', this.good.status);
          console.log('_statusFinal.status', _statusFinal.status);
          if (
            data[0].userCorrectsKey == null &&
            this.good.status != _statusFinal.status
          ) {
            console.log('SI');
            // this.UpdateNotificationXProperty(data[0])
            // this.updateGood(data[0], _statusFinal)
          }
        },
        error: err => {
          this.onLoadToast('error', 'Ratificado', err.error.message);
        },
      });
  }

  // ACTUALIZAMOS EN LA TABLA NOTIFICACIÓN X BIENES
  async UpdateNotificationXProperty(data: any) {
    const formData: INotificationXProperty = {
      numberProperty: data.numberProperty,
      notificationDate: data.notificationDate,
      notifiedTo: data.notifiedTo,
      notifiedPlace: data.notifiedPlace,
      duct: data.duct,
      editPublicationDate: data.editPublicationDate,
      newspaperPublication: data.newspaperPublication,
      insertMethod: data.insertMethod,
      periodEndDate: data.periodEndDate,
      observation: data.observation,
      abandonmentExpirationDate: data.abandonmentExpirationDate,
      registerNumber: data.registerNumber,
      nameInstitutionNotified: data.nameInstitutionNotified,
      namePersonNotified: data.namePersonNotified,
      positionPersonNotified: data.positionPersonNotified,
      statusNotified: data.statusNotified,
      responseNotifiedDate: data.responseNotifiedDate,
      resolutionDescription: data.resolutionDescription,
      temporarySuspension: data.userCorrectsKey,
      definitiveSuspension: data.definitiveSuspension,
      userCorrectsKey: this.token.decodeToken().preferred_username,
    };

    this.notificationService
      .updateNotificationxPropertyFilter(
        data.numberProperty,
        data.periodEndDate,
        formData
      )
      .subscribe({
        next: response => {
          this.onLoadToast(
            'success',
            'Ratificado',
            'Se modificó el CVE Usuario Ratifica'
          );
        },
        error: err => {
          this.onLoadToast('error', 'Ratificado', err.error.message);
        },
      });
  }

  // ACTUALIZAR STATUS DEL BIEN //
  async updateGood(data: any, _status: any) {
    data.status = _status.status;
    data.seraAbnDeclaration = this.form.get('declaracionAbandonoSERA').value;

    this.form.get('estatus').setValue(_status.description);

    // this.goodService.update(data).subscribe({
    //   next: response => {
    //     this, this.onLoadToast('success', 'Ratificado', 'Estatus del Bien Modificado')
    //   },
    //   error: err => {
    //     this.onLoadToast('error', 'Ratificado', err.error.message);
    //   },
    // })
  }
}
