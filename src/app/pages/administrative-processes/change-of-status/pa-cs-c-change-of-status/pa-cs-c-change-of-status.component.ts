import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { PaCsCModalChangeComponent } from '../pa-cs-c-modal-change/pa-cs-c-modal-change.component';
import { COLUMNS_STATUS, COLUMNS_USER, Data } from './columns';

@Component({
  selector: 'app-pa-cs-c-change-of-status',
  templateUrl: './pa-cs-c-change-of-status.component.html',
  styles: [],
})
export class PaCsCChangeOfStatusComponent implements OnInit {
  //Reactive Forms
  form: FormGroup;

  columns: any = COLUMNS_STATUS;
  columnsUser: any = COLUMNS_USER;
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
      descriptionGood: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      currentStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      descriptionStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      processes: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  private buildFormNew() {
    this.formNew = this.fb.group({
      newStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      newDescripcionStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dateStatus: [null, [Validators.required]],
      newProcesses: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      userRequesting: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      userName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [null, [Validators.required]],
    });
  }

  openModalStatus(): void {
    this.modalService.show(PaCsCModalChangeComponent, {
      initialState: this.columns,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  openModalUser(): void {
    this.modalService.show(PaCsCModalChangeComponent, {
      initialState: this.columnsUser,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  loandGood() {
    const good = this.numberGood.value;
    const data = Data;
    data.forEach(elemen => {
      if (elemen.numberGood === good) {
        this.setGood(elemen);
      }
    });
  }

  setGood(data: any) {
    this.descriptionGood.setValue(data.description);
    this.currentStatus.setValue(data.currentStatus);
    this.currentStatus.setValue(data.currentStatus);
    this.descriptionStatus.setValue(data.descriptionStatus);
    this.processes.setValue(data.processes);
  }

  accept() {
    console.log(this.formNew.value);
  }
}
