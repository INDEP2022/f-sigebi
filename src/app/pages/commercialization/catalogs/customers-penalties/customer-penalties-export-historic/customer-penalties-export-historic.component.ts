import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IHistoryCustomersPenalties } from 'src/app/core/models/catalogs/customer.model';
import { ClientPenaltyService } from 'src/app/core/services/ms-clientpenalty/client-penalty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-customer-penalties-export-historic',
  templateUrl: './customer-penalties-export-historic.component.html',
  styles: [],
})
export class CustomersPenaltiesExportHistoricComponent
  extends BasePage
  implements OnInit
{
  iHistoryCustomersPenaltiesForm: ModelForm<IHistoryCustomersPenalties>;
  iHistoryCustomersPenalties: IHistoryCustomersPenalties;
  today: Date;
  title: string = 'Histórico Penalizaciones de Cliente';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private clientPenaltyService: ClientPenaltyService,
    private bsDatepickerConfig: BsDatepickerConfig
  ) {
    super();
    this.today = new Date();
    this.bsDatepickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.iHistoryCustomersPenaltiesForm = this.fb.group({
      customerId: [
        null,
        [Validators.maxLength(8), Validators.pattern(NUMBERS_PATTERN)],
      ],
      batchId: [
        null,
        [Validators.maxLength(10), Validators.pattern(NUMBERS_PATTERN)],
      ],
      penaltyId: [null, []],
      eventId: [
        null,
        [Validators.maxLength(7), Validators.pattern(NUMBERS_PATTERN)],
      ],
      batchPublic: [
        null,
        [Validators.maxLength(10), Validators.pattern(NUMBERS_PATTERN)],
      ],
      initialDate: [null, []],
      finalDate: [null, []],
      processType: [
        null,
        [Validators.maxLength(4), Validators.pattern(NUMBERS_PATTERN)],
      ],
      referenceJobOther: [
        null,
        [Validators.maxLength(200), Validators.pattern(STRING_PATTERN)],
      ],
      user: [null, []],
      flag: [null, []],
      recordNumber: [null, []],
      usrPenalize: [
        null,
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ],
      usrfree: [
        null,
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ],
      penalizesDate: [null, []],
      releasesDate: [null, []],
      causefree: [
        null,
        [Validators.maxLength(200), Validators.pattern(STRING_PATTERN)],
      ],
      nbOrigin: [null, []],
    });
    if (this.iHistoryCustomersPenalties != null) {
      this.edit = true;
      this.iHistoryCustomersPenaltiesForm.patchValue(
        this.iHistoryCustomersPenalties
      );

      const dbInitialDate =
        this.iHistoryCustomersPenaltiesForm.get('initialDate').value;
      const dbFinalDate =
        this.iHistoryCustomersPenaltiesForm.get('finalDate').value;
      const dbPenalizesDate =
        this.iHistoryCustomersPenaltiesForm.get('penalizesDate').value;
      const dbReleasesDate =
        this.iHistoryCustomersPenaltiesForm.get('releasesDate').value;

      const formattedDate1 = formatDate(dbInitialDate, 'dd/MM/yyyy', 'en-US');
      const formattedDate2 = formatDate(dbFinalDate, 'dd/MM/yyyy', 'en-US');
      const formattedDate3 = formatDate(dbPenalizesDate, 'dd/MM/yyyy', 'en-US');
      const formattedDate4 = formatDate(dbReleasesDate, 'dd/MM/yyyy', 'en-US');

      this.iHistoryCustomersPenaltiesForm
        .get('initialDate')
        .setValue(formattedDate1);
      this.iHistoryCustomersPenaltiesForm
        .get('finalDate')
        .setValue(formattedDate2);
      this.iHistoryCustomersPenaltiesForm
        .get('penalizesDate')
        .setValue(formattedDate3);
      this.iHistoryCustomersPenaltiesForm
        .get('releasesDate')
        .setValue(formattedDate4);

      this.iHistoryCustomersPenaltiesForm
        .get('initialDate')
        .setValue(this.addDays(new Date(dbInitialDate), 1));
      this.iHistoryCustomersPenaltiesForm
        .get('finalDate')
        .setValue(this.addDays(new Date(dbFinalDate), 1));
      this.iHistoryCustomersPenaltiesForm
        .get('penalizesDate')
        .setValue(this.addDays(new Date(dbPenalizesDate), 1));
      this.iHistoryCustomersPenaltiesForm
        .get('releasesDate')
        .setValue(this.addDays(new Date(dbReleasesDate), 1));
    }
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  clearFreeDate(propertyName: string) {
    this.iHistoryCustomersPenaltiesForm.get(propertyName).setValue(null);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.update();
  }

  update() {
    const model: IHistoryCustomersPenalties = {
      customerId: this.iHistoryCustomersPenaltiesForm.get('customerId').value,
      batchId: this.iHistoryCustomersPenaltiesForm.get('batchId').value,
      penaltyId: this.iHistoryCustomersPenaltiesForm.get('penaltyId').value,
      eventId: this.iHistoryCustomersPenaltiesForm.get('eventId').value,
      batchPublic: this.iHistoryCustomersPenaltiesForm.get('batchPublic').value,
      initialDate:
        this.iHistoryCustomersPenaltiesForm.get('initialDate').value !== null
          ? this.convertDateFormat(
              this.iHistoryCustomersPenaltiesForm.get('initialDate').value
            )
          : null,
      finalDate:
        this.iHistoryCustomersPenaltiesForm.get('finalDate').value !== null
          ? this.convertDateFormat(
              this.iHistoryCustomersPenaltiesForm.get('finalDate').value
            )
          : null,
      processType: this.iHistoryCustomersPenaltiesForm.get('processType').value,
      referenceJobOther:
        this.iHistoryCustomersPenaltiesForm.get('referenceJobOther').value,
      user: this.iHistoryCustomersPenaltiesForm.get('user').value,
      flag: this.iHistoryCustomersPenaltiesForm.get('flag').value,
      recordNumber:
        this.iHistoryCustomersPenaltiesForm.get('recordNumber').value,
      usrPenalize: this.iHistoryCustomersPenaltiesForm.get('usrPenalize').value,
      usrfree: this.iHistoryCustomersPenaltiesForm.get('usrfree').value,
      penalizesDate:
        this.iHistoryCustomersPenaltiesForm.get('penalizesDate').value !== null
          ? this.convertDateFormat(
              this.iHistoryCustomersPenaltiesForm.get('penalizesDate').value
            )
          : null,
      releasesDate:
        this.iHistoryCustomersPenaltiesForm.get('releasesDate').value !== null
          ? this.convertDateFormat(
              this.iHistoryCustomersPenaltiesForm.get('releasesDate').value
            )
          : null,
      causefree: this.iHistoryCustomersPenaltiesForm.get('causefree').value,
      nbOrigin: this.iHistoryCustomersPenaltiesForm.get('nbOrigin').value,
    };
    console.log(model);
    this.clientPenaltyService.updateCustomers2(model).subscribe({
      next: data => {
        this.handleSuccess(), this.modalRef.hide();
      },
      error: (error: any) => {
        this.alert(
          'warning',
          `No es Posible Actualizar el Histórico de Penalización del Cliente`,
          ''
        );
        this.modalRef.hide();
      },
    });
    this.modalRef.hide();
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
      : 'Penalización Guardada';
    this.alert('success', `${message} Correctamente`, '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
