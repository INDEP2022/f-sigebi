import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-email-information',
  templateUrl: './email-information.component.html',
  styles: [],
})
export class EmailInformationComponent {
  maxDate: Date;
  constructor() {}
  form = new FormGroup({
    reasonForChange: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    date: new FormControl(null, Validators.required),
    from: new FormControl(null, Validators.required),
    to: new FormControl(null, Validators.required),
    cc: new FormControl(null, Validators.required),
    type: new FormControl(null, Validators.required),
    issue: new FormControl(null, Validators.required),
    body: new FormControl(null, Validators.required),
  });

  public from = new DefaultSelect();
  public tos = new DefaultSelect();
  public ccs = new DefaultSelect();
  public types = new DefaultSelect();

  @Output() eventEmailInformation = new EventEmitter();

  save() {
    console.log(this.form.value);
  }

  getFormEmailInformation() {
    return this.form;
  }

  changeType($event: any): void {
    this.form.get('body').setValue($event.bodyEmail);
    this.form.get('issue').setValue($event.subjectEmail);
  }

  send() {
    this.eventEmailInformation.emit(this.form.value);
  }

  convertEmailBody(id: any): string {
    const data: any = {
      1: 'Eliminación de Cargas Erróneas',
      2: 'Cambio de Periodos',
      3: 'Cambio de Bienes de Número Aleatorio',
    };
    return data?.[id] || id.toString();
  }
<<<<<<< HEAD
=======

  onChangeCc(event: any) {
    console.log(event);
    this.form.get('cc').setValue(event.id);
  }
  onChangeTo(event: any) {
    console.log(event);
    this.form.get('to').setValue(event.id);
  }
  onChangeFrom(event: any) {
    console.log(event);
    this.form.get('from').setValue(event.id);
  }

  cleanForm() {
    this.form.reset();
  }

  async getDate() {
    // console.log('date', );
    // const formattedDate = moment(date).format('DD-MM-YYYY');
    // if () {
    const fechaEscritura: any = new Date();
    fechaEscritura.setUTCDate(fechaEscritura.getUTCDate());
    const _fechaEscritura: any = new Date(fechaEscritura.toISOString());
    return _fechaEscritura ? _fechaEscritura : null;
    // } else {
    //   return null;
    // }
    // { authorizeDate: formattedDate }
    // { emitEvent: false }
  }
>>>>>>> 53f8457b23297af4c094d5e9ce9d3f84d08a27fb
}
