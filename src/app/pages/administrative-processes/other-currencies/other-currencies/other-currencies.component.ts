import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SubdelegationService } from '../../../../core/services/catalogs/subdelegation.service';

@Component({
  selector: 'app-other-currencies',
  templateUrl: './other-currencies.component.html',
  styles: [],
})
export class OtherCurrenciesComponent implements OnInit {
  public currenciesForm: FormGroup;

  public delegations = new DefaultSelect();
  public subdelegations = new DefaultSelect();
  public currencies = new DefaultSelect();

  public get currency() {
    return this.currenciesForm.get('currencie');
  }
  public get from() {
    return this.currenciesForm.get('from');
  }
  public get to() {
    return this.currenciesForm.get('to');
  }

  public data = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private subdelegationService: SubdelegationService
  ) {}

  ngOnInit(): void {
    this.handleForm();
  }

  public handleForm() {
    this.currenciesForm = this.fb.group({
      delegation: ['', Validators.required],
      subdelegation: ['', Validators.required],
      currencie: [null, Validators.required],
      from: [null],
      to: [null],
    });
  }

  public send(): void {
    console.log(this.currenciesForm.value);
  }

  public getCurrencies(event: any) {
    // this.currencyService.getAll(params).subscribe(data => {
    //   this.currencies = new DefaultSelect(data.data, data.count);
    // });
  }

  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe(data => {
      this.delegations = new DefaultSelect(data.data, data.count);
    });
  }

  getSubdelegations(params: ListParams) {
    this.subdelegationService.getAll(params).subscribe(data => {
      this.subdelegations = new DefaultSelect(data.data, data.count);
    });
  }
}
