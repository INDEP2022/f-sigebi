import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from '../../../../core/interfaces/model-form';
import { BasePage } from '../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../shared/components/select/default-select';

var data = [
  {
    name: 'bien clasificado',
  },
  {
    name: 'bien clasificado2',
  },
];

@Component({
  selector: 'app-search-assignment',
  templateUrl: './search-assignment.component.html',
  styleUrls: ['./search-assignment.component.scss'],
})
export class SearchAssignmentComponent extends BasePage implements OnInit {
  programmingForm: ModelForm<any>;
  asignToSelected = new DefaultSelect();
  responsableStudySelected = new DefaultSelect();
  warehouseSelected = new DefaultSelect();
  assetsClassiferSelected = new DefaultSelect();

  listClassifers: any[] = [];
  listRemoveClassifers: any[] = [];
  displayMsg: boolean = false;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.programmingForm = this.fb.group({
      typeStudy: [null],
      asignTo: [null, [Validators.required]],
      reasonStudy: [null, [Validators.required]],
      responsableStudy: [null, [Validators.required]],
      expedient: [null],
      warehouse: [null],
      sampleSize: [null, [Validators.max(2)]],
      assetsClassifer: [null, [Validators.required]],
    });
  }

  getAsignToSelect(event: any): void {}

  getResponsableStudySelect(event: any) {}

  getWarehouseSelect(even: any) {}

  getAssetsClassiferSelect(event: any) {}

  addClassifers() {
    //push los datos seleccionados
    if (this.listClassifers.length <= 3) {
      this.listClassifers = data;
    } else {
      this.displayMsg = true;
    }
  }

  rowsSelected(event: any, data: any) {
    if (event.target.checked == true) {
      this.listRemoveClassifers.push(data);
    } else {
      let index = this.listRemoveClassifers.indexOf(
        this.listClassifers.find(x => x.id == data.id)
      );
      this.listRemoveClassifers.splice(index, 1);
    }

    console.log(this.listRemoveClassifers);
  }

  remove(): void {
    this.listClassifers = this.listRemoveClassifers;
  }

  save(): void {}

  close(): void {}
}
