import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, firstValueFrom, of } from 'rxjs';
import { UsrRelLogService } from 'src/app/core/services/ms-audit/usrrel-log.service';
import { RequestsService } from 'src/app/core/services/requests/requests.service';
import { BasePage } from 'src/app/core/shared';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-maintenance-aclaration',
  templateUrl: './maintenance-aclaration.component.html',
  styleUrls: ['./maintenance-aclaration.component.scss'],
})
export class MaintenanceAclarationComponent extends BasePage implements OnInit {
  form: FormGroup;
  readOnlyJustify = true;
  solicitudTable: null;
  constructor(
    private fb: FormBuilder,
    private requestService: RequestsService,
    private auditService: UsrRelLogService
  ) {
    super();
    this.form = this.fb.group({
      solicitud: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      estatus: [null, [Validators.required]],
      justify: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  get solicitud() {
    return this.form.get('solicitud');
  }

  get estatus() {
    return this.form.get('estatus');
  }

  get justify() {
    return this.form.get('justify');
  }

  ngOnInit() {}

  fillSolicitud() {
    if (this.solicitud.valid) {
      this.solicitudTable = this.solicitud.value;
      this.readOnlyJustify = false;
    }
  }

  async update() {
    this.alertQuestion(
      'question',
      'Se actualizará el ESTATUS',
      '¿Desea continuar?',
      'Continuar'
    ).then(async question => {
      if (question.isConfirmed) {
        this.loader.load = true;
        const res = await firstValueFrom(
          this.requestService
            .spMantenimeto({
              parameter: '1',
              data: this.solicitud.value,
              valueNumber: this.estatus.value,
              charValue: '',
            })
            .pipe(catchError(x => of(null)))
        );
        if (!res) {
          this.alert('error', 'Actualización de ESTATUS', 'No realizada');
          this.loader.load = false;
          return;
        }
        const res2 = await firstValueFrom(
          this.auditService
            .saveMotiveChangeLogBook({
              gestionNumber: this.solicitud.value,
              reasonChange: this.justify.value + ' ' + res,
              userMovement: localStorage.getItem('username'),
            })
            .pipe(catchError(x => of(null)))
        );
        if (!res2) {
          this.loader.load = false;
          this.alert('error', 'Actualización de ESTATUS', 'No realizada');
          return;
        } else {
          this.alert(
            'success',
            'Actualización de ESTATUS',
            'Realizada correctamente'
          );
          this.clear();
        }
        this.loader.load = false;
      }
    });
  }

  clear() {
    this.form.reset();
    this.readOnlyJustify = true;
    this.solicitudTable = null;
  }
}
