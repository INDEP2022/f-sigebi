import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IPaymentsGensDepositary } from 'src/app/core/models/ms-depositarypayment/ms-depositarypayment.interface';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'ngx-form-depositaria',
  templateUrl: './form-depositaria.component.html',
  styleUrls: ['./form-depositaria.component.scss'],
})
export class FormDepositariaComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() formDepositario: FormGroup;
  @Input() nombrePantalla: string;
  @Input() btnDeshacerParam: string;
  @Input() deleteDateOption?: boolean = false;
  @Input() listDateOptions?: IPaymentsGensDepositary[] = [];

  @Output() formValues = new EventEmitter<any>();
  @Output() formDepositariaValues = new EventEmitter<any>();
  @Output() formValuesValidacion = new EventEmitter<any>();
  @Output() searchGoodNumber = new EventEmitter<number>();
  @Output() searchGoodData = new EventEmitter<any>();
  @Output() cleanData = new EventEmitter<boolean>();

  params = new BehaviorSubject<FilterParams>(new FilterParams());
  goods = new DefaultSelect<IGood>();
  goodSelect: IGood;
  @Output() eliminarDispersionPagos = new EventEmitter<any>();
  constructor(private service: GoodFinderService) {
    super();
  }

  ngOnInit(): void {
    this.deleteDateOption = false;
    console.log('FORM ', this.form.value);
    let param = new ListParams();
    param.text = this.form.value.noBien;
    this.getGoodsSheard(param, true);
  }

  btnEjecutar() {
    console.log('Ejecutar');
    console.log(this.form.value);
    this.formValues.emit(this.form);
  }

  btnDeshacer() {
    console.log('Deshacer');
    this.form.get(this.btnDeshacerParam).reset();
    this.form.get(this.btnDeshacerParam).setValue('');
    this.deleteDateOption = true;
    // this.eliminarDispersionPagos.emit(
    //   this.form.get(this.btnDeshacerParam).valid
    // );
  }

  btnRecargaDepositario() {
    console.log('Depositario');
    console.log(this.formDepositario.value);
    this.formDepositariaValues.emit(this.formDepositario);
  }

  btnValidacionPagos() {
    console.log('Validacion');
    console.log(this.formDepositario.value);
    this.formValuesValidacion.emit({
      form: this.form,
      depositario: this.formDepositario,
    });
  }

  btnSearchGood() {
    console.log(this.form.get('noBien').value, this.form.value);
    // this.searchGoodNumber.emit(this.form.get('noBien').value);
  }

  cleanScreenFields() {
    this.goods = new DefaultSelect([], 0, true);
    this.cleanData.emit(true);
  }

  btnExit() {
    this.deleteDateOption = false;
  }

  btnDeleteDispersalPay() {
    let resp = {
      validDate: this.form.get(this.btnDeshacerParam).valid,
      dateValue: this.form.get(this.btnDeshacerParam).value,
    };
    this.eliminarDispersionPagos.emit(resp);
  }

  formatTotalAmount(numberParam: number) {
    if (numberParam) {
      return new Intl.NumberFormat('es-MX').format(numberParam);
    } else {
      return '0.00';
    }
  }

  getGoodsSheard(params: ListParams, getByValue: boolean = false) {
    //Provisional data
    console.log(params);
    // this.searchTabForm.controls['noBien'].disable();
    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    this.loading = true;
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;
    if (!isNaN(parseFloat(params.text)) && isFinite(+params.text)) {
      if (params.text != undefined && params.text != '') {
        data.addFilter('id', params.text, SearchFilter.EQ);
      }
    } else {
      if (params.text != undefined && params.text != '') {
        data.addFilter('description', params.text, SearchFilter.ILIKE);
      }
    }
    this.service.getAll2(data.getParams()).subscribe({
      next: data => {
        this.goods = new DefaultSelect(data.data, data.count);
        this.loading = false;
        console.log('DATA GOOD ', this.goods);
        if (getByValue == true) {
          // this.onChangeGood(this.goods.data[0]);
          this.form.get('noBien').setValue(this.goods.data[0].id);
          this.searchGoodData.emit(this.goods.data[0]);
        }
      },
      error: err => {
        this.goods = new DefaultSelect([], 0, true);
        this.loading = false;
      },
    });
  }
  onChangeGood(event: IGood) {
    console.log(event);
    this.goodSelect = event;
    this.goods = new DefaultSelect([event], 1, true);
    this.searchGoodData.emit(event);
  }
}
