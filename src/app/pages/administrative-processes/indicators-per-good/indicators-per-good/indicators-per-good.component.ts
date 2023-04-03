import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
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
  data1: any[] = [];
  good: IGood;
  indicatorsTotal: IFinancialIndicatorsW[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  settings1 = { ...this.settings, actions: false };
  data2: any[] = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  proficientOpinion: string;
  valuerOpinion: string;
  observations: string;
  quantity: string;
  description: string;
  date: string;
  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private indicatorPeerGoodService: IndicatorPeerGoodService,
    private datePipe: DatePipe
  ) {
    super();
    this.settings1 = {
      ...this.settings,
      actions: false,
      columns: INDICATORS_GOOD_COLUMNS1,
    };
    this.settings.columns = INDICATORS_COLUMNS2;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      good: [null, Validators.required],
      date: [null, Validators.required],
    });
  }
  onChangeGood() {
    this.searchGoods(this.form.value.noBien);
  }
  searchGoods(idGood: number | string) {
    this.goodService.getById(idGood).subscribe({
      next: response => {
        this.good = response;
        console.log(this.good);
        // this.proficientOpinion = response.proficientOpinion;
        // this.valuerOpinion = response.valuerOpinion;
        // this.observations = response.observations;
        // this.quantity = response.quantity;
        // this.description = response.description;

        // this.form.controls['dictaminatedBy'].setValue(this.proficientOpinion);
        // this.form.controls['avaluo'].setValue(this.valuerOpinion);
        // this.form.controls['observations'].setValue(this.observations);
        this.data1.push(this.good);
        console.log(this.data1);
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
        this.indicatorsTotal = response;
        console.log(this.indicatorsTotal);
        this.indicatorsTotal.forEach(date => {
          this.date = this.datePipe.transform(
            date.idIndicatorDate,
            'dd-MM-yyyy h:mm a'
          );
        });
        this.searchGoods(this.form.value.noBien);
        this.form.controls['date'].setValue(this.date);
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
}
