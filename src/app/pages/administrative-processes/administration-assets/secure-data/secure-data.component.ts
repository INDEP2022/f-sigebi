import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { PolicyService } from 'src/app/core/services/ms-policy/policy.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-secure-data',
  templateUrl: './secure-data.component.html',
  styles: [],
})
export class SecureDataComponent extends BasePage implements OnInit, OnChanges {
  @Input() goodId: number;
  list: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private readonly policyServices: PolicyService) {
    super();
    this.settings.actions = false;
    this.settings.columns = {
      policy: {
        title: 'Póliza',
        type: 'number',
        sort: false,
      },
      policyDescription: {
        title: 'Descripción de Póliza',
        type: 'string',
        sort: false,
      },
      insuranceCarrier: {
        title: 'Aseguradora',
        type: 'string',
        sort: false,
      },
      entryDate: {
        title: 'Fecha Ingreso',
        type: 'string',
        sort: false,
      },
      lowDate: {
        title: 'Fecha Baja',
        type: 'string',
        sort: false,
      },
      amountInsured: {
        title: 'Suma Asegurada',
        type: 'string',
        sort: false,
      },
      premiumAmount: {
        title: 'Monto Prima',
        type: 'string',
        sort: false,
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.searchDataValuations(this.goodId);
    }
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchDataValuations(this.goodId));
  }

  searchDataValuations(idGood: number) {
    this.loading = true;
    this.params.getValue()['filter.goodNumberId'] = `$eq:${idGood}`;
    console.log(this.params.getValue());
    this.policyServices.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.list = response.data.map(policy => {
          return {
            policy: policy.Policies.policyKeyId,
            policyDescription: policy.Policies.description,
            insuranceCarrier: policy.Policies.insurancecarrier,
            entryDate: policy.entryDate,
            lowDate: policy.shortDate,
            amountInsured: policy.additionInsured,
            premiumAmount: policy.amountCousin,
          };
        });
        console.log(response);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.log(err);
      },
    });
  }
}
