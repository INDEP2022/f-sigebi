import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pa-cs-c-change-of-status',
  templateUrl: './pa-cs-c-change-of-status.component.html',
  styles: [],
})
export class PaCsCChangeOfStatusComponent implements OnInit {
  //Reactive Forms
  form: FormGroup;

  //Criterio por clasificación de bienes
  get numberGood() {
    return this.form.get('numberGood');
  }
  get descriptionGood() {
    return this.form.get('descriptionGood');
  }
  get currentStatus() {
    return this.form.get('currentStatus');
  }
  get descriptionStatus() {
    return this.form.get('descriptionStatus');
  }

  get processes() {
    return this.form.get('processes');
  }

  //Reactive Forms
  formNew: FormGroup;

  get newStatus() {
    return this.form.get('newStatus');
  }
  get newDescripcionStatus() {
    return this.form.get('newDescripcionStatus');
  }
  get dateStatus() {
    return this.form.get('dateStatus');
  }
  get newProcesses() {
    return this.form.get('newProcesses');
  }
  get userRequesting() {
    return this.form.get('userRequesting');
  }
  get userName() {
    return this.form.get('userName');
  }
  get description() {
    return this.form.get('description');
  }

  constructor(private fb: FormBuilder, private modalService: BsModalService) {}

  ngOnInit(): void {
    this.buildForm();
    this.buildFormNew();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      numberGood: [null, [Validators.required]],
      descriptionGood: [null, [Validators.required]],
      currentStatus: [null, [Validators.required]],
      descriptionStatus: [null, [Validators.required]],
      processes: [null, [Validators.required]],
    });
  }
  private buildFormNew() {
    this.formNew = this.fb.group({
      newStatus: [null, [Validators.required]],
      newDescripcionStatus: [null, [Validators.required]],
      dateStatus: [null, [Validators.required]],
      newProcesses: [null, [Validators.required]],
      userRequesting: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }
}
