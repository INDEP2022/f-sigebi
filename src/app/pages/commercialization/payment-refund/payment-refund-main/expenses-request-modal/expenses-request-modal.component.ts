import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-expenses-request-modal',
  templateUrl: './expenses-request-modal.component.html',
  styles: [],
})
export class ExpensesRequestModalComponent extends BasePage implements OnInit {
  title: string = 'Dato Variable';
  data: any;
  edit: boolean = false;
  dataForm: FormGroup = new FormGroup({});
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.dataForm = this.fb.group({
      beneficiary: [null, [Validators.required]],
      name: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      service: [null, [Validators.required]],
      documentation: [null, [Validators.required]],
    });
    if (this.data !== undefined) {
      this.edit = true;
      this.dataForm.patchValue(this.data);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para agregar control
    this.loading = false;
    this.edit
      ? this.onEdit.emit(this.dataForm.value)
      : this.onAdd.emit(this.dataForm.value);
    this.modalRef.hide();
  }
}
