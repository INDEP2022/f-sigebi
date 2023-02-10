import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { FlatFileNotificationsService } from '../flat-file-notifications.service';

@Component({
  selector: 'app-flat-file-notifications',
  templateUrl: './flat-file-notifications.component.html',
  styles: [],
})
export class FlatFileNotificationsComponent extends BasePage implements OnInit {
  notificationsForm: FormGroup;

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
    this.notificationsForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null],
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      file: [null],
    });
  }

  Generar() {
    const start = new Date(this.notificationsForm.get('from').value);
    const end = new Date(this.notificationsForm.get('to').value);

    const startTemp = `${start.getFullYear()}-0${
      start.getUTCMonth() + 1
    }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${
      end.getUTCMonth() + 1
    }-0${end.getDate()}`;

    // const body = {
    //  delegation: this.notificationsForm.get('delegation').value,
    //  subdelegation: this.notificationsForm.get('subdelegation').value,
    //  from: this.notificationsForm.get('from').value,
    //  to: this.notificationsForm.get('to').value,
    // }

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
              'advertencia',
              'Sin datos para los rangos de fechas suministrados'
            );
          }

          return;
        },
      });
  }

  downloadExcel(pdf: any) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${pdf}`;
    const downloadLink = document.createElement('a');
    //console.log(linkSource);
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.click();
    this.onLoadToast('success', '', 'Archivo generado');
  }
}
