import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { MAINTANANCEDOCUMENTVALIDATORS_COLUMNS } from './c-p-m-maintenance-document-validators-columns';

@Component({
  selector: 'app-c-p-m-maintenance-document-validators',
  templateUrl: './c-p-m-maintenance-document-validators.component.html',
  styles: [],
})
export class CPMMaintenanceDocumentValidatorsComponent
  extends BasePage
  implements OnInit
{
  maintenanceDocumentForm: FormGroup;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: MAINTANANCEDOCUMENTVALIDATORS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.maintenanceDocumentForm = this.fb.group({
      typeRecord: [null, [Validators.required]],
    });
  }
}
