import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IBankAccount } from 'src/app/core/models/catalogs/bank-account.model';
import {
  ICuentaInsert,
  ItipoCuentas,
} from 'src/app/core/models/catalogs/bank-modelo-type-cuentas';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tesofe-movements-modal',
  templateUrl: './tesofe-movements-modal.component.html',
  styles: [],
})
export class TesofeMovementsModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  title: string;
  edit: boolean;
  done: boolean;

  @Output() objDeposito: IAccountMovement;
  @Output() public modalClick: EventEmitter<ItipoCuentas> = new EventEmitter();
  @Output() public modalDone: EventEmitter<boolean> = new EventEmitter();
  @Output() refresh = new EventEmitter<true>();

  objBank: IBankAccount;
  datoItem: ICuentaInsert;
  newOrEdit: boolean;
  editOrNew: boolean;
  movimiento: IAccountMovement;

  public iInsertaCuenta: ICuentaInsert = {
    withdrawal: null,
    numberMotion: null,
    deposit: null,
    dateMotion: null,
    userinsert: null,
    dateInsertion: null,
    numberAccount: null,
    accountNumber: {
      accountNumber: null,
      cveCurrency: null,
      cveBank: null,
      registerNumber: null,
      cveAccount: null,
    },
  };

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private movementService: AccountMovementService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.title = '  Movimientos ';
    this.prepareForm();
    this.editOrNew = this.newOrEdit;
  }

  close() {
    this.modalRef.hide();
    this.newOrEdit = false;
  }

  confirm() {
    if (this.form.invalid) {
      return;
    }

    this.newOrEdit
      ? this.updateCuenta(this.movimiento, this.form.value, this.objBank)
      : this.insertCuentas(this.form.value, this.objBank);

    this.modalClick.emit(this.form.value);
  }

  insertCuentas(formulairo: ItipoCuentas, bankAccount: IBankAccount) {
    this.newOrEdit = false;
    this.iInsertaCuenta.withdrawal = formulairo.withdrawal;
    this.iInsertaCuenta.numberMotion = this.handlenumberMotion();
    this.iInsertaCuenta.deposit = formulairo.deposit;
    this.iInsertaCuenta.dateMotion = formulairo.dateMotion;
    let token = this.authService.decodeToken();
    this.iInsertaCuenta.userinsert = token.name; //usuario;
    this.iInsertaCuenta.dateInsertion = new Date().toISOString().slice(0, 10);
    this.iInsertaCuenta.numberAccount = Number(bankAccount.cveAccount);
    this.iInsertaCuenta.accountNumber.accountNumber = Number(
      bankAccount.cveAccount
    ).toString();
    this.iInsertaCuenta.accountNumber.cveCurrency = bankAccount.cveCurrency;
    this.iInsertaCuenta.accountNumber.cveBank = bankAccount.cveBank;
    this.iInsertaCuenta.accountNumber.registerNumber = Number(
      bankAccount.cveAccount
    ).toString();
    this.iInsertaCuenta.accountNumber.cveAccount = bankAccount.cveAccount;

    this.addCuenta(this.iInsertaCuenta);
  }

  updateCuenta(
    cuenta: IAccountMovement,
    formulairo: ItipoCuentas,
    bankAccount: IBankAccount
  ) {
    let updateObj = {
      numberMotion: this.movimiento.numberMotion,
      deposit: formulairo.deposit,
      withdrawal: formulairo.withdrawal,
      numberAccount: this.movimiento.numberAccount,
      dateMotion: formulairo.dateMotion,
    };

    console.log(JSON.stringify(updateObj));
    this.update(updateObj);
  }

  addCuenta(cuenta: ICuentaInsert) {
    this.movementService.insert(cuenta).subscribe({
      next: X => {
        this.handleSuccess(), Swal.fire('Nuevo Registro', '', 'success');
      },
      error: err => {
        console.error('err =>   ' + JSON.stringify(err));
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
      withdrawal: ['', null],
      deposit: ['', Validators.required],
      dateMotion: ['', Validators.required],
    });
    if (this.movimiento != null) {
      this.form
        .get('dateMotion')
        .setValue(new Date(this.movimiento.dateMotion));
      this.form.get('withdrawal').setValue(this.movimiento.withdrawal);
      this.form.get('deposit').setValue(this.movimiento.deposit);
    }
  }

  handleSuccess() {
    this.modalRef.content.callback(true);
    this.refresh.emit(true);
    this.modalRef.hide();
    this.editOrNew = false;
    this.done = true;
  }

  handlenumberMotion() {
    return Math.floor(Math.random() * (500000 - 10 + 1) + 10);
  }
}
