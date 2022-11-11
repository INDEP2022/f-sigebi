import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { PERSONAL_ESTATE_COLUMNS } from './personal-estate-columns';

@Component({
  selector: 'app-deliveries-constancy-form',
  templateUrl: './deliveries-constancy-form.component.html',
  styleUrls: ['./deliveries-constancy.scss'],
})
export class DeliveriesConstancyFormComponent
  extends BasePage
  implements OnInit
{
  deliveryConstancyForm: FormGroup = new FormGroup({});
  showClientForm: boolean = true;
  personalEstates: boolean = true;
  edit: boolean = false;
  personalEstateData: any[] = [];
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: PERSONAL_ESTATE_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.deliveryConstancyForm = this.fb.group({
      radio: ['T.E'],
      typeConstancy: [null],
      identification: [null],
      numIdentification: [null],
      issuedBy: [null],
      name: [null],
      position: [null],
      identificationEstate: [null],
      numIdentificationEstate: [null],
      issuedByEstate: [null],
    });
  }

  typeUser(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
