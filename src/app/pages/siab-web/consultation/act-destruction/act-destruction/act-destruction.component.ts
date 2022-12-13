import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ACT_DESTRUCTION_COLUMNS } from './act-destruction-columns';

@Component({
  selector: 'app-act-destruction',
  templateUrl: './act-destruction.component.html',
  styles: [],
})
export class ActDestructionComponent extends BasePage implements OnInit {
  actDestructionForm: FormGroup;

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: ACT_DESTRUCTION_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.actDestructionForm = this.fb.group({
      recordsSearchCriteria: [null, Validators.required],
    });
  }
}
