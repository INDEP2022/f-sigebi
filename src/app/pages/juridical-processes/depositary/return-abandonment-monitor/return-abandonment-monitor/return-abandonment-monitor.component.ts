import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IGood } from 'src/app/core/models/ms-good/good';
import { INotificationXProperty } from 'src/app/core/models/ms-notification/notification.model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModalReasonComponent } from './modal-reason.component';

@Component({
  selector: 'app-return-abandonment-monitor',
  templateUrl: './return-abandonment-monitor.component.html',
  styles: [],
})
export class ReturnAbandonmentMonitorComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;

  get goodNumber() {
    return this.form.get('goodNumber');
  }
  get descriptionGood() {
    return this.form.get('descriptionGood');
  }
  get descriptionStatus() {
    return this.form.get('descriptionStatus');
  }
  get typeGood() {
    return this.form.get('typeGood');
  }
  get dateReturn() {
    return this.form.get('dateReturn');
  }
  get notificationDate() {
    return this.form.get('notificationDate');
  }
  get suspensionDate() {
    return this.form.get('suspensionDate');
  }
  get notificationDate1() {
    return this.form.get('notificationDate1');
  }
  get currentDays() {
    return this.form.get('currentDays');
  }
  get daysTerm() {
    return this.form.get('daysTerm');
  }
  get daysExpiration() {
    return this.form.get('daysExpiration');
  }

  get temporarySuspension() {
    return this.form.get('temporarySuspension');
  }
  get definitiveSuspension() {
    return this.form.get('definitiveSuspension');
  }

  jsonInterfaz: IGood;
  objJsonInterfaz: IGood[] = [];
  itemsJsonBienes: IGood[] = [];

  jsonNotificacion: INotificationXProperty[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodServices: GoodService,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    // this.getPlazosDias();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      numberGood: [null, [Validators.required]],
      goodNumber: [null, [Validators.required]],
      goodDescription: [null, [Validators.required]],

      goodStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeGood: [null, [Validators.required]],
      dateReturn: [null, [Validators.required]],
      notificationDate: [null, [Validators.required]],
      suspensionDate: [null, [Validators.required]],
      notificationDate1: [null, [Validators.required]],
      currentDays: [null, [Validators.required]],
      daysTerm: [null, [Validators.required]],
      daysExpiration: [null, [Validators.required]],
      temporarySuspension: [null, [Validators.required]],
      definitiveSuspension: [null, [Validators.required]],
    });
  }

  reason() {
    this.openModal();
  }

  openModal(): void {
    let num = this.form.get('goodNumber').value;
    var formatted = new DatePipe('en-EN').transform(
      this.form.get('notificationDate').value,
      'yyyy-MM-dd'
    );

    if (num != null && formatted != null) {
      const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
      modalConfig.initialState = { num, formatted };
      this.modalService.show(ModalReasonComponent, modalConfig);
    } else {
      this.onLoadToast('error', 'Error', 'Se requieren datos');
    }
  }

  getItemsNumberBienes() {
    this.goodServices.getAll().subscribe({
      next: resp => {
        this.itemsJsonBienes = [...resp.data];
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }

  onEnter() {
    this.form.get('goodDescription').setValue('');
    this.form.get('goodStatus').setValue('');
    this.form.get('typeGood').setValue('');
    this.form.get('notificationDate').setValue('');
    this.form.get('notificationDate1').setValue('');
    this.form.get('temporarySuspension').setValue('');
    this.form.get('definitiveSuspension').setValue('');

    let valor = this.form.get('goodNumber').value;
    if (valor != null) {
      this.goodServices.getByIdAndGoodId(valor, valor).subscribe({
        next: resp => {
          if (resp != null) {
            console.warn('=#####################################=');
            console.warn(JSON.stringify(resp));
            this.form.get('goodDescription').setValue(resp.description);
            this.form.get('goodStatus').setValue(resp.goodStatus);
            this.form.get('typeGood').setValue(resp.goodCategory);
            this.form.get('notificationDate').setValue(resp.notifyDate);
            this.detailMonitorDev(resp.goodReferenceNumber, resp.notifyDate);
            if (this.jsonNotificacion != null) {
              console.log('this.detailMonitorDev');
              this.form
                .get('notificationDate1')
                .setValue(this.jsonNotificacion[0].notificationDate);
              this.form
                .get('temporarySuspension')
                .setValue(this.jsonNotificacion[0].temporarySuspension);
              this.form
                .get('definitiveSuspension')
                .setValue(this.jsonNotificacion[0].definitiveSuspension);
              console.log(JSON.stringify(this.jsonNotificacion));
            }
          } else {
            this.onLoadToast(
              'error',
              'Error',
              'Debe ingresar un número de bien'
            );
          }
        },
        error: err => {
          let error = '';
          if (err.status === 0) {
            error = 'Revise su conexión de Internet.';
            this.onLoadToast('error', 'Error', error);
          } else {
            this.onLoadToast('error', 'Error', err.error.message);
          }
        },
      });
    } else {
      this.onLoadToast('error', 'Error', 'Debe ingresar un número de bien');
    }
  }

  detailMonitorDev(num: number, notDate: Date) {
    let valores = { numberProperty: num, notificationDate: notDate };
    this.getIterObjDates(num);
    this.notificationService.getNotificationxPropertyFilter(valores).subscribe({
      next: resp => {
        this.jsonNotificacion = resp.data;
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }

  updateRegistro() {
    if (this.jsonNotificacion != null) {
      var formatted = new DatePipe('en-EN').transform(
        this.form.get('notificationDate').value,
        'yyyy-MM-dd'
      );
      let obj = {
        notificationDate: new Date(formatted),
        number: this.form.get('goodNumber').value,
        responseNotifiedDate: this.form.get('notificationDate1').value,
        temporarySuspension: this.form.get('temporarySuspension').value,
        definitiveSuspension: this.form.get('definitiveSuspension').value,
      };

      this.notificationService
        .updateObservacion(this.form.get('goodNumber').value, formatted, obj)
        .subscribe({
          next: resp => {
            this.onLoadToast(
              'success',
              'Exito',
              JSON.stringify(resp.message[0])
            );
          },
          error: err => {
            let error = '';
            if (err.status === 0) {
              error = 'Revise su conexión de Internet.';
              this.onLoadToast('error', 'Error', error);
            } else {
              this.onLoadToast('error', 'Error', err.error.message);
            }
          },
        });
    }
  }

  fechaNow() {
    const now = new Date().toISOString().slice(0, 10);
    return new Date(now);
  }

  getPlazosDias(objLocal: INotificationXProperty[]) {
    let vn_dias_falt: number;
    let vn_tot_max: number;
    let vn_retraso_actual: number = 600;
    let vn_fec_notif: Date = new Date('2022-07-27');
    let vn_fec_notif_old: Date;
    let vn_fec_notif_new: Date;
    let vn_fec_term: Date;
    let vn_fec_term_old: Date;
    let vn_sta_notif: string; // = 'DE';
    let vn_cuenta: number;

    let blk_bie_di_dias_corrientes: number;
    let blk_bie_di_dias_corrientes_2: number;
    let blk_bie_di_dias_corrientes_3: number;
    let blk_bie_di_dias_plazo: number;
    let blk_bie_di_dias_plazo_2: number;
    let blk_bie_di_dias_plazo_3: number;
    let blk_bie_di_dias_sobregiro: number;
    let blk_bie_di_dias_sobregiro_2: number;
    let blk_bie_di_dias_sobregiro_3: number;
    let blk_bie_di_fec_notificacion_1: Date;
    let blk_bie_di_fec_notificacion_2: Date;
    let blk_bie_di_fec_notificacion_3: Date;
    let blk_bie_di_max3: number;
    let blk_bie_di_max2: number;
    let blk_bie_di_max1: number;
    let numero = objLocal.length;
    objLocal.forEach(element => {
      vn_fec_notif = new Date(element.notificationDate);
      vn_fec_term = new Date(element.periodEndDate);
      vn_sta_notif = element.statusNotified;

      if (vn_sta_notif == 'DE' || vn_sta_notif == 'SD') {
        alert('vn_cuenta' + vn_cuenta);
        vn_cuenta = vn_cuenta + 1;
        if ((vn_cuenta = 1)) {
          if (vn_fec_term == null) {
            //vn_retraso_actual = (this.fechaNow().getTime() - vn_fec_notif.getTime());
            vn_retraso_actual =
              (this.fechaNow().getTime() - vn_fec_notif.getTime()) /
              (1000 * 60 * 60 * 24);
          } else {
            //vn_retraso_actual = (vn_fec_term.getTime() - vn_fec_notif.getTime()) + (this.fechaNow().getTime() - vn_fec_term.getTime());
            vn_retraso_actual =
              (vn_fec_term.getTime() -
                vn_fec_notif.getTime() +
                (this.fechaNow().getTime() - vn_fec_term.getTime())) /
              (1000 * 60 * 60 * 24);
          }

          blk_bie_di_fec_notificacion_1 = vn_fec_notif;
          if (blk_bie_di_max1 == null) {
            vn_tot_max = 0;
          }
          vn_dias_falt = vn_tot_max - vn_retraso_actual;
          blk_bie_di_dias_corrientes = vn_retraso_actual;
          blk_bie_di_dias_plazo = vn_tot_max;
          blk_bie_di_dias_sobregiro = vn_dias_falt;
          vn_fec_notif_old = vn_fec_notif;
          vn_fec_term_old = vn_fec_term;
        } else if ((vn_cuenta = 2)) {
          alert('vn_cuenta' + vn_cuenta);
          if (
            vn_fec_term.getTime() -
              vn_fec_notif.getTime() +
              (this.fechaNow().getTime() - vn_fec_term.getTime()) ==
            null
          ) {
            vn_retraso_actual = 0;
          }

          blk_bie_di_fec_notificacion_2 = vn_fec_notif;
          if (blk_bie_di_max2 == null) {
            vn_tot_max = 0;
          }

          vn_dias_falt = vn_tot_max - vn_retraso_actual;

          if (vn_fec_notif_new.getTime() > vn_fec_term_old.getTime()) {
            if (
              vn_fec_term_old.getTime() -
              vn_fec_notif_old.getTime() +
              (vn_fec_notif_new.getTime() - vn_fec_term_old.getTime())
            ) {
              blk_bie_di_dias_corrientes = 0;
            }
            //blk_bie_di_dias_sobregiro = (vn_fec_term_old.getTime() - vn_fec_notif_new.getTime());
            blk_bie_di_dias_sobregiro =
              (vn_fec_term_old.getTime() - vn_fec_notif_new.getTime()) /
              (1000 * 60 * 60 * 24);
          } else {
            if (
              vn_fec_term_old.getTime() -
              vn_fec_notif_old.getTime() +
              (vn_fec_notif.getTime() - vn_fec_term_old.getTime())
            ) {
              blk_bie_di_dias_corrientes = 0;
            }
            //blk_bie_di_dias_sobregiro  = (vn_fec_term_old.getTime() - vn_fec_notif.getTime());
            blk_bie_di_dias_sobregiro =
              (vn_fec_term_old.getTime() - vn_fec_notif.getTime()) /
              (1000 * 60 * 60 * 24);
          }
          blk_bie_di_dias_corrientes_2 = vn_retraso_actual;
          blk_bie_di_dias_plazo_2 = vn_tot_max;
          blk_bie_di_dias_sobregiro_2 = vn_dias_falt;
          vn_fec_notif_old = vn_fec_notif;
          vn_fec_term_old = vn_fec_term;
          vn_fec_notif_new = null;
        } else if ((vn_cuenta = 3)) {
          if (
            vn_fec_term.getTime() -
            vn_fec_notif.getTime() +
            (this.fechaNow().getTime() - vn_fec_term.getTime())
          ) {
            vn_retraso_actual = 0;
          }

          blk_bie_di_fec_notificacion_3 = vn_fec_notif;

          if (blk_bie_di_max3 == null) {
            vn_tot_max = 0;
          }

          vn_dias_falt = vn_tot_max - vn_retraso_actual;
          if (vn_fec_notif_new.getTime() > vn_fec_term_old.getTime()) {
            if (
              vn_fec_term_old.getTime() -
              vn_fec_notif_old.getTime() +
              (vn_fec_notif_new.getTime() - vn_fec_term_old.getTime())
            ) {
              blk_bie_di_dias_corrientes_2 = 0;
            }
            //blk_bie_di_dias_sobregiro_2 = (vn_fec_term_old.getTime() - vn_fec_notif_new.getTime());
            blk_bie_di_dias_sobregiro_2 =
              (vn_fec_term_old.getTime() - vn_fec_notif_new.getTime()) /
              (1000 * 60 * 60 * 24);
          } else {
            if (
              vn_fec_term_old.getTime() -
              vn_fec_notif_old.getTime() +
              (vn_fec_notif.getTime() - vn_fec_term_old.getTime())
            ) {
              blk_bie_di_dias_corrientes_2 = 0;
            }
            //blk_bie_di_dias_sobregiro_2 = (vn_fec_term_old.getTime() - vn_fec_notif.getTime());
            blk_bie_di_dias_sobregiro_2 =
              (vn_fec_term_old.getTime() - vn_fec_notif_new.getTime()) /
              (1000 * 60 * 60 * 24);
          }
          blk_bie_di_dias_corrientes_3 = vn_retraso_actual;
          blk_bie_di_dias_plazo_3 = vn_tot_max;
          blk_bie_di_dias_sobregiro_3 = vn_dias_falt;
        }
      } else {
        if (vn_cuenta > 0) {
          alert('if (vn_cuenta > 0)' + vn_cuenta);
          if (vn_fec_notif_new == null) {
            vn_fec_notif_new = vn_fec_notif;
          }
        }
      }
    });
    if (numero == 1) {
      this.form.get('currentDays').setValue(blk_bie_di_dias_corrientes);
      this.form.get('daysTerm').setValue(blk_bie_di_dias_plazo);
      this.form.get('daysExpiration').setValue(blk_bie_di_dias_sobregiro);
    } else if (numero == 2) {
      this.form.get('currentDays').setValue(blk_bie_di_dias_corrientes_2);
      this.form.get('daysTerm').setValue(blk_bie_di_dias_plazo_2);
      this.form.get('daysExpiration').setValue(blk_bie_di_dias_sobregiro_2);
    } else if (numero == 3) {
      this.form.get('currentDays').setValue(blk_bie_di_dias_corrientes_3);
      this.form.get('daysTerm').setValue(blk_bie_di_dias_plazo_3);
      this.form.get('daysExpiration').setValue(blk_bie_di_dias_sobregiro_3);
    } else {
      this.onLoadToast('error', 'Error', 'No exite un registro');
    }
  }

  getIterObjDates(idGood: number) {
    let valores = { numberProperty: idGood };
    let objLocal: INotificationXProperty[] = [];
    this.notificationService
      .postNotificationxPropertyFilterDates(valores)
      .subscribe({
        next: resp => {
          objLocal = [...resp.data];
          this.getPlazosDias(objLocal);
        },
        error: err => {
          let error = '';
          if (err.status === 0) {
            error = 'Revise su conexión de Internet.';
            this.onLoadToast('error', 'Error', error);
          } else {
            this.onLoadToast('error', 'Error', err.error.message);
          }
        },
      });
  }
}
