import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-service-type-prog-modal',
  templateUrl: './service-type-prog-modal.component.html',
  styles: [],
})
export class ServiceTypeProgModalComponent extends BasePage implements OnInit {
  selectedRow: any;
  form: ModelForm<any>;
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      space: [null, Validators.required],
    });
  }

  close() {
    this.modalRef.hide();
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
    console.log('this.selectedRow ', this.selectedRow);
  }

  selected() {
    console.log("this.form.get('space').value, ", this.form.get('space').value);
    this.modalRef.content.callback(true, this.form.get('space').value);
  }
}
