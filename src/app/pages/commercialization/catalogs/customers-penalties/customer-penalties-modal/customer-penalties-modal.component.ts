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

  clientId: number;
  eventId: number;
  lotId: number;
  publicLot: number;

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
    this.clientId = this.customersPenalties.clientId?.id;
    this.eventId = this.customersPenalties.eventId?.id;
    this.lotId = this.customersPenalties.lotId?.id;
    this.publicLot = this.customersPenalties.lotId?.publicLot;
    this.form.patchValue({
      clientId: this.clientId,
      eventId: this.eventId,
      lotId: this.lotId,
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      clientId: [
        null,
        [
          Validators.required,
          Validators.maxLength(13),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      id: [
        null,
        [
          Validators.required,
          Validators.maxLength(13),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      typeProcess: [
        null,
        [Validators.maxLength(4), Validators.pattern(NUMBERS_PATTERN)],
      ],
      eventId: [
        null,
        [Validators.maxLength(7), Validators.pattern(NUMBERS_PATTERN)],
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
        [
          //Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      penaltiDate: [
        null,
        [
          //Validators.required
        ],
      ],
      publicLot: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      user: [
        null,
        [
          //Validators.required,
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      pFlag: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      registernumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });
    if (this.customersPenalties != null) {
      this.edit = true;
      this.form.patchValue(this.customersPenalties);

      //this.form.controls['clientId'].setValue(this.customersPenalties.clientId.id);
      console.log(this.customersPenalties);

      if (this.form.get('startDate').value === null) {
        this.form.get('startDate').value.reset();
      } else {
        const dbReleaseDate = this.form.get('startDate').value;
        const formattedDate1 = formatDate(dbReleaseDate, 'dd/MM/yyyy', 'en-US');
        this.form.get('startDate').setValue(formattedDate1);
        this.form
          .get('startDate')
          .setValue(this.addDays(new Date(dbReleaseDate), 1));
      }

      if (this.form.get('endDate').value === null) {
        this.form.get('endDate').value.reset();
      } else {
        const dbBlackListDate = this.form.get('endDate').value;
        const formattedDate2 = formatDate(
          dbBlackListDate,
          'dd/MM/yyyy',
          'en-US'
        );
        this.form.get('endDate').setValue(formattedDate2);
        this.form
          .get('endDate')
          .setValue(this.addDays(new Date(dbBlackListDate), 1));
      }

      if (this.form.get('penaltiDate').value === null) {
        this.form.get('penaltiDate').value.reset();
      } else {
        const dbFreeDate = this.form.get('penaltiDate').value;
        const formattedDate3 = formatDate(dbFreeDate, 'dd/MM/yyyy', 'en-US');
        this.form.get('penaltiDate').setValue(formattedDate3);
        this.form
          .get('penaltiDate')
          .setValue(this.addDays(new Date(dbFreeDate), 1));
      }
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
    const clientId = this.customersPenalties.clientId.id;
    const lotId = this.form.get('lotId');
    const eventId = this.form.get('eventId');
    const endDate = this.form.get('endDate');
    const penaltyId = this.customersPenalties.id;
    const pFlag = this.customersPenalties.pFlag;
    const penaltiDate = this.form.get('penaltiDate');
    const publicLot = this.customersPenalties.publicLot;
    const refeOfficeOther = this.form.get('refeOfficeOther');
    const registernumber = this.customersPenalties.registernumber;
    const startDate = this.form.get('startDate');
    const typeProcess = this.form.get('typeProcess');
    const user = this.customersPenalties.user;
    const userPenalty = this.customersPenalties.userPenalty;
    const model: any = {
      //customerId: clientId,
      /*clientId: this.form.controls['clientId'].value,
      //customerId: 
      batchId: lotId.value,
      eventId: eventId.value,
      finalDate: endDate.value,
      penaltyId: this.form.controls['id'].value,
      pFlag: pFlag,
      penalizesDate: penaltiDate.value,
      batchPublic: publicLot,
      referenceJobOther: refeOfficeOther.value,
      recordNumber: registernumber,
      initialDate: startDate.value,
      processType: typeProcess.value,
      user: user,
      usrPenalize: userPenalty,
      nbOrigin: null,*/

      customerId: this.form.controls['clientId'].value,
      batchId: lotId.value,
      penaltyId: this.form.controls['id'].value,
      eventId: eventId.value,
      batchPublic: publicLot,
      initialDate: startDate.value,
      finalDate: endDate.value,
      processType: typeProcess.value,
      referenceJobOther: refeOfficeOther.value,
      user: user,
      pFlag: pFlag,
      recordNumber: registernumber,
      usrPenalize: userPenalty,
      penalizesDate: penaltiDate.value,
      nbOrigin: null,
    };
    console.log(model);
    this.clientPenaltyService.updateCustomers1(model).subscribe({
      next: data => {
        this.handleSuccess();
        this.modalRef.hide();
      },
      error: (error: any) => {
        this.alert('warning', `No es Posible Actualizar el Cliente`, '');
        //this.modalRef.hide();
      },
    });
    //this.modalRef.hide();
  }

  create() {
    this.loading = true;
    const clientId = this.form.get('clientId'); //
    const lotId = this.form.get('lotId'); //
    const eventId = this.form.get('eventId'); //
    const endDate: string | null =
      this.form.get('endDate').value !== null
        ? this.convertDateFormat(this.form.get('endDate').value)
        : null;
    const id = this.form.get('id'); //
    const pFlag = this.form.get('pFlag');
    const penaltiDate: string | null =
      this.form.get('penaltiDate').value !== null
        ? this.convertDateFormat(this.form.get('penaltiDate').value)
        : null; //
    const publicLot = this.form.get('publicLot');
    const refeOfficeOther = this.form.get('refeOfficeOther');
    const registernumber = this.form.get('registernumber');
    const startDate: string | null =
      this.form.get('startDate').value !== null
        ? this.convertDateFormat(this.form.get('startDate').value)
        : null;
    const typeProcess = this.form.get('typeProcess');
    const user = this.form.get('user');
    const userPenalty = this.form.get('userPenalty');
    const model: any = {
      //clientId: clientId.value,
      /*customerId: clientId.value,
      batchId: lotId.value,
      eventId: eventId.value,
      batchPublic: publicLot.value,
      penaltyDate: penaltiDate,
      penaltyId: id.value,
      referenceJobOther: refeOfficeOther.value,
      userPenalty: userPenalty.value,
      lotId: lotId.value,
      initialDate: startDate,
      finalDate: endDate,
      processType: typeProcess.value,
      pFlag: pFlag.value,
      user: user.value,
      registernumber: registernumber.value,
      nbOrigin: null,*/
      customerId: clientId.value,
      batchId: lotId.value,
      penaltyId: id.value,
      eventId: eventId.value,
      batchPublic: publicLot.value,
      initialDate: startDate,
      finalDate: endDate,
      processType: typeProcess.value,
      referenceJobOther: refeOfficeOther.value,
      user: user.value,
      pFlag: pFlag.value,
      recordNumber: registernumber.value,
      usrPenalize: userPenalty.value,
      penalizesDate: penaltiDate,
      nbOrigin: null,
    };
    console.log(model);
    if (this.form.valid) {
      this.clientPenaltyService.create(model).subscribe({
        next: data => {
          this.loading = false;
          this.handleSuccess();
          //this.modalRef.hide();
        },
        error: error => {
          this.alert('warning', `No es Posible Crear el Cliente`, '');
          this.loading = false;
          console.log(error);
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

  convertDateFormat(inputDate: string | Date): string {
    if (inputDate instanceof Date) {
      return formatDate(inputDate, 'yyyy-MM-dd', 'en-US');
    } else if (typeof inputDate === 'string') {
      const parts = inputDate.split('/');
      if (parts.length !== 3) {
        throw new Error('Fecha en Formato Incorrecto: ' + inputDate);
      }
      return parts[2] + '-' + parts[1] + '-' + parts[0];
    } else {
      throw new Error('Formato de Fecha Inválido: ' + inputDate);
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
