import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-appraisal-goods',
  templateUrl: './appraisal-goods.component.html',
  styles: [],
})
export class AppraisalGoodsComponent implements OnInit {
  form: FormGroup;

  public delegations = new DefaultSelect();
  public subdelegations = new DefaultSelect();
  public initialType = new DefaultSelect();
  public finalType = new DefaultSelect();
  public initialSubtype = new DefaultSelect();
  public finalSubtype = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private subdelegationService: SubdelegationService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [],
      subdelegation: [],
      initialType: [],
      finalType: [],
      initialSubtype: [],
      finalSubtype: [],

      daysToFinish: [],
    });
  }

  save() {
    console.log(this.form.value);
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

  getInitialType(params: ListParams) {
    // this.subdelegationService.getAll(params).subscribe(data => {
    //   this.subdelegations = new DefaultSelect(data.data, data.count);
    // });
  }

  getFinaltype(params: ListParams) {
    // this.subdelegationService.getAll(params).subscribe(data => {
    //   this.subdelegations = new DefaultSelect(data.data, data.count);
    // });
  }

  getInitialSubtype(params: ListParams) {
    // this.subdelegationService.getAll(params).subscribe(data => {
    //   this.subdelegations = new DefaultSelect(data.data, data.count);
    // });
  }

  getFinalSubtype(params: ListParams) {
    // this.subdelegationService.getAll(params).subscribe(data => {
    //   this.subdelegations = new DefaultSelect(data.data, data.count);
    // });
  }
}
