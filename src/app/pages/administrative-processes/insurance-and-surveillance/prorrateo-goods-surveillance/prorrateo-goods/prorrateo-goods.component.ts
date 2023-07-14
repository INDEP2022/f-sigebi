import { Component, Input, OnInit } from '@angular/core';
import { differenceInDays, parseISO } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { PolicyService } from 'src/app/core/services/ms-policy/policy.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { convertFormatDate } from '../../../../../common/helpers/helpers';
import { PRORRATEGO_GOODS_COLUMNS } from './prorrateo-goods-columns';

@Component({
  selector: 'app-prorrateo-goods',
  templateUrl: './prorrateo-goods.component.html',
  styles: [],
})
export class ProrrateoGoodsComponent extends BasePage implements OnInit {
  goods: any[] = [];
  totalItems: number = 0;
  datebd: number;
  daysF: number;
  data = new LocalDataSource();
  @Input() elemento: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private policyService: PolicyService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: PRORRATEGO_GOODS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.getByPolicyKey(this.elemento);
  }

  getByPolicyKey(Key: string) {
    this.policyService.getByKeyId(Key).subscribe({
      next: response => {
        let lista = [];
        this.totalItems = response.data.length;
        for (let i = 0; i < response.data.length; i++) {
          lista.push(response.data[i].Goods);
          const dueDate = new Date();
          const formattedDueDate = this.formatDate(dueDate);
          this.datebd = response.data[i].Policies.termDate;
          let fec = convertFormatDate(formattedDueDate);
          let fecInic = convertFormatDate(this.datebd);
          this.daysF = differenceInDays(parseISO(fecInic), parseISO(fec));
          let dateIni = convertFormatDate(
            response.data[i].Policies.beginningDateId
          );
          let dateLim = convertFormatDate(response.data[i].Policies.termDate);
          const date = new Date();

          let daysTrans = 0;
          if (date < dateLim) {
            daysTrans = differenceInDays(parseISO(dateIni), parseISO(dateLim));
          }
          let dataForm = {
            goodId: response.data[i].Goods.id,
            description: response.data[i].Goods.description,
            amountCousin: response.data[i].Policies.amountCousin,
            additionInsured: response.data[i].additionInsured,
            location: response.data[i].Goods.ubicationType,
            expireDate: response.data[i].Goods.expireDate,
            statusGood: response.data[i].Goods.status,
            factorCostDaily: response.data[i].factorCostDaily,
            amountNoteCredit: response.data[i].amountNoteCredit,
            di_dias_trans: daysTrans,
            daysPassed: this.daysF,
            responsibleShort: response.data[i].responsibleShort,
          };
          this.goods.push(dataForm);
          this.data.load(this.goods);
        }
      },

      error: err => {
        console.log(err);
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
  }
}
