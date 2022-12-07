import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from '../../../../core/interfaces/model-form';
import { DefaultSelect } from '../../../../shared/components/select/default-select';

@Component({
  selector: 'app-assets-assigned',
  templateUrl: './assets-assigned.component.html',
  styles: [],
})
export class AssetsAssignedComponent implements OnInit {
  @Input() data: any;
  assetAssignedForm: ModelForm<any>;
  isReadOnly: boolean = true;
  asignToSelected = new DefaultSelect();
  warehouseSelected = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.assetAssignedForm = this.fb.group({
      assignedTo: [{ value: null, disabled: true }],
      assetCharac: [{ value: null, disabled: true }],
      transfer: [{ value: null, disabled: true }],
      reasonStudy: [{ value: null, disabled: true }],
      assetsClassify: [{ value: null, disabled: true }],
      warehouse: [{ value: null, disabled: true }],
      studyMange: [{ value: null, disabled: true }],
      expedient: [{ value: null, disabled: true }],
    });
  }

  getAsignToSelect(event: any) {}
  getWarehouseSelectedSelect(event: any) {}
}
