import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IFederative } from 'src/app/core/models/administrative-processes/siab-sami-interaction/federative.model';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-federative-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './federative-shared.component.html',
  styles: [],
})
export class FederativeSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() federativeField: string = 'federative';

  @Input() showFederative: boolean = true;

  federative = new DefaultSelect<IFederative>();

  constructor(private service: EntFedService) {
    super();
  }

  get Federative() {
    console.log(this.federativeField);
    return this.form.get(this.federativeField);
  }

  ngOnInit(): void {
    console.log(this.Federative);
    if (this.Federative.value) {
      this.service.getById(this.Federative.value).subscribe({
        next: resp => {
          console.log(resp);
          this.federative = new DefaultSelect([resp], 1);
        },
      });
    }
    // this.Federative.valueChanges.subscribe({
    //   next: id => {
    //     console.log(id);
    //     if (!id) return;

    //   },
    // });
  }

  getFederative(params: ListParams) {
    this.service.getAll(params).subscribe({
      next: data =>
        (this.federative = new DefaultSelect(data.data, data.count)),
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
  onFederativeChange(type: any) {
    this.federative = new DefaultSelect();
    // this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
