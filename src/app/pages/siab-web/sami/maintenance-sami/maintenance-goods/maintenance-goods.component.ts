import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { ProgrammingGoodReceiptService } from 'src/app/core/services/ms-programming-good/programming-good-receipt.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-maintenance-goods',
  templateUrl: './maintenance-goods.component.html',
  styleUrls: ['./maintenance-goods.component.scss'],
})
export class MaintenanceGoodsComponent extends BasePage implements OnInit {
  form: FormGroup;
  readOnlyDebeDecir = true;
  constructor(
    private fb: FormBuilder,
    private service: GoodsInvService,
    private updateService: ProgrammingGoodReceiptService
  ) {
    super();
    this.form = this.fb.group({
      gestion: [null, [Validators.required]],
      dice: [null],
      debeDecir: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      justify: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  get gestion() {
    return this.form.get('gestion');
  }

  get debeDecir() {
    return this.form.get('debeDecir');
  }

  get justify() {
    return this.form.get('justify');
  }

  ngOnInit() {}

  searchDescription() {
    this.service
      .getDescription(this.gestion.value)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response.data) {
            this.form
              .get('dice')
              .setValue(response.data[0].AG_DESCRIPCION_BIEN);
          }
          this.readOnlyDebeDecir = false;
        },
      });
  }

  updateDescription() {
    this.alertQuestion(
      'question',
      'Se actualizará la descripción del Bien ',
      '¿Desea continuar?',
      'Continuar'
    ).then(question => {
      if (question.isConfirmed) {
        this.loader.load = true;
        // actualizar descripción
        this.updateService
          .updateDescBien({
            description: this.debeDecir.value,
            managementNum: this.gestion.value,
            reasonMantle: this.justify.value,
            usrMantle: localStorage.getItem('username'),
          })
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe({
            next: response => {
              if (response) {
                this.loader.load = false;
                this.alert(
                  'success',
                  'Actualización de descripción del Bien',
                  'Realizada correctamente'
                );
                this.clear();
              } else {
                this.loader.load = false;
                this.alert(
                  'error',
                  'Actualización de descripción del Bien',
                  'No realizada'
                );
              }
            },
            error: err => {
              this.loader.load = false;
              this.alert(
                'error',
                'Actualización de descripción del Bien',
                'No realizada'
              );
            },
          });
      }
    });
  }

  clear() {
    this.form.reset();
    this.readOnlyDebeDecir = true;
  }
}
