import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-layout-maintenance-modal',
  templateUrl: './layout-maintenance-modal.component.html',
  styles: [],
})
export class LayoutMaintenanceModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Layout';
  layout: any;
  edit: boolean = false;
  layoutForm: FormGroup = new FormGroup({});
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.layoutForm = this.fb.group({
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      screen: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      table: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      filter: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      status: [null, [Validators.required]],
    });
    if (this.layout !== undefined) {
      this.edit = true;
      this.layoutForm.patchValue(this.layout);
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
      ? this.onEdit.emit(this.layoutForm.value)
      : this.onAdd.emit(this.layoutForm.value);
    this.modalRef.hide();
  }
}
