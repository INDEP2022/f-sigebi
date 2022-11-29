import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-registration-of-interest-modal',
  templateUrl: './registration-of-interest-modal.component.html',
  styles: [],
})
export class RegistrationOfInterestModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Registro de Intereses';
  provider: any;
  edit: boolean = false;
  providerForm: FormGroup = new FormGroup({});

  @Output() onConfirm = new EventEmitter<any>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }
  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.providerForm = this.fb.group({
      tille: [null, [Validators.required]],
      mesTille: [null, [Validators.required]],
      mes: [null, [Validators.required]],
      anioTille: [null, [Validators.required]],
    });
    if (this.provider !== undefined) {
      this.edit = true;
      this.providerForm.patchValue(this.provider);
    } else {
      this.providerForm.controls['country'].setValue('MÉXICO');
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
    this.onConfirm.emit(this.providerForm.value);
    this.modalRef.hide();
  }
}
