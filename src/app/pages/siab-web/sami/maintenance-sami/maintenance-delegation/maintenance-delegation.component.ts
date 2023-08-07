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
  selector: 'app-maintenance-delegation',
  templateUrl: './maintenance-delegation.component.html',
  styleUrls: ['./maintenance-delegation.component.scss'],
})
export class MaintenanceDelegationComponent extends BasePage implements OnInit {
  form: FormGroup;
  readOnlyJustify = true;
  solicitudTable: null;
  updateTable = 0;
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
      nuevaOficina: [null, [Validators.required]],
      justify: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  get solicitud() {
    return this.form.get('solicitud');
  }

  get nuevaOficina() {
    return this.form.get('nuevaOficina');
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
      'Se actualizará la Delegación',
      '¿Desea continuar?',
      'Continuar'
    ).then(async question => {
      if (question.isConfirmed) {
        this.loader.load = true;
        const res = await firstValueFrom(
          this.requestService
            .spMantenimeto({
              parameter: '2',
              data: this.solicitud.value,
              valueNumber: this.nuevaOficina.value,
              charValue: '',
            })
            .pipe(catchError(x => of(null)))
        );
        if (!res) {
          this.loader.load = false;
          this.alert('error', 'Actualización de Delegación', 'No realizada');
          return;
        }
        const res2 = await firstValueFrom(
          this.auditService
            .saveMotiveChangeLogBook({
              gestionNumber: this.nuevaOficina.value,
              reasonChange: this.justify.value + ' ' + res,
              userMovement: localStorage.getItem('username'),
            })
            .pipe(catchError(x => of(null)))
        );
        if (!res2) {
          this.loader.load = false;
          this.alert('error', 'Actualización de Delegación', 'No realizada');
          return;
        } else {
          this.alert(
            'success',
            'Actualización de Delegación',
            'Realizada Correctamente'
          );
          this.updateTable++;
          // this.clear();
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
