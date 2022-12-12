import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-legal-regularization',
  templateUrl: './legal-regularization.component.html',
  styles: [],
})
export class LegalRegularizationComponent extends BasePage implements OnInit {
  //Reactive Forms
  form: FormGroup;

  get numberGood() {
    return this.form.get('numberGood');
  }
  get status() {
    return this.form.get('status');
  }
  get description() {
    return this.form.get('description');
  }
  get justifier() {
    return this.form.get('justifier');
  }

  goods: any[] = [
    {
      numberGood: '1',
      status: 'Estatus 1',
      description: 'Descripción del bien 1',
    },
    {
      numberGood: '2',
      status: 'Estatus 2',
      description: 'Descripción del bien 2',
    },
    {
      numberGood: '3',
      status: 'Estatus 3',
      description: 'Descripción del bien 3',
    },
    {
      numberGood: '4',
      status: 'Estatus 4',
      description: 'Descripción del bien 4',
    },
  ];
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      numberGood: [null, [Validators.required]],
      status: [null, [Validators.required]],
      description: [null, [Validators.required]],
      justifier: [null, [Validators.required]],
    });
  }

  loadGood() {
    let found: boolean = false;
    const good = this.numberGood.value;
    this.goods.forEach(element => {
      if (element.numberGood === good) {
        this.status.setValue(element.status);
        this.description.setValue(element.description);
        found = true;
      }
    });
    found
      ? this.onLoadToast('success', 'Bien encontrado', '')
      : this.onLoadToast('error', 'No se encontro el bien ingresado', '');
  }

  updateStatus(): any {
    if (this.goods) {
      this.goods.forEach((element: any) => {
        element.status = 'REJ';
      });
      console.log(this.goods);
      this.onLoadToast('success', 'Bien actualizado', '');
    } else {
      this.onLoadToast('error', 'no hay datos para cambiar', 'Error');
    }
  }
}
