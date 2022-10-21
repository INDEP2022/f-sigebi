import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-costs-resume',
  templateUrl: './costs-resume.component.html',
  styles: [],
})
export class CostsResumeComponent implements OnInit {
  form: FormGroup;
  public concepts = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      gasto: [null, Validators.required],
      al: [null, Validators.required],
      startDate: [null, Validators.required],
      finishDate: [null, Validators.required],
    });
  }

  getCostConcept(params: ListParams) {
    // this.subdelegationService.getAll(params).subscribe(data => {
    //   this.subdelegations = new DefaultSelect(data.data, data.count);
    // });
  }
}
