import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BankService } from '../../../../core/services/catalogs/bank.service';

@Component({
  selector: 'app-general-account-movements',
  templateUrl: './general-account-movements.component.html',
  styles: [],
})
export class GeneralAccountMovementsComponent implements OnInit {
  public form: FormGroup;
  public id: string = 'id';
  public currency = new DefaultSelect();
  public banks = new DefaultSelect();

  constructor(private fb: FormBuilder, private bankService: BankService) {}

  public get noBien() {
    return this.form.get('noBien');
  }

  ngOnInit(): void {
    this.handleForm();
  }

  public handleForm(): void {
    this.form = this.fb.group({
      noBien: [null, [Validators.required, Validators.maxLength(10)]],
      record: [''],
      amount: [null],
      currency: [null],
      bank: [''],
      from: [''],
      to: [''],
    });
  }

  public send(): void {
    console.log(this.form.value);
  }

  public getCurrencies(event: any) {
    // this.currencyService.getAll(params).subscribe(data => {
    //   this.currency = new DefaultSelect(data.data, data.count);
    // });
  }

  public getBanks(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }
}
