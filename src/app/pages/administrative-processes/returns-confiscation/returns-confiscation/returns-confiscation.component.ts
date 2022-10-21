import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { RETURNSCONFISCATION_COLUMNS } from './returns-confiscation-columns';

@Component({
  selector: 'app-returns-confiscation',
  templateUrl: './returns-confiscation.component.html',
  styles: [],
})
export class ReturnsConfiscationComponent extends BasePage implements OnInit {
  returnsConfiscationForm: ModelForm<any>;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...RETURNSCONFISCATION_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.returnsConfiscationForm = this.fb.group({
      noProceedings: [null, Validators.required],
      preliminaryInvestigation: [null, Validators.required],
      criminalCase: [null, Validators.required],
    });
  }
}
