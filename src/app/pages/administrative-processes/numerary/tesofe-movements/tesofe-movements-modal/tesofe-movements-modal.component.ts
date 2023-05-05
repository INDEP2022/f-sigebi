import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { BankAccount } from '../list-banks/bank';

@Component({
  selector: 'app-tesofe-movements-modal',
  templateUrl: './tesofe-movements-modal.component.html',
  styles: [],
})
export class TesofeMovementsModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  title: string;
  bank: BankAccount;
  newOrEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private movementService: AccountMovementService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.title = '  Movimiento ';
    this.prepareForm();
    this.newOrEdit;
  }

  close() {
    this.modalRef.hide();
    this.newOrEdit = false;
  }

  confirm() {
    if (this.form.invalid) return;
    this.insertCuentas();
  }

  insertCuentas() {
    this.newOrEdit = false;
    const model = {} as IAccountMovement;

    model.numberAccount = this.bank.no_cuenta as any;
    model.dateMotion = String(this.form.value.dateMotion);
    model.deposit = this.form.value.deposit;
    let token = this.authService.decodeToken();
    model.userinsert = token.name.toUpperCase();
    model.dateInsertion = String(new Date());
    model.numberMotion = '461242';

    this.movementService.create(model).subscribe({
      next: () => {
        this.handleSuccess();
        this.onLoadToast('success', 'Movimiento cuenta creado', '');
      },
      error: error => {
        this.onLoadToast('error', error.error.message, '');
      },
    });
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() - dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  update(cuenta: any) {
    this.movementService.update(cuenta).subscribe({
      next: data => {
        this.handleSuccess();
        Swal.fire('Actualizado', '', 'success');
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

  prepareForm() {
    this.form = this.fb.group({
      deposit: ['', Validators.required],
      dateMotion: ['', Validators.required],
    });
  }

  handleSuccess() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
