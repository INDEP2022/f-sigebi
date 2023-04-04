import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IFinancialInformationT } from 'src/app/core/models/catalogs/financial-information-model';
import { IGood } from 'src/app/core/models/good/good.model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { FinantialInformationService } from 'src/app/core/services/ms-parameter-finantial/finantial-information.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  FINANCIAL_INFORMATION_COLUMNS1,
  FINANCIAL_INFORMATION_COLUMNS2,
} from './financial-information-columns';

@Component({
  selector: 'app-financial-information',
  templateUrl: './financial-information.component.html',
  styles: [],
})
export class FinancialInformationComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  data1: IGood[] = [];
  good: IGood;
  id: number = 0;
  finantialList: IFinancialInformationT[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  settings1;
  settings2;
  data2: any[] = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  date: string;
  proficientOpinion: string;
  valuerOpinion: string;
  observations: string;
  quantity: number;
  description: string;
  goodId: number;
  selectedRows: any;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private goodService: GoodService,
    private finantialInformationService: FinantialInformationService
  ) {
    super();
    this.settings1 = {
      ...TABLE_SETTINGS,
      ...this.settings,
      actions: false,
      columns: FINANCIAL_INFORMATION_COLUMNS1,
    };

    this.settings2 = {
      editable: true,
      ...TABLE_SETTINGS,
      ...this.settings,
      actions: false,
      columns: FINANCIAL_INFORMATION_COLUMNS2,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null],
      date: [null],
      dictaminatedBy: [null],
      avaluo: [null],
      observations: [null],
    });
  }
  onChangeGood() {
    this.searchGoods(this.form.value.noBien);
  }
  searchGoods(idGood: number | string) {
    this.goodService.getByIdNew(idGood, idGood).subscribe({
      next: response => {
        this.good = response;
        this.proficientOpinion = response.proficientOpinion;
        this.valuerOpinion = response.valuerOpinion;
        this.observations = response.observations;
        this.quantity = response.quantity;
        this.description = response.description;

        this.form.controls['dictaminatedBy'].setValue(this.proficientOpinion);
        this.form.controls['avaluo'].setValue(this.valuerOpinion);
        this.form.controls['observations'].setValue(this.observations);
        this.data1.push(this.good);
        console.log(this.data1);
        // this.loadFinancial(this.goodId);
        // this.setGood(this.good);
      },
      error: err => {
        this.onLoadToast('error', 'ERROR', 'Bien no existe');
        this.form.reset();
        console.log(err);
      },
    });
  }
  loadFinancial(idGood: number | string) {
    this.finantialInformationService.findGood(idGood).subscribe({
      next: response => {
        this.finantialList = response.data;
        console.log(this.finantialList);
        this.finantialList.forEach(date => {
          this.date = this.datePipe.transform(
            date.idInfoDate,
            'dd-MM-yyyy h:mm a'
          );
        });
        this.searchGoods(idGood);
        this.form.controls['date'].setValue(this.date);
        this.totalItems2 = response.count;
      },
      error: err => {
        this.onLoadToast(
          'info',
          'Opss..',
          'Este bien no tiene Información Financiera asociada'
        );
        console.log(err);
      },
    });
  }
  onUserRowSelect(event: any) {
    this.selectedRows = event.selected;
  }

  confirm() {}

  cleanForm() {
    this.form.reset();
    this.form.value.goodId = '';
    this.data1 = [];
    this.finantialList = [];
  }
}
