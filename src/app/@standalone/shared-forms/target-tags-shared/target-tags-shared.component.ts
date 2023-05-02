import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { LabelOkeyService } from 'src/app/core/services/catalogs/label-okey.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { ILabelOKey } from 'src/app/core/models/catalogs/label-okey.model';

@Component({
  selector: 'app-target-tags-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './target-tags-shared.component.html',
  styles: [],
})
export class TargetTagsSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() targetTagField: string = 'targetTag';

  @Input() showTargetTags: boolean = true;

  targetTags = new DefaultSelect<ILabelOKey>();

  get targetTag() {
    return this.form.get(this.targetTagField);
  }

  constructor(private service: LabelOkeyService) {
    super();
  }

  ngOnInit(): void {}

  getTargetTags(params: ListParams) {
    this.service.getAll(params).subscribe(
      data => {
        this.targetTags = new DefaultSelect(data.data, data.count);
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

  onTargetTagsChange(type: any) {
    //this.resetFields([this.subdelegation]);
    this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
