import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-destination-acts-delegation',
  templateUrl: './destination-acts-delegation.component.html',
  styles: [],
})
export class DestinationActsDelegationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  bsModalRef?: BsModalRef;
  refresh: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: DelegationService,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  onSubmit() {}

  prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      subdelegation: [null, Validators.required],
    });
  }
  close() {
    this.modalRef.content.callback(this.refresh);
    this.modalRef.hide();
  }

  update() {}

  onDelegationsChange(event: any) {}
}
