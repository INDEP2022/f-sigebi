import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-add-movement',
  templateUrl: './add-movement.component.html',
  styles: [],
})
export class AddMovementComponent extends BasePage implements OnInit {
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accountMovementService: AccountMovementService
  ) {
    super();
  }

  ngOnInit(): void {}
}
