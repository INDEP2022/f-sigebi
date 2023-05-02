import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-surveillance-reports',
  templateUrl: './surveillance-reports.component.html',
  styles: [],
})
export class SurveillanceReportsComponent implements OnInit {
  form: FormGroup;
  public providers = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      contract: [null, Validators.required],
      provider: [null, Validators.required],
      providerSign: [null, Validators.required],
      reports: [null, Validators.required],
      reportSae: [null, Validators.required],
      year: [null, Validators.required],
      month: [null, Validators.required],
    });
  }

  getProviders(params: ListParams) {
    // this.subdelegationService.getAll(params).subscribe(data => {
    //   this.subdelegations = new DefaultSelect(data.data, data.count);
    // });
  }
}
