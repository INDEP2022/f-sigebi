import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-modal-reason',
  template: `
    <app-card [header]="true" [footer]="true">
      <div class="ch-content" header>
        <h5 class="title">Monitor de abandono por aseguramiento</h5>
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
                <button type="button" class="btn btn-success btn-sm active">
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

  get reason() {
    return this.form.get('reason');
  }
  constructor(private fb: FormBuilder, private bsModalRef: BsModalRef) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      reason: [null, [Validators.required]],
    });
  }

  mostrar() {}

  return() {
    this.bsModalRef.hide();
  }
}
