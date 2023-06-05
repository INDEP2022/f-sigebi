import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { SelectFormComponent } from '../../shared-forms/select-form/select-form.component';

@Component({
  selector: 'app-table-replace-column-modal',
  standalone: true,
  imports: [CommonModule, SharedModule, NgScrollbarModule, SelectFormComponent],
  templateUrl: './table-replace-column-modal.component.html',
  styleUrls: ['./table-replace-column-modal.component.scss'],
})
export class TableReplaceColumnModalComponent
  extends BasePage
  implements OnInit
{
  url: string = environment.API_URL;
  form: FormGroup; // Input requerido al llamar el modal
  formField: string;
  label: string;
  path: string;
  paramSearch: string;
  otherFormField: string;
  otherFormLabel: string;
  prefixSearch: string = '$eq';
  titleColumnToReplace: string = ''; // nombre de la columna a reemplazar en plura
  tableData: any[] = []; // Input requerido al llamar el modal
  columnsType: any = {}; // Input requerido al llamar el modal
  selectFirstInput = true;
  // service: any; //
  // dataObservableFn: (self: any, params: string) => Observable<any>; // Input requerido al llamar el modal
  idSelect: string; // Input requerido al llamar el modal
  labelSelect: string; // Input requerido al llamar el modal
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsControl: FilterParams = new FilterParams(); // Input requerido al llamar el modal
  labelTemplate: TemplateRef<any> = null;
  optionTemplate: TemplateRef<any> = null;
  disabled = false;
  messageResult: { message: string; result: string } = null;
  // paramFilter = 'search';
  // operator = SearchFilter.EQ;
  private _data: any[];
  @Output() newValue = new EventEmitter();
  get data() {
    return this._data;
  }

  get totalItems() {
    return this.tableData.length;
  }

  // get getListObservableSelect() {
  //   return this.dataObservableFn(this.service, this.paramsControl.getParams());
  // }

  constructor(private modalRef: BsModalRef, private http: HttpClient) {
    super();
  }

  search() {
    const params: any = {
      page: 1,
      limit: 10,
    };
    let text = this.form.get(this.formField)
      ? this.form.get(this.formField).value
      : '';
    if (text) {
      if (this.prefixSearch) {
        text = `${this.prefixSearch}:${text}`;
      }
      params[this.paramSearch] = text;
    }
    // const mParams =
    //   this.moreParams.length > 0 ? '?' + this.moreParams.join('&') : '';
    this.http
      .get(`${this.url}${this.path}`, {
        params,
      })
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.messageResult = {
              message: `${this.form.get(this.formField).value} existe`,
              result: 'success',
            };
            // this.onLoadToast(
            //   'success',
            //   `${this.label} ${this.form.get(this.formField).value} válido`
            // );
            this.disabled = false;
          } else {
            this.messageResult = {
              message: `${this.form.get(this.formField).value} no existe`,
              result: '',
            };
            // this.onLoadToast(
            //   'error',
            //   `${this.label} ${this.form.get(this.formField).value} no válido`
            // );
            this.disabled = true;
          }
        },
        error: err => {
          this.messageResult = {
            message: `${this.form.get(this.formField).value} no existe`,
            result: '',
          };

          // this.onLoadToast(
          //   'error',
          //   `${this.label} ${this.form.get(this.formField).value} no válido`
          // );
          this.disabled = true;
        },
      });
  }

  ngOnInit(): void {
    // console.log(this.service, this.dataObservableFn);

    // console.log(this.tableData, [...this.tableData].slice(0, 1));
    this.settings = {
      ...this.settings,
      selectedRowIndex: -1,
      actions: false,
      columns: { ...this.columnsType },
    };
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(x);
      const inicio = (params.page - 1) * params.limit;
      let final = inicio + params.limit;
      final = final > this.tableData.length ? this.tableData.length : final;
      this._data = [...this.tableData].slice(inicio, final);
    });
  }

  confirm() {
    this.newValue.emit(this.form.value);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
