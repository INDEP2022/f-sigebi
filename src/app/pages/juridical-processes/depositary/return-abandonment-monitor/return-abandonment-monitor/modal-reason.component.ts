import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-modal-reason',
  template: `
    <app-card [header]="true" [footer]="true">
      <div class="ch-content" header>
        <h5 class="title">Monitor de abandono por devolución</h5>
      </div>
      <div body>
        <form [formGroup]="form" class="form-material">
          <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
              <form-field [control]="form.get('reason')" label="Motivo">
                <textarea
                  type="text"
                  class="form-control"
                  formControlName="reason"></textarea>
              </form-field>
            </div>
          </div>
        </form>
      </div>
      <div footer>
        <div class="row">
          <div class="col-md-6 col-sm-12 col-xs-12">
            <div class="d-flex justify-content-center">
              <div class="m-3">
                <button
                  (click)="return()"
                  type="button"
                  class="btn btn-primary btn-sm active">
                  Regresar
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-12 col-xs-12">
            <div class="d-flex justify-content-center">
              <div class="m-3">
                <button
                  type="button"
                  class="btn btn-success btn-sm active"
                  (click)="insertReason()">
                  Registrar motivo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-card>
  `,
  styles: [],
})
export class ModalReasonComponent extends BasePage implements OnInit {
  form: FormGroup;
  num: number;
  formatted: string;

  get reason() {
    return this.form.get('reason');
  }
  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      reason: [null, [Validators.required]],
    });
  }

  insertReason() {
    this.notificationService
      .updateObservacion(
        this.num,
        this.formatted,
        this.form.get('reason').value
      )
      .subscribe({
        next: resp => {
          this.onLoadToast('success', 'Se actualizo', 'resp.message');
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
    this.return();
  }

  return() {
    this.bsModalRef.hide();
  }
}
