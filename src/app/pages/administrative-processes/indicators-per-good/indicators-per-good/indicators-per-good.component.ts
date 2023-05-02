import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IFinancialIndicatorsW } from 'src/app/core/models/catalogs/financial-indicators-model';
import { IGood } from 'src/app/core/models/good/good.model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { IndicatorPeerGoodService } from 'src/app/core/services/ms-parameter-finantial/indicator-peer-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  INDICATORS_COLUMNS2,
  INDICATORS_GOOD_COLUMNS1,
} from './indicators-columns';

@Component({
  selector: 'app-indicators-per-good',
  templateUrl: './indicators-per-good.component.html',
  styles: [],
})
export class IndicatorsPerGoodComponent extends BasePage implements OnInit {
  form: FormGroup;
  goodList: IGood[] = [];
  id: number = 0;
  good: IGood;
  description: string;
  indicator: IFinancialIndicatorsW;
  valid: boolean = false;
  table: boolean = false;
  indicatorsTotal: IFinancialIndicatorsW[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  data2: any[] = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  proficientOpinion: string;
  valuerOpinion: string;
  observations: string;
  quantity: number;
  date: string;
  settings1;
  settings2;
  @Output() onConfirm = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private indicatorPeerGoodService: IndicatorPeerGoodService,
    private datePipe: DatePipe
  ) {
    super();
    this.settings1 = {
      ...TABLE_SETTINGS,
      ...this.settings,
      actions: false,
      columns: { ...INDICATORS_GOOD_COLUMNS1 },
    };

    this.settings2 = {
      ...TABLE_SETTINGS,
      ...this.settings,
      // selectMode: 'multi',
      actions: false,
      columns: { ...INDICATORS_COLUMNS2 },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, Validators.required],
      date: [null],
    });
  }
  onChangeGood() {
    this.searchGoods(this.form.value.noBien);
  }

  searchGoods(idGood: number | string) {
    this.goodService.getByIdNew(idGood, idGood).subscribe({
      next: response => {
        this.good = response;
        this.goodList.push(this.good);
        console.log(this.goodList);
        this.loadIndicator(idGood);
      },
      error: err => {
        this.onLoadToast('error', 'ERROR', 'Bien no existe');
        this.form.reset();
        console.log(err);
      },
    });
  }
  loadIndicator(search: any) {
    this.indicatorPeerGoodService.findGood(search).subscribe({
      next: response => {
        this.indicatorsTotal = response.data;
        this.table = true;
        this.totalItems2 = response.count;
      },
      error: err => {
        this.onLoadToast(
          'info',
          'Opss..',
          'Este bien no tiene indicadores asociado'
        );
        console.log(err);
      },
    });
  }

  onUserRowSelect(good: any) {
    this.valid = true;
    this.id = good.data.idGoodNumber;
    console.log(this.id);
    // var formatted = new DatePipe('en-EN').transform(
    //   good.data.idIndicatorDate,
    //   'dd/MM/yyyy'
    // );
    let params: IFinancialIndicatorsW = {
      idGoodNumber: good.data.idGoodNumber,
      idIndicatorDate: good.data.idIndicatorDate,
      idIndicatorNumber: this.getRandomInt(4),
      registryNumber: good.data.registryNumber,
      value: good.data.value,
    };
    this.indicator = params;
  }

  cleanForm() {
    this.form.reset();
    this.goodList = [];
    this.indicatorsTotal = [];
    this.form.value.noBien = 0;
  }
  confirm() {
    this.loading = false;
    this.indicatorPeerGoodService.create(this.indicator).subscribe({
      next: response => {
        this.onLoadToast('success', '', 'Indicador copiado');
        this.loadIndicator(this.indicator.idGoodNumber);
        this.onConfirm.emit(true);
        console.log(response);
      },
      error: err => {
        this.onLoadToast('info', 'Opss..', 'Número de indicador ya existe');
        return;
      },
    });
  }
  calculate() {
    this.valid = true;
    this.loading = false;
    this.onLoadToast('success', '', 'calculo realizado satisfatoriamente');
  }
  getRandomInt(long: number) {
    const cadena = '0123456789';
    let alea = '';
    for (let i = 0; i < long; i++) {
      alea += cadena.charAt(Math.floor(Math.random() * cadena.length));
    }
    console.log(alea);
    return alea;
  }
}
