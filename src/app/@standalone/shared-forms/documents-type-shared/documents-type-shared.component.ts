import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Params
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { BehaviorSubject } from 'rxjs';
import { TypesDocuments } from 'src/app/core/models/ms-documents/documents-type';
import { DocumentsTypeService } from 'src/app/core/services/ms-documents-type/documents-type.service';

@Component({
  selector: 'app-document-type-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './documents-type-shared.component.html',
  styles: [],
})
export class DocumentsTypeSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() documentField: string = 'keyTypeDocument';
  @Input() showDocument: boolean = true;
  documents = new DefaultSelect<TypesDocuments>();
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  get Documents() {
    return this.form.get(this.documentField);
  }

  constructor(private documentServ: DocumentsTypeService) {
    super();
  }

  ngOnInit(): void {
    this.Documents.valueChanges.subscribe({
      next: value => {
        if (value) {
          this.filterParams.getValue().removeAllFilters();
          this.filterParams.getValue().page = 1;
          this.filterParams.getValue().addFilter('id', value, SearchFilter.EQ);
          this.documentServ
            .getAllWidthFilters(this.filterParams.getValue().getParams())
            .subscribe({
              next: resp => {
                this.documents = new DefaultSelect(resp.data, resp.count);
              },
              error: err => {
                this.documents = new DefaultSelect();
              },
            });
        } else {
          this.getDocuments({ page: 1, text: '' });
        }
      },
    });
  }

  getDocuments(params: ListParams) {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;
    this.filterParams.getValue().search = params.text;

    this.documentServ
      .getAllWidthFilters(
        this.filterParams
          .getValue()
          .getParams()
          .concat('&sortBy=description:ASC')
      )
      .subscribe({
        next: resp => {
          this.documents = new DefaultSelect(resp.data, resp.count);
        },
        error: err => {
          this.documents = new DefaultSelect();
        },
      });
  }

  onDocumentChange(doc: any) {
    this.documents = new DefaultSelect();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
