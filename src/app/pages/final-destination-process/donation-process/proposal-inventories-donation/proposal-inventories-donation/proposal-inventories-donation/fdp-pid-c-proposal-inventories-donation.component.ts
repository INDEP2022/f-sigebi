import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_TABLE_1 } from './../columns-table-1';
import { COLUMNS_TABLE_2 } from '../columns-table-2';

@Component({
  selector: 'app-fdp-pid-c-proposal-inventories-donation',
  templateUrl: './fdp-pid-c-proposal-inventories-donation.component.html',
  styles: [],
})
export class FdpPidCProposalInventoriesDonationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  data1 = EXAMPLE_DATA1;
  data2 = EXAMPLE_DATA2;
  settings2 = { ...this.settings, actions: false };
  @Input() param: string = '';

  constructor(private fb: FormBuilder) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS_TABLE_1;
    this.settings2.columns = COLUMNS_TABLE_2;
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {}

  initForm() {
    this.form = this.fb.group({
      warehouseNumb: [null, []],
      coordination: [null, []],
    });
  }

  settingsChange($event: any, op: number): void {
    if (op == 1) this.settings = $event;
    else this.settings2 = $event;
  }
}

const EXAMPLE_DATA1 = [
  {
    idDonation: 1,
    donation: 'Donatorio',
    warehouseNumb: 1,
    warehouse: 'Desc_almacen',
    advanceProposal: 'Avance Prop',
    cveAuthorization: 'Cve_autoriza',
    authorizationDate: 'Fecha_Autoriza',
    request: 'Solicitud',
  },
];

const EXAMPLE_DATA2 = [
  {
    proposedKey: 1,
    idRequest: 'item81',
    numberGood: 2,
    proceedingsNumber: 4545,
    quantityInStock: 2,
    amountToDonate: 45,
    classificationNumberGood: 4,
    subtypeOfGood: 'desc_clasif_bien',
    description: 'descripción',
    delAdmin: 'del_admin',
  },
];
