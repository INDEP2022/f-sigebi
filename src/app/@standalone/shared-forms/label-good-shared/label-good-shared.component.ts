import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ILabelOKey } from 'src/app/core/models/catalogs/label-okey.model';
import { LabelOkeyService } from 'src/app/core/services/catalogs/label-okey.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-label-good-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './label-good-shared.component.html',
  styles: [],
})
export class LabelGoodSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() labelGoodField: string = 'targetIndicator';
  @Input() showLabelStatus: boolean = true;

  status = new DefaultSelect<ILabelOKey>();

  get targetIndicator() {
    return this.form.get(this.labelGoodField);
  }

  constructor(private service: LabelOkeyService) {
    super();
  }

  ngOnInit(): void {
    if (this.targetIndicator.value) this.getLabelsGood(new ListParams());
  }

  getLabelsGood(params: ListParams) {
    this.service.getAll(params).subscribe({
      next: data => {
        this.status = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
    });
  }

  onLabelGoodChange(type: any) {
    this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
