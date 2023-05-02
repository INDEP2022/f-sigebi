import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
      issuedBy: [null, [Validators.pattern(STRING_PATTERN)]],
      name: [null, [Validators.pattern(STRING_PATTERN)]],
      position: [null, [Validators.pattern(STRING_PATTERN)]],
      identificationEstate: [null],
      numIdentificationEstate: [null],
      issuedByEstate: [null, [Validators.pattern(STRING_PATTERN)]],
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
