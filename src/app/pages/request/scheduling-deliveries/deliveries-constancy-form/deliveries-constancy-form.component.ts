import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IProgrammingDeliveryGood } from 'src/app/core/models/good-programming/programming-delivery-good.model';
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
  @ViewChild('table', { static: false }) table: any;
  typeConstancy: number = null;
  goods: IProgrammingDeliveryGood[] = [];
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
    };
  }

  ngOnInit(): void {
    this.settings.columns = PERSONAL_ESTATE_COLUMNS;
    this.prepareForm();
    //personalEstateData
    this.personalEstateData = this.goods;
    setTimeout(() => {
      this.setColumns();
    }, 300);
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

  setColumns() {
    console.log(this.table);

    const table = this.table.grid.getColumns();
    const type1 = table.find((x: any) => x.id == 'amountDelivered');
    type1.hide = true;

    const type2 = table.find((x: any) => x.id == 'amountNotDelivered');
    type2.hide = true;

    const type3 = table.find((x: any) => x.id == 'anountNotAccelted');
    type3.hide = true;

    const type4 = table.find((x: any) => x.id == 'amountNotWhithdrawn');
    type4.hide = true;

    let lsColumna = '';
    let lsColumnaTot = '';
    switch (this.typeConstancy) {
      case 1: //amountDelivered
        (lsColumna = 'amountDelivered'), (lsColumnaTot = 'SumaBienesEnt');
        break;
      case 2:
        lsColumna = 'CantidadNoEntregados';
        lsColumnaTot = 'SumaBienesNoEnt';
        break;
      case 3:
        lsColumna = 'CantidadNoAceptados';
        lsColumnaTot = 'SumaBienesNoAce';
        break;
      default:
        lsColumna = 'CantidadNoRetirados';
        lsColumnaTot = 'SumaBienesNoRet';
        break;
    }

    const column = table.find((x: any) => x.id == lsColumna);
    column.hide = false;
  }

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
