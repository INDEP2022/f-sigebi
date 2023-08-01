import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
import { BehaviorSubject, debounceTime } from 'rxjs';
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

  ngOnInit(): void {
    this.form
      .get(this.transferentField)
      .valueChanges.pipe(
        debounceTime(300) // Retraso de 300 ms antes de realizar la búsqueda
      )
      .subscribe(value => {
        const newParams = new ListParams();
        newParams['filter.id'] = value;
        this.getTransferents(newParams);
      });
  }

  getTransferents(params?: ListParams) {
    console.log(params);
    this.service.getAll(params).subscribe(
      async data => {
        const newData = await Promise.all(
          data['data'].map((item: any) => {
            return {
              ...item,
              selectValue: `${item.id}-${item.nameTransferent}`,
            };
          })
        );
        this.transferents = new DefaultSelect(newData, data.count);
      },
      err => {
        this.transferents = new DefaultSelect();

        /*  let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error); */
      },
      () => {}
    );
  }

  onTransferentsChange(value: any) {
    //this.resetFields([this.transferent]);
    this.transferents = new DefaultSelect();
    console.log('Cambio de info');
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
