import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-maintenance-deleg-subdeleg-modal',
  templateUrl: './maintenance-deleg-subdeleg-modal.component.html',
  styles: [],
})
export class MaintenanceDelegSubdelegModalComponent implements OnInit {
  title: string = 'Mantenimiento de Delegaciones y SubDelegaciones';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idDeleg: [null, [Validators.required]],
      descriptionDeleg: [null, [Validators.required]],
      idSubDeleg: [null, [Validators.required]],
      descriptionSubDeleg: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
