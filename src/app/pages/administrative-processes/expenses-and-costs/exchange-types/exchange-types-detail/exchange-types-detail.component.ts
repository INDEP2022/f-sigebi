import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Ityperate } from 'src/app/core/models/ms-type-rate/typerate.model';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-exchange-types-detail',
  templateUrl: './exchange-types-detail.component.html',
  styles: [],
})
export class ExchangeTypesDetailComponent extends BasePage implements OnInit {
  form: FormGroup;
  currencies: any;
  typerate: Ityperate;
  public monedas = new DefaultSelect();
  @Output() refresh = new EventEmitter<true>();
  @Output() onSelect = new EventEmitter<any>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private currencyService: DynamicTablesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      currency: ['', [Validators.required]],
      purchaseValue: [null, [Validators.required]],
      registerNumber: [null, [Validators.required]],
      saleValue: [null],
      validityId: [null],
      costValue: [null],
    });
    this.form.patchValue(this.typerate);
  }

  confirm() {
    this.onSelect.emit(this.form.value);
    // console.log(this.form.value);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }

  public getCurrencies(event: any) {
    this.currencyService.getTvalTable5ByTable(3).subscribe(data => {
      this.monedas = new DefaultSelect(data.data, data.count);
    });
  }
}
