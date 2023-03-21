import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-exchange-types-detail',
  templateUrl: './exchange-types-detail.component.html',
  styles: [],
})
export class ExchangeTypesDetailComponent implements OnInit {
  form: FormGroup;
  currencies: any;
  public monedas = new DefaultSelect();
  @Output() refresh = new EventEmitter<true>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private currencyService: DynamicTablesService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      currency: ['', [Validators.required]],
    });
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
