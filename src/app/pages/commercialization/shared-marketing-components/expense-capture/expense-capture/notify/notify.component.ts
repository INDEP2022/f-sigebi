import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IUsersTracking } from 'src/app/core/models/ms-security/pup-user.model';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent extends BasePage implements OnInit {
  selectedParaUsers: IUsersTracking[] = [];
  selectedCCUsers: IUsersTracking[] = [];
  asunto: string;
  listUsers: any[] = [];
  paraSelect: DefaultSelect = new DefaultSelect();
  form: FormGroup;
  constructor(
    private modalRef: BsModalRef,
    private usersService: SecurityService,
    private expenseCaptureDataService: ExpenseCaptureDataService,
    private fb: FormBuilder,
    private emailService: EmailService
  ) {
    super();
  }

  get expense() {
    return this.expenseCaptureDataService.data;
  }

  get dataCompositionExpenses() {
    return this.expenseCaptureDataService.dataCompositionExpenses;
  }

  ngOnInit() {
    if (!this.form) {
      this.form = this.fb.group({
        para: [null, [Validators.required]],
        cc: [null],
        asunto: [
          null,
          [Validators.required, Validators.pattern(STRING_PATTERN)],
        ],
      });
    }
    if (this.asunto) {
      this.form.get('asunto').setValue(this.asunto);
    }
    this.searchUsersPara(new ListParams());
  }

  searchUsersPara(params: ListParams) {
    console.log(params);
    const filter = new FilterParams();
    filter.page = params.page;
    filter.limit = 100000;
    filter.addFilter('mail', 'NULL', SearchFilter.NOT);
    this.usersService.getAllUsersTracker(filter.getParams()).subscribe({
      next: response => {
        if (response && response.data) {
          this.listUsers = response.data.map(row => {
            return {
              ...row,
              info: row.mail + '-' + row.name,
            };
          });
          // this.dataUsers = response.data;
          this.paraSelect = new DefaultSelect(this.listUsers, response.count);
        } else {
          this.listUsers = [];
          // this.dataUsers = [];
          this.paraSelect = new DefaultSelect(this.listUsers, response.count);
        }
      },
      error: err => {
        // this.dataUsers = [];
        this.paraSelect = new DefaultSelect([]);
      },
    });
  }

  onParaChange(item: IUsersTracking) {
    console.log(item);
    this.selectedParaUsers.push(item);
  }

  onCCChange(item: IUsersTracking) {
    console.log(item);
    this.selectedCCUsers.push(item);
  }

  close() {
    this.modalRef.hide();
  }

  send() {
    let V_TOTAL_B = '';
    this.dataCompositionExpenses.forEach(row => {
      V_TOTAL_B = row.goodNumber + ',' + V_TOTAL_B;
    });

    const message =
      'Derivado de la solicitud de devolución presentada por ' +
      this.expense.providerName +
      ', el comité recomendó favorablemente la devolución del importe pagado en el evento ' +
      this.expense.eventNumber +
      ', por el lote ' +
      this.expense.lotNumber +
      ', respecto al número de siab. ' +
      V_TOTAL_B +
      '  Por lo que esta venta queda cancelada, esto con el fin de que se realicen las acciones correspondientes por cada área.';
    // this.alert('warning', 'Esta función aún no ha sido habilitada', '');
    console.log(this.form.get('para').value, this.form.get('cc').value);
    console.log(message);

    if (this.form.get('para').value.length === 0) {
      this.alert(
        'warning',
        'Para',
        'Debe seleccionar al menos un destinatario'
      );
      return;
    }

    const body: any = {
      emails_send: this.form.get('para').value.join(','),
      emails_cc: this.form.get('cc').value.join(','),
      subject: this.form.get('asunto').value,
      template: message,
    };

    console.log(body.emails_send);
    console.log(body.emails_send);

    this.emailService.sendEmailFormData(body).subscribe(
      res => {
        console.log(res);
        this.alert(
          'success',
          'Correo enviado',
          'El correo ha sido enviado correctamente'
        );
        this.modalRef.hide();
      },
      err => {
        console.log(err);
        this.alert(
          'error',
          'Error al enviar correo',
          'Ocurrió un error al enviar el correo'
        );
      }
    );
  }
}
