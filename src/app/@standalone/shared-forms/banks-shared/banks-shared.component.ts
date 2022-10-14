import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AbstractControl, FormGroup } from '@angular/forms';
//Rxjs
import { BehaviorSubject, takeUntil } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { BankService } from 'src/app/core/services/catalogs/bank.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IBank } from 'src/app/core/models/catalogs/bank.model';

@Component({
  selector: 'app-banks-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './banks-shared.component.html',
  styles: [],
})
export class BanksSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() bankField: string = 'bank';

  @Input() showBanks: boolean = true;

  params = new BehaviorSubject<ListParams>(new ListParams());
  banks = new DefaultSelect<IBank>();

  constructor(private service: BankService) {
    super();
  }

  ngOnInit(): void {}

  getBanks(params: ListParams) {
    this.service.getAll(params).subscribe(
      data => {
        this.banks = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  onBanksChange(type: any) {
    //this.resetFields([this.subdelegation]);
    this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
