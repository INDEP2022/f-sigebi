import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pa-pcp-c-legal-regularization',
  templateUrl: './pa-pcp-c-legal-regularization.component.html',
  styles: [],
})
export class PaPcpCLegalRegularizationComponent implements OnInit {
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
  constructor(private fb: FormBuilder) {}

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

  updateStatus() {}
}
