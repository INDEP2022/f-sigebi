import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ClientPenaltyService } from 'src/app/core/services/ms-clientpenalty/client-penalty.service';
import { BasePage } from 'src/app/core/shared/base-page';
@Component({
  selector: 'app-customers-penalities-form',
  templateUrl: './customers-penalities-form.component.html',
  styles: [],
})
export class CustomersPenalitiesFormComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  customersPenalties: any;
  title: string = 'Liberar Cliente Penalizado';
  today: Date = new Date();
  userLog: string;

  constructor(
    private fb: FormBuilder,
    private clientPenaltyService: ClientPenaltyService,
    private modalRef: BsModalRef,
    private authService: AuthService //private clientPenaltyService: ClientPenaltyService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      clientId: [null, [Validators.required]],
      releaseDate: [null, []],
      userRelease: [null, []],
      releaseCause: [null, [Validators.required, Validators.maxLength(30)]],
    });

    if (this.customersPenalties) {
      const client: any = this.customersPenalties.clientId;
      this.form.get('clientId').setValue(client.id);
      this.form.get('userRelease').setValue(this.userLog);
      var formatted = new DatePipe('en-EN').transform(
        this.customersPenalties.penaltiDate,
        'dd/MM/yyyy',
        'UTC'
      );
      this.form.get('releaseDate').setValue(formatted);
      this.form.get('clientId').disable();
      this.form.get('userRelease').disable();
      this.form.get('releaseDate').disable();
      console.log(this.customersPenalties, this.userLog);
      //this.form
    }
  }

  confirm() {
    this.clientPenaltyService.update(this.form.getRawValue()).subscribe({
      next: resp => {
        this.handleSuccess();
      },
      error: err => {},
    });
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.alert('success', 'El cliente ha sido liberado', ``);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
