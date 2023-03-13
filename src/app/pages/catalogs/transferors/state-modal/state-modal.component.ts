import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IState } from 'src/app/core/models/catalogs/state-model';

@Component({
  selector: 'app-state-modal',
  templateUrl: './state-modal.component.html',
  styles: [],
})
export class StateModalComponent implements OnInit {
  title: string = 'Estado por transferente';
  edit: boolean = false;

  stateForm: ModelForm<IState>;
  state: IState;

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.stateForm = this.fb.group({
      nametransferent: [null, []],
      statekey: [null, []],
    });
    if (this.state != null) {
      this.edit = true;
      this.stateForm.patchValue(this.state);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
