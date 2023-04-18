import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS_TABLE_2 } from '../columns-table-2';
import { COLUMNS_TABLE_1 } from './../columns-table-1';

@Component({
  selector: 'app-proposal-inventories-donation',
  templateUrl: './proposal-inventories-donation.component.html',
  styles: [
    `
      .around-tag {
        background: #007bff;
        border-radius: 20px;
        padding: 1rem;
        width: max-content;
        color: white;
      }
    `,
  ],
})
export class ProposalInventoriesDonationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  data1: any = [];
  data2: any = [];
  settings2 = { ...this.settings, actions: false };
  @Input() param: string = '';

  constructor(private fb: FormBuilder, private reportService: SiabService) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS_TABLE_1;
    this.settings2.columns = COLUMNS_TABLE_2;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      warehouseNumb: [null, [Validators.pattern(STRING_PATTERN)]],
      coordination: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  exportInventory() {}

  callReport() {
    const { warehouseNumb, coordination } = this.form.value;

    const params = {
      ALMACEN_BUS: warehouseNumb,
      P_NO_DELEGACION: coordination,
      P_ID_DONATARIO: '',
      P_TIPO_SOLICITUD: 'DD',
      P_ID_SOLICITUD: '',
      CVE_PROP: '',
    };

    this.reportService.fetchReport('RDON_PROPUESTA_INV');
  }

  searchGoodDonac() {
    console.log(this.form.value);
  }

  settingsChange($event: any, op: number): void {
    if (op == 1) this.settings = $event;
    else this.settings2 = $event;
  }
}
