import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
//import { GoodTypeService } from 'src/app/core/services/catalogs/good-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IGoodStatus } from 'src/app/core/models/catalogs/good-status.model';
import { GoodService } from 'src/app/core/services/good/good.service';

@Component({
  selector: 'app-goods-status-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './goods-status-shared.component.html',
  styles: [],
})
export class GoodsStatusSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() goodStatusField: string = 'goodStatus';
  @Input() labelStatus: string = 'Estatus Bienes';
  @Input() showGoodStatus: boolean = true;
  @Input() multiple: boolean = false;

  status = new DefaultSelect<IGoodStatus>();

  get goodStatus() {
    return this.form.get(this.goodStatusField);
  }

  constructor(private service: GoodService) {
    super();
  }

  ngOnInit(): void {
    this.getGoodStatus(new ListParams());
  }

  getSelectedGoodStatus(id: string): void {
    const newParams = new ListParams();

    newParams['filter.status'] = id;

    this.service.getStatusAll(newParams).subscribe({
      next: result => {
        const newResult = result.data[0];
        console.log(newResult, ' Linea 53 goods-status-shared.component.ts');
        this.goodStatus.setValue(newResult.description);
        if (this.goodStatus.value) this.getGoodStatus(new ListParams());
      },
      error: error => console.error(error),
    });
  }

  getGoodStatus(params: ListParams) {
    //Provisional data
    this.service.getStatusAll(params).subscribe({
      next: data => {
        const newData = data.data.map(status => {
          return {
            ...status,
            newLabel: `${status.status} - ${status.description}`,
          };
        });
        console.log(data);
        this.status = new DefaultSelect(newData, data.count);
      },
      error: err => {
        this.alert(
          'warning',
          'No se encontraron datos',
          'Por favor revise haber registrado el nombre de estatus correcto e inténtelo nuevamente'
        );
        this.status = new DefaultSelect();
        /* let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error); */
      },
    });
  }

  onGoodStatusChange(type: any) {
    console.log(type);
    this.form.updateValueAndValidity();
    this.getGoodStatus(new ListParams());
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
