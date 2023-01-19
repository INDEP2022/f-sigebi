import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDateDocuments } from 'src/app/core/models/catalogs/date-documents.model';
import { DateDocumentsService } from 'src/app/core/services/catalogs/date-documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DATEDOCUMENTS_COLUMNS } from './date-documents-columns';

@Component({
  selector: 'app-date-documents',
  templateUrl: './date-documents.component.html',
  styles: [],
})
export class DateDocumentsComponent extends BasePage implements OnInit {
  dateDocuments: IDateDocuments[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  dateDocumentsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dateDocumentsService: DateDocumentsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: DATEDOCUMENTS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.dateDocumentsForm = this.fb.group({
      proceedings: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
  }
  private getDateDocuments() {
    this.loading = true;
    let file = this.dateDocumentsForm.controls['proceedings'].value;
    this.dateDocumentsService.getById3(file.toString()).subscribe({
      next: response => {
        this.dateDocuments = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  public search() {
    this.getDateDocuments();
  }
}
