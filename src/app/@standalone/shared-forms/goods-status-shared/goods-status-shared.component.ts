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
import { debounceTime } from 'rxjs';
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
  @Input() approb: boolean = false;

  status = new DefaultSelect<IGoodStatus>();

  get goodStatus() {
    return this.form.get(this.goodStatusField);
  }

  constructor(private service: GoodService) {
    super();
  }

  ngOnInit(): void {
    this.getGoodStatus();
    if (this.approb) {
      this.getSelectedGoodStatus(this.form.get(this.goodStatusField).value);
    } else {
      this.form
        .get(this.goodStatusField)
        .valueChanges.pipe(
          debounceTime(300) // Retraso de 300 ms antes de realizar la búsqueda
        )
        .subscribe(value => {
          console.log(value, ' Linea 53 goods-status-shared.component.ts');
          this.getSelectedGoodStatus(value);
        });
    }
  }

  getSelectedGoodStatus(id: string): void {
    const newParams = new ListParams();
    if (id) {
      newParams['filter.status'] = id;
    }
    newParams['sortBy'] = 'status:ASC';
    this.service.getStatusAll(newParams).subscribe(
      data => {
        this.status = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.loading = false;
        this.status = new DefaultSelect();

        /* let error = '';
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

  getGoodStatus(params?: ListParams) {
    //Provisional data
    console.log('Llamó');
    this.service.getStatusAll(params ? params : '').subscribe({
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
        this.loading = false;
        // this.alert(
        //   'warning',
        //   'No se encontraron datos',
        //   'Por favor revise haber registrado el nombre de estatus correcto e inténtelo nuevamente'
        // );
        /* this.status = new DefaultSelect([], 0, true); */
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
    console.log('CAmbios algo');
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
