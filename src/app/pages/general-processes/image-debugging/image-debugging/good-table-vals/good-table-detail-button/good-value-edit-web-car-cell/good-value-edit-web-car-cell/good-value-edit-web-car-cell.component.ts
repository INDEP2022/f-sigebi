import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';
import { POSITVE_NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { GoodsPhotoService } from 'src/app/pages/general-processes/image-debugging/services/image-debugging-service';

@Component({
  selector: 'app-good-value-edit-web-car-cell',
  templateUrl: './good-value-edit-web-car-cell.component.html',
  styleUrls: ['./good-value-edit-web-car-cell.component.scss'],
})
export class GoodValueEditWebCarCellComponent
  extends DefaultEditor
  implements OnInit
{
  // form: FormGroup = new FormGroup({});
  @Input() value: any;
  form: FormGroup;
  constructor(private fb: FormBuilder, private service: GoodsPhotoService) {
    super();
  }
  ngOnInit() {
    let validators = [];
    console.log(this.value);

    validators.push(Validators.required);
    if (
      [
        'HABITACIONES',
        'BAÑOS',
        'COCINA',
        'COMEDOR',
        'SALA',
        'ESTUDIO',
        'CUARTO DE SERVICIO',
        'NÚMERO DE SALAS',
        'NÚMERO DE LOCALES',
        'NÚMERO DE PISOS',
        'NÚMERO DE DEPARTAMENTOS',
        'ESPACIOS DE ESTACIONAMIENTO',
      ].includes(this.value.otvalor)
    ) {
      this.form = this.fb.group({
        info: [
          this.value.info,
          [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
        ],
      });
    } else {
      this.form = this.fb.group({
        info: [this.value.info, [Validators.required]],
      });
    }
    this.form.valueChanges.subscribe({
      next: response => {
        console.log(response, this.form.valid);
        if (this.form.valid && response.info) {
          this.service.dataDetails.forEach(item => {
            if (item.otclave === this.value.otclave) {
              item.info = response.info;
            }
          });
        }
      },
    });
  }
}
