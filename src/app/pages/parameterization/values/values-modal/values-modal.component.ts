import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-values-modal',
  templateUrl: './values-modal.component.html',
  styles: [],
})
export class ValuesModalComponent implements OnInit {
  valuesForm: FormGroup;

  title: string = 'Valores';
  edit: boolean = false;
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.valuesForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  close() {
    this.modalRef.hide();
  }
}
