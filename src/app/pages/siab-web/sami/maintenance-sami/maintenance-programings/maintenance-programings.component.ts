import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponseMessage } from 'src/app/core/interfaces/list-response.interface';
import { ProgrammingGoodReceiptService } from 'src/app/core/services/ms-programming-good/programming-good-receipt.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  secondFormatDateTofirstFormatDate,
  secondFormatDateWidthTime,
} from 'src/app/shared/utils/date';
import {
  IProgramingReception,
  IprogrammingDelivery,
  IUpdateDateProgramingReceptionDTO,
} from '../../receipt-generation-sami/receipt-table-goods/ireceipt';

@Component({
  selector: 'app-maintenance-programings',
  templateUrl: './maintenance-programings.component.html',
  styleUrls: ['./maintenance-programings.component.scss'],
})
export class MaintenanceProgramingsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  idDisabled = true;
  disabledDates = true;

  constructor(
    private fb: FormBuilder,
    private service: ProgrammingGoodReceiptService
  ) {
    super();
    this.form = this.fb.group({
      typePrograming: [null, Validators.required],
      id: [null, Validators.required],
      fechaInicio: [null],
      fechaFin: [null],
      newFechaInicio: [null, Validators.required],
      newFechaFin: [null, Validators.required],
      txtMotivoCambio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.form
      .get('typePrograming')
      .valueChanges.pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.idDisabled = false;
            this.id.setValue(null);
            this.txtMotivoCambio.setValue(null);
            this.fechaInicio.setValue(null);
            this.fechaFin.setValue(null);
            this.newFechaInicio.setValue(null);
            this.newFechaFin.setValue(null);
            this.disabledDates = true;
            this.form.markAsUntouched();
            this.form.markAsPristine();
            // const temp = response;
            // this.clear();
            // this.typePrograming.setValue(temp);
          } else {
            this.idDisabled = true;
          }
          this.disabledDates = true;
        },
      });
  }

  get typePrograming() {
    return this.form.get('typePrograming');
  }

  get id() {
    return this.form.get('id');
  }

  get txtMotivoCambio() {
    return this.form.get('txtMotivoCambio');
  }

  get fechaInicio() {
    return this.form.get('fechaInicio');
  }

  get fechaFin() {
    return this.form.get('fechaFin');
  }

  get newFechaInicio() {
    return this.form.get('newFechaInicio');
  }

  get newFechaFin() {
    return this.form.get('newFechaFin');
  }

  get maxDate() {
    return this.newFechaFin ? this.newFechaFin.value : null;
  }

  get minDate() {
    return this.newFechaInicio ? this.newFechaInicio.value : null;
  }

  ngOnInit() {}

  private messages(response: any) {
    if (response) {
      this.alert('success', 'Actualización Correctamente', '');
      this.clear();
    } else {
      this.alert(
        'warning',
        'Error al Actualizar la fecha de la Programación',
        ''
      );
    }
    this.loader.load = false;
  }

  private updateDatesReception(body: IUpdateDateProgramingReceptionDTO) {
    this.service
      .updateDateProgramingReception(body)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.messages(response);
        },
        error: err => {
          this.loader.load = false;
          this.alert(
            'warning',
            'Error al Actualizar la fecha de la Programación',
            ''
          );
        },
      });
  }

  private updateDatesDelivery(body: IUpdateDateProgramingReceptionDTO) {
    this.service
      .updateDateProgramingDelivery(body)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.messages(response);
        },
        error: err => {
          this.loader.load = false;
          this.alert(
            'warning',
            'Error al Actualizar la fecha de la Programación',
            ''
          );
        },
      });
  }

  update() {
    const body = {
      idProgramming: this.id.value,
      typeProgramming: this.typePrograming.value,
      reasonMantle: this.txtMotivoCambio.value,
      usrMantle: localStorage.getItem('username'),
      dateStart: this.getDateDTO(this.newFechaInicio.value),
      dateEnd: this.getDateDTO(this.newFechaFin.value),
    };
    console.log(body);

    // return;
    this.alertQuestion(
      'question',
      'Se actualizarán las fechas de la Programación',
      '¿Desea continuar?',
      'Continuar'
    ).then(question => {
      if (question.isConfirmed) {
        this.loader.load = true;
        if (this.typePrograming.value === 'RECEPCION') {
          this.updateDatesReception(body);
        } else {
          this.updateDatesDelivery(body);
        }
      }
    });
  }

  private getDate(date: string) {
    if (date) {
      let split = date.split(' ');
      if (split.length === 0) {
        return secondFormatDateTofirstFormatDate(date);
      } else {
        return (
          secondFormatDateTofirstFormatDate(split[0]) +
          (split[1] ? ', ' + split[1] : '')
        );
      }
    }
    return null;
  }

  private getDateDTO(date: Date) {
    console.log(date);
    if (date) {
      return secondFormatDateWidthTime(date);
    }
    return null;
  }

  private fillDates(
    response:
      | IListResponseMessage<IProgramingReception>
      | IListResponseMessage<IprogrammingDelivery>
  ) {
    if (response && response.data && response.data.length > 0) {
      let startDate = this.getDate(response.data[0].startDate);
      if (startDate) {
        this.fechaInicio.setValue(startDate);
      }
      let endDate = this.getDate(response.data[0].endDate);
      if (endDate) {
        this.fechaFin.setValue(endDate);
      }
      this.disabledDates = false;
    } else {
      this.disabledDates = true;
    }
  }

  consultDates() {
    let params: FilterParams = new FilterParams();
    params.addFilter('id', this.id.value);
    if (this.typePrograming.value === 'RECEPCION') {
      this.service
        .getReceptions(params.getParams())
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            this.fillDates(response);
          },
        });
    }
    if (this.typePrograming.value === 'ENTREGA') {
      this.service
        .getDeliverys(params.getParams())
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            this.fillDates(response);
          },
        });
    }
  }

  clear() {
    this.form.reset({}, { onlySelf: true, emitEvent: false });
    this.idDisabled = true;
    this.disabledDates = true;
  }
}
