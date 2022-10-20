import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { APPROVAL_COLUMNS } from './approval-columns';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Component({
  selector: 'app-fdp-apd-c-approval-for-donation',
  templateUrl: './fdp-apd-c-approval-for-donation.component.html',
  styles: [],
})
export class FdpApdCApprovalForDonationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  response: boolean = false;
  data: any;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = APPROVAL_COLUMNS;
    this.data = EXAMPLE_DATA;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      keyEvent: [null, []],
      status: [null, []],
      regionalCoord: [null, []],
      typeUser: [null, []],
    });
  }

  onSubmit() {}

  search() {
    this.response = !this.response;
  }
}

const EXAMPLE_DATA = [
  {
    keyEvent: 'clave evento',
    capDate: '30/12/2022',
    entry: 'ingreso',
    statusEvent: 'ABIERTA',
  },
];
