import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
import { BehaviorSubject } from 'rxjs';
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
  @Input() labelName: string = 'Bancos';
  @Output() nameBank: EventEmitter<string> = new EventEmitter<string>();

  params = new BehaviorSubject<ListParams>(new ListParams());
  banks = new DefaultSelect<IBank>();

  constructor(private service: BankService) {
    super();
  }

  ngOnInit(): void {
    let bankCode = this.form.controls[this.bankField].value;
    if (bankCode !== null && this.form.contains('bankName')) {
      let name = this.form.controls['bankName'].value;
      this.banks = new DefaultSelect([
        {
          bankCode: bankCode,
          name: name,
        },
      ]);
    }

    this.form.get('cveBank').valueChanges.subscribe(data => {
      if (data) {
        this.service.getById(data).subscribe(resp => {
          this.banks = new DefaultSelect([resp], 1);
          this.nameBank.next(resp.name);
        });
      }
    });
  }

  getBanks(params: ListParams) {
    this.service.getAll(params).subscribe({
      next: resp => (this.banks = new DefaultSelect(resp.data, resp.count)),
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
    });
  }

  onBanksChange(type: any) {
    this.nameBank.next(this.banks.data[0].name);
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
