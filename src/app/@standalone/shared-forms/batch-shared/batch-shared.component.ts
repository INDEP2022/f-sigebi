import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
import { BehaviorSubject } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { BatchService } from 'src/app/core/services/catalogs/batch.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IBatch } from 'src/app/core/models/catalogs/batch.model';

@Component({
  selector: 'app-batch-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './batch-shared.component.html',
  styles: [],
})
export class BatchSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() batchField: string = 'batchId';

  @Input() showBatch: boolean = true;

  params = new BehaviorSubject<ListParams>(new ListParams());
  batchs = new DefaultSelect<IBatch>();

  get batch() {
    return this.form.get(this.batchField);
  }

  constructor(private service: BatchService) {
    super();
  }

  ngOnInit(): void {
    let batchId = this.form.controls[this.batchField].value;
    if (batchId !== null && this.form.contains('batch')) {
      let batch = this.form.controls['batch'].value;
      this.batchs = new DefaultSelect([
        {
          id: batchId,
          numRegister: batch,
        },
      ]);
    }
  }

  getBatchs(params: ListParams) {
    this.service.getAll(params).subscribe(
      data => {
        this.batchs = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  onBatchsChange(subdelegation: any) {
    this.batchs = new DefaultSelect();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
