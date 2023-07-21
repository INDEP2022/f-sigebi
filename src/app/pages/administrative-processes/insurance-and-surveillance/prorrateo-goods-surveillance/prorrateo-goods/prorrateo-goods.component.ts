import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { differenceInDays, parseISO } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IPolicyXBien } from 'src/app/core/models/ms-policy/policy.model';
import { PolicyService } from 'src/app/core/services/ms-policy/policy.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { convertFormatDate } from '../../../../../common/helpers/helpers';
//import { ProrrateoGoodSurveillanceModalComponent } from '../prorrateo-goods-surveillance/prorrateo-good-surveillance-modal/prorrateo-good-surveillance-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ProrrateoGoodSurveillanceModalComponent } from '../prorrateo-goods-surveillance/prorrateo-good-surveillance-modal/prorrateo-good-surveillance-modal.component';
import { PRORRATEGO_GOODS_COLUMNS } from './prorrateo-goods-columns';

@Component({
  selector: 'app-prorrateo-goods',
  templateUrl: './prorrateo-goods.component.html',
  styles: [],
})
export class ProrrateoGoodsComponent extends BasePage implements OnInit {
  goods: any[] = [];
  form: FormGroup;
  NoRequest: any;
  totalItems: number = 0;
  datebd: number;
  daysF: number;
  data = new LocalDataSource();
  columnFilters: any = [];
  keyA: string;
  dateIni: any;
  id: number;
  selectedRow: IPolicyXBien;
  good: any;
  @Input() elemento: string = '';
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private policyService: PolicyService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: PRORRATEGO_GOODS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.getByPolicyKey(this.elemento);
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filters.field) {
              case 'goodNumberId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'additionInsured':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'amountCousin':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'location':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'shortDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'statusGood':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'factorCostDaily':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'amountNoteCredit':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'di_dias_trans':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'daysPassed':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'responsibleShort':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getByPolicyKey(this.elemento);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getByPolicyKey(this.elemento));
  }

  getByPolicyKey(Key: string) {
    this.goods = [];
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.policyService.getByKeyId(Key, params).subscribe({
      next: response => {
        let lista = [];
        this.totalItems = response.count;
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
            goodNumberId: response.data[i].Goods.id,
            description: response.data[i].Goods.description,
            amountCousin: response.data[i].amountCousin,
            additionInsured: response.data[i].additionInsured,
            location: response.data[i].Goods.ubicationType,
            shortDate: response.data[i].shortDate,
            statusGood: response.data[i].Goods.status,
            factorCostDaily: response.data[i].factorCostDaily,
            amountNoteCredit: response.data[i].amountNoteCredit,
            di_dias_trans: daysTrans,
            daysPassed: this.daysF,
            responsibleShort: response.data[i].responsibleShort,
          };
          this.data.refresh();
          this.goods.push(dataForm);
          this.data.load(this.goods);
          this.keyA = response.data[i].policyKeyId;
          this.dateIni = response.data[i].beginningDateId;
          this.id = response.data[i].id;
          this.good = response.data[i].Goods.id;
        }
      },
      error: err => {
        this.onLoadToast(
          'error',
          'Se produjo un error, intentelo nuevamente',
          ''
        );
        this.goods = [];
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
  }

  loadModalgood() {
    this.openPushModalGood(false, this.id, this.keyA, this.dateIni);
  }

  formData(doc: any) {
    this.selectedRow = doc;
    this.openModalGood2(true, doc, this.keyA, this.dateIni, this.id);
  }

  openPushModalGood(
    newOrEdit: boolean,
    id: number,
    keyA: string,
    dateIni: Date
  ) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      newOrEdit,
      id,
      keyA,
      dateIni,
      Elemento: { Elemento: this.elemento },
      callback: (next: boolean) => {},
    };
    this.modalService.show(
      ProrrateoGoodSurveillanceModalComponent,
      modalConfig
    );
  }

  openModalGood2(
    newOrEdit: boolean,
    data: IPolicyXBien,
    keyA: any,
    dateIni: any,
    id: number
  ) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      newOrEdit,
      data,
      keyA,
      dateIni,
      id,
      callback: (next: boolean) => {
        if (next) this.getByPolicyKey(this.elemento);
      },
    };
    this.modalService.show(
      ProrrateoGoodSurveillanceModalComponent,
      modalConfig
    );
  }

  deletePolicyGood(params: any) {
    this.goods = [];
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        console.log('Params: ', params);
        let data = {
          goodNumberId: params.goodNumberId,
          policyKeyId: this.keyA,
          beginningDateId: this.dateIni,
        };
        console.log('Data: ', data);

        this.policyService.deletePolicyGood(data).subscribe({
          next: response => {
            this.alert(
              'success',
              'El registro se ha eliminado correctamente',
              ''
            );
            this.getByPolicyKey(this.elemento);
            this.data.load(this.goods);
          },
          error: err => {
            this.alert(
              'error',
              'Error',
              'Ocurrió un problema al eliminar el registro'
            );
            this.getByPolicyKey(this.elemento);
            this.data.load(this.goods);
          },
        });
      }
    });
  }
}
