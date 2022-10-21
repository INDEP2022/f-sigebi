import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-costs-applied-goods',
  templateUrl: './costs-applied-goods.component.html',
  styles: [],
})
export class CostsAppliedGoodsComponent implements OnInit {
  form: FormGroup;

  public delegations = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      file: [null, Validators.required],
      toFile: [null, Validators.required],

      noBien: [null, Validators.required],
      alGood: [null, Validators.required],

      costType: [null, Validators.required],

      goodType: [null, Validators.required],
      costConcept: [null, Validators.required],
      to: [null, Validators.required],

      startDate: [null, Validators.required],
      finishDate: [null, Validators.required],
    });
  }

  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe(data => {
      this.delegations = new DefaultSelect(data.data, data.count);
    });
  }
}
