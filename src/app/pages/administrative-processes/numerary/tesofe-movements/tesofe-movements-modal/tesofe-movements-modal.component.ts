import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IAccountMovement,
  IDetailAccountMovement,
} from 'src/app/core/models/ms-account-movements/account-movement.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  selectedRow: IDetailAccountMovement;
  additionalData: any;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private movementService: AccountMovementService,
    private authService: AuthService,
    private service: BankAccountService
  ) {
    super();
  }

  ngOnInit(): void {
    this.title = '  Movimiento ';
    this.prepareForm();
    this.newOrEdit;
    if (this.newOrEdit) {
      this.bank.no_cuenta;
      // Establecer el valor en el campo del formulario
      this.transformDate(this.additionalData.selectedRow['dateMotion']);
      this.form.patchValue({
        deposit: this.additionalData.selectedRow['deposit'],
        retiro: this.additionalData.selectedRow['withdrawal'],
      });
    }
  }

  transformDate(fechaInput: string) {
    const partesFecha = fechaInput.split('-'); // Dividir la fecha en partes: [año, mes, día]
    const fechaFormateada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;

    this.form.patchValue({
      dateMotion: fechaFormateada,
    });
  }

  close() {
    this.modalRef.hide();
    this.newOrEdit = false;
  }

  confirm() {
    if (this.form.invalid) return;
    if (this.newOrEdit) {
      this.update();
    } else {
      this.insertCuentas();
    }
  }

  insertCuentas() {
    this.newOrEdit = false;
    const model = {} as IAccountMovement;

    model.numberAccount = this.bank.no_cuenta as any;
    model.dateMotion = String(this.form.value.dateMotion);
    model.deposit = this.form.value.deposit;
    model.withdrawal = this.form.value.retiro;
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

  /*update(cuenta: any) {
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
  }*/
  update() {
    this.newOrEdit = true;
    const model = {} as IAccountMovement;
    //console.log("banco -> ",this.additionalData.selectedRow.accountNumber['cveAccount'] as any);
    model.numberAccount = this.additionalData.selectedRow.accountNumber[
      'accountNumber'
    ] as any;
    model.dateMotion = String(this.form.value.dateMotion);
    model.deposit = this.form.value.deposit;
    model.withdrawal = this.form.value.retiro;
    let token = this.authService.decodeToken();
    model.userinsert = token.name.toUpperCase();
    model.dateInsertion = String(new Date());
    model.numberMotion = this.additionalData.selectedRow.numberMotion || null;

    console.log('model -> ', model);
    this.movementService.update(model).subscribe({
      next: () => {
        this.handleSuccess();
        this.onLoadToast('success', 'Movimiento cuenta actualizado', '');
      },
      error: error => {
        this.onLoadToast('error', error.error.message, '');
      },
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      deposit: ['', Validators.required],
      dateMotion: ['', Validators.required],
      retiro: [''],
    });
  }

  handleSuccess() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  getMovementsAccount() {
    this.loading = true;
    this.service
      .getAllWithFiltersAccount(
        this.filterParams
          .getValue()
          .getParams()
          .concat('&sortBy=dateMotion:DESC')
      )
      .subscribe({
        next: resp => {
          //this.dataAcount = resp;
          //console.log(" this.dataAcount -> ", this.dataAcount);
          this.loading = false;
          //console.log('consulta mov -> ', resp);
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
    String(this.form.value.dateMotion);
    console.log(String(this.form.value.dateMotion));
  }

  validateDateMovement(body: any) {
    const date = new Date(body.motionDate);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    let data = {
      pAccountNumber: this.bank.no_cuenta,
      pMotionDate: formattedDate,
    };
    /*let data2 = {
        "pAccountNumber": 2,
        "pMotionDate": "2008-04-22"
      }*/

    console.log('data end ', data);
    //console.log("data end ",data2);
    this.movementService.postValidateClosingAccounts(data).subscribe({
      next: resp => {
        if (resp.data[0].account_closed > 0) {
          // Se encontró un registro en cierre_cuentas
          this.alertInfo(
            'info',
            'Validado',
            `Ya ha sido cerrado el periodo para esa fecha`
          );
        }
      },
      error: error => {
        this.alertInfo(
          'info',
          'Validado',
          `Ya ha sido cerrado el periodo para esa fecha`
        );
        //this.alert('error', 'error ', error.message);
      },
    });
  }

  onClickSelect(event: any) {
    console.log('event ', event);
    if (event != undefined) {
      let data = {
        accountNumber: this.bank.no_cuenta,
        motionDate: String(event),
      };
      //console.log("data -> ",data);
      this.validateDateMovement(data);
    }
  }
}
