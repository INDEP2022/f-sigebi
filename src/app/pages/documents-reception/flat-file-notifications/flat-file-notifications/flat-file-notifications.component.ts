import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { dateRangeValidator } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { FlatFileNotificationsService } from '../flat-file-notifications.service';

@Component({
  selector: 'app-flat-file-notifications',
  templateUrl: './flat-file-notifications.component.html',
  styles: [],
})
export class FlatFileNotificationsComponent extends BasePage implements OnInit {
  notificationsForm: FormGroup;
  invalidDate = false;
  maxDate: Date = new Date();

  get startDate(): AbstractControl {
    return this.notificationsForm.get('startDate');
  }
  get endDate(): AbstractControl {
    return this.notificationsForm.get('endDate');
  }
  constructor(
    private fb: FormBuilder,
    private fileNotificationServices: FlatFileNotificationsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.notificationsForm = this.fb.group(
      {
        delegation: [null, [Validators.required]],
        subdelegation: [null],
        startDate: [null, [Validators.required]],
        endDate: [null, [Validators.required]],
        file: [null],
        name: [null, [Validators.required]],
      },
      { validator: dateRangeValidator() }
    );
  }
  getEndDateErrorMessage(fin: any, ini: any) {
    console.log(fin, ini);
    const stard = new Date(ini.value).getTime();
    const end = new Date(fin.value).getTime();
    if (fin && ini) {
      return stard <= end
        ? null
        : 'La fecha de finalización debe ser mayor que la fecha de inicio.';
    }
    return '';
  }

  Generar() {
    const start = new Date(this.notificationsForm.get('startDate').value);
    const end = new Date(this.notificationsForm.get('endDate').value);

    const startTemp = `${start.getFullYear()}-0${
      start.getUTCMonth() + 1
    }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${
      end.getUTCMonth() + 1
    }-0${end.getDate()}`;

    this.fileNotificationServices
      .getFileNotification(
        this.notificationsForm.get('delegation').value,
        startTemp,
        endTemp
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.file.base64 !== '') {
            this.downloadExcel(resp.file.base64);
          } else {
            this.onLoadToast(
              'warning',
              'Advertencia',
              'Sin Datos Para los Rangos de Fechas Suministrados'
            );
          }
          return;
        },
      });
  }

  downloadExcel(pdf: any) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${pdf}`;
    const downloadLink = document.createElement('a');
    downloadLink.download = `${this.notificationsForm.value.name}`;
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.click();
    this.onLoadToast(
      'success',
      'Archivo de Notificaciones',
      'Generado Correctamente'
    );
  }

  cleanForm() {
    this.notificationsForm.reset();
  }
}
