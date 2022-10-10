import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-values-per-file',
  templateUrl: './values-per-file.component.html',
  styles: [],
})
export class ValuesPerFileComponent implements OnInit {
  public form: FormGroup;

  public delegations = new DefaultSelect();
  public subdelegations = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private subdelegationService: SubdelegationService
  ) {}

  ngOnInit(): void {
    this.handleForm();
  }

  public handleForm() {
    this.form = this.fb.group({
      delegation: ['', Validators.required],
      subdelegation: ['', Validators.required],
      fileFrom: [null],
      fileTo: [null],
      from: [null],
      to: [null],
    });
  }

  public send(): void {
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
}
