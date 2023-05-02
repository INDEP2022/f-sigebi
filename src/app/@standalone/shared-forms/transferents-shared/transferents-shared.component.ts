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
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';

@Component({
  selector: 'app-transferente-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './transferents-shared.component.html',
  styles: [],
})
export class TransferenteSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() transferentField: string = 'transferent';

  @Input() showTransferent: boolean = true;

  params = new BehaviorSubject<ListParams>(new ListParams());
  transferents = new DefaultSelect<ITransferente>();

  get transferent() {
    return this.form.get(this.transferentField);
  }

  constructor(private service: TransferenteService) {
    super();
  }

  ngOnInit(): void {}

  getTransferents(params: ListParams) {
    this.service.getAll(params).subscribe(
      data => {
        this.transferents = new DefaultSelect(data.data, data.count);
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

  onTransferentsChange(subdelegation: any) {
    //this.resetFields([this.transferent]);
    this.transferents = new DefaultSelect();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
