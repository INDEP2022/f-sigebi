import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, firstValueFrom, of } from 'rxjs';
import { UsrRelLogService } from 'src/app/core/services/ms-audit/usrrel-log.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { BasePage } from 'src/app/core/shared';
import {
  NUMBERS_POINT_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-maintenance-fraction',
  templateUrl: './maintenance-fraction.component.html',
  styleUrls: ['./maintenance-fraction.component.scss'],
})
export class MaintenanceFractionComponent extends BasePage implements OnInit {
  form: FormGroup;
  readOnlyJustify = true;
  goodNumber: number = null;
  fractionCod: string = null;
  constructor(
    private fb: FormBuilder,
    private goodProcessService: GoodProcessService,
    private auditService: UsrRelLogService
  ) {
    super();
    this.form = this.fb.group({
      gestion: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      newFraction: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_POINT_PATTERN)],
      ],
      justify: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  ngOnInit() {}

  get gestion() {
    return this.form.get('gestion');
  }

  get newFraction() {
    return this.form.get('newFraction');
  }

  get justify() {
    return this.form.get('justify');
  }

  fillGoodNumber() {
    if (this.gestion.valid) {
      this.goodNumber = this.gestion.value;
    }
  }

  fillFraction() {
    if (this.newFraction.valid) {
      this.fractionCod = this.newFraction.value;
    }
  }

  async update() {
    this.alertQuestion(
      'question',
      'Se actualizará la Fracción Arancelaria',
      '¿Desea continuar?',
      'Continuar'
    ).then(async question => {
      if (question.isConfirmed) {
        this.loader.load = true;
        const res = await firstValueFrom(
          this.goodProcessService
            .updateFraction({
              goodNum: this.gestion.value,
              newFraction: this.newFraction.value,
            })
            .pipe(catchError(x => of(null)))
        );
        if (!res) {
          this.loader.load = false;
          this.alert(
            'error',
            'Actualización de Fracción Arancelaria',
            'No realizada'
          );
          return;
        }
        const res2 = await firstValueFrom(
          this.auditService
            .saveMotiveChangeLogBook({
              gestionNumber: this.gestion.value,
              reasonChange: this.justify.value + ' ' + res,
              userMovement: localStorage.getItem('username'),
            })
            .pipe(catchError(x => of(null)))
        );
        if (!res2) {
          this.loader.load = false;
          this.alert(
            'error',
            'Actualización de Fracción Arancelaria',
            'No realizada'
          );
          return;
        } else {
          this.alert(
            'success',
            'Actualización de Fracción Arancelaria',
            'Realizada Correctamente'
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
    this.goodNumber = null;
    this.fractionCod = null;
  }
}
