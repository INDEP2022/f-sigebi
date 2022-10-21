import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-warehouse-confirm',
  templateUrl: './warehouse-confirm.component.html',
  styles: [],
})
export class WarehouseConfirmComponent extends BasePage implements OnInit {
  responseForm: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.responseForm = this.fb.group({
      idWarehouse: [null, [Validators.required]],
      observation: [null, [Validators.required]],
    });
  }

  confirm() {}

  close() {
    this.modalService.hide();
  }
}
