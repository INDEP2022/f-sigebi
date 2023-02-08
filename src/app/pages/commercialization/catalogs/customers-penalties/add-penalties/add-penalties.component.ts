import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-add-penalties',
  templateUrl: './add-penalties.component.html',
  styles: [],
})
export class AddPenaltiesComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  edit: boolean = false;
  title: string = 'Registro de Penalización y Cambio de Estatus';
  penalty: any; //IPenalty

  @Output() data = new EventEmitter<{}>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      status: [null, [Validators.required]],
      event: [null, [Validators.required]],
      eventKey: [null, [Validators.required]],
      customerId: [null, [Validators.required]],
      customerName: [null, [Validators.required]],
      batch: [null, [Validators.required]],
      batchId: [null, [Validators.required]],
      typePenalty: [null, [Validators.required]],
      penaltyDescription: [null, [Validators.required]],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      penaltyDate: [null, [Validators.required]],
    });

    if (this.penalty != null) {
      this.edit = true;
      this.form.patchValue(this.penalty);
      this.form.updateValueAndValidity();
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    let data = this.form.value;
    this.data.emit(data);
    this.modalRef.hide();
  }
}
