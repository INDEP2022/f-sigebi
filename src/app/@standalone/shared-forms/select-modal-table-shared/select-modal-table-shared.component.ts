import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { OpenModalListFiltered } from 'src/app/core/shared/open-modal-select';
import { SharedModule } from 'src/app/shared/shared.module';

export interface IServiceWidthFilter {
  getAllFilterSelf(): Observable<any>;
}

@Component({
  selector: 'app-select-modal-table-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './select-modal-table-shared.component.html',
  styles: [
    `
      #selectModalTable {
        form-field {
          ::ng-deep {
            .form-group {
              padding: 0px;
            }
          }
        }
        .description {
          padding-right: 0px;
          @media screen and (max-width: 576px) {
            padding-right: 25px;
            margin-top: 10px;
          }
        }
      }
    `,
  ],
})
export class SelectModalTableSharedComponent
  extends OpenModalListFiltered
  implements OnInit
{
  @Input() form: FormGroup;
  @Input() disabled: boolean;
  @Input() label: string;
  @Input() labelName: string;
  @Input() formField: string;
  @Input() formFieldName: string;
  @Input() id: string;
  @Input() description: string;
  @Input() service: IServiceWidthFilter;
  @Input() title: string;
  @Input() operator: SearchFilter = SearchFilter.LIKE;
  @Input() searchField: string; // Debe pertenecer a una de las columnas
  @Input() columnsType: {
    [others: string]: { title: string; type: string; sort: boolean };
  };
  constructor(protected override modalService: BsModalService) {
    super(modalService);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    console.log(this.columnsType);
  }

  openModal() {
    console.log(this.columnsType);
    let context: any = {
      title: this.title,
      columnsType: this.columnsType,
      service: this.service,
      settings: { ...TABLE_SETTINGS },
      dataObservableFn: this.service.getAllFilterSelf,
    };
    if (this.searchField) {
      context = {
        ...context,
        searchFilter: { field: this.searchField, operator: this.operator },
      };
    }
    this.openModalSelect(context, this.selectData);
  }

  selectData(row: any, self: SelectModalTableSharedComponent) {
    self.form.get(self.formField).setValue(row[self.id]);
    if (self.form.get(self.formFieldName))
      self.form.get(self.formFieldName).setValue(row[self.description]);
  }
}
