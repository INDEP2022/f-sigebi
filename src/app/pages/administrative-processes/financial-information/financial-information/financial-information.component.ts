import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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
  data1: any[] = [];
  good: IGood;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  settings1 = { ...this.settings, actions: false };
  settings2 = { ...this.settings, actions: false };
  data2: any[] = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  date: string;
  proficientOpinion: string;
  valuerOpinion: string;
  observations: string;
  quantity: number;
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private goodService: GoodService,
    private finantialInformationService: FinantialInformationService
  ) {
    super();
    this.settings1 = {
      ...this.settings,
      actions: false,
      columns: FINANCIAL_INFORMATION_COLUMNS1,
    };
    this.settings.columns = FINANCIAL_INFORMATION_COLUMNS2;

    this.settings2 = {
      ...this.settings,
      actions: false,
      columns: FINANCIAL_INFORMATION_COLUMNS2,
    };
    this.settings.columns = FINANCIAL_INFORMATION_COLUMNS2;
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
    this.goodService.getById(idGood).subscribe({
      next: response => {
        this.good = response;
        console.log(this.good);
        this.date = this.datePipe.transform(
          response.dateIn,
          'dd-MM-yyyy h:mm a'
        );
        this.proficientOpinion = response.proficientOpinion;
        this.valuerOpinion = response.valuerOpinion;
        this.quantity = response.quantity;
        this.form.controls['date'].setValue(this.date);
        this.form.controls['dictaminatedBy'].setValue(this.proficientOpinion);
        this.form.controls['avaluo'].setValue(this.valuerOpinion);
        this.form.controls['observations'].setValue(this.observations);
        // this.loadDescriptionStatus(this.good.id);
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
    this.finantialInformationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        // console.log(response);
        // this.actaER.setValue(response.cve_acta);
        // this.actaERDate.setValue(new Date(response.fec_elaboracion));
      },
      error: err => {
        // this.actaER.setValue('');
        // this.actaERDate.setValue('');
        this.onLoadToast(
          'info',
          'Opss..',
          'Este bien no tiene Información Financiera asociada'
        );
        console.log(err);
      },
    });
  }

  confirm() {}

  cleanForm() {
    this.form.reset();
  }
}
