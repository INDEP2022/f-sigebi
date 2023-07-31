import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ICustomersPenalties } from 'src/app/core/models/catalogs/customer.model';
import { ClientPenaltyService } from 'src/app/core/services/ms-clientpenalty/client-penalty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-customer-penalties-modal',
  templateUrl: './customer-penalties-modal.component.html',
  styles: [],
})
export class CustomerPenaltiesModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Registro de Penalización y Cambio de Estatus';
  edit: boolean = false;

  form: FormGroup = new FormGroup({});
  customersPenalties: ICustomersPenalties;
  penalty: any;
  penalties: ICustomersPenalties;
  today: Date;

  @Output() data = new EventEmitter<{}>();

  constructor(
    private fb: FormBuilder,
    private clientPenaltyService: ClientPenaltyService,
    private modalRef: BsModalRef
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      typeProcess: [
        null,
        [Validators.maxLength(4), Validators.pattern(NUMBERS_PATTERN)],
      ],
      event: [
        null,
        [Validators.maxLength(7), Validators.pattern(NUMBERS_PATTERN)],
      ],
      eventKey: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      lotId: [
        null,
        [Validators.maxLength(10), Validators.pattern(NUMBERS_PATTERN)],
      ],
      startDate: [null],
      endDate: [null],
      refeOfficeOther: [
        null,
        [Validators.maxLength(200), Validators.pattern(STRING_PATTERN)],
      ],
      userPenalty: [
        null,
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ],
      penaltiDate: [null],
    });
    if (this.customersPenalties != null) {
      this.edit = true;
      this.form.patchValue(this.customersPenalties);

      const dbStartDate = this.form.get('startDate').value;
      const dbEndDate = this.form.get('endDate').value;
      const dbPenaltiDate = this.form.get('penaltiDate').value;

      const formattedDate1 = formatDate(dbStartDate, 'dd/MM/yyyy', 'en-US');
      const formattedDate2 = formatDate(dbEndDate, 'dd/MM/yyyy', 'en-US');
      const formattedDate3 = formatDate(dbPenaltiDate, 'dd/MM/yyyy', 'en-US');

      this.form.get('startDate').setValue(formattedDate1);
      this.form.get('endDate').setValue(formattedDate2);
      this.form.get('penaltiDate').setValue(formattedDate3);

      this.form
        .get('startDate')
        .setValue(this.addDays(new Date(dbStartDate), 1));
      this.form.get('endDate').setValue(this.addDays(new Date(dbEndDate), 1));
      this.form
        .get('penaltiDate')
        .setValue(this.addDays(new Date(dbPenaltiDate), 1));
    }
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  clearFreeDate(propertyName: string) {
    this.form.get(propertyName).setValue(null);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.loading = true;
    this.clientPenaltyService.updateCustomers(this.form.value).subscribe({
      next: data => {
        this.handleSuccess(), this.modalRef.hide();
      },
      error: (error: any) => {
        this.alert('warning', `No es Posible Actualizar el Cliente`, '');
        this.modalRef.hide();
      },
    });
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    if (this.form.valid) {
      this.clientPenaltyService.create(this.form.value).subscribe({
        next: data => {
          this.loading = false;
          this.handleSuccess();
          this.modalRef.hide();
        },
        error: error => {
          this.alert('warning', `No es Posible Crear el Cliente`, '');
          this.loading = false;
        },
      });
    } else {
      this.alert(
        'warning',
        'El Formulario no es Válido. Revise los Campos Requeridos',
        ''
      );
      this.loading = false;
    }
  }

  handleSuccess() {
    const message: string = this.edit
      ? 'Penalización Actualizada'
      : 'Penalización Creada';
    this.alert('success', `${message} Correctamente`, '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
