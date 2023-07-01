import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared';
import { GTTRACKER_DOCUMENTS_COLUMNS } from './g-tracker-docs-dcolumns';

@Component({
  selector: 'app-g-tracker-documents',
  templateUrl: './g-tracker-documents.component.html',
  styles: [],
})
export class GTrackerDocumentsComponent extends BasePage implements OnInit {
  documents: any[] = [];
  selectedRow = {};
  $params = new BehaviorSubject(new FilterParams());
  totalItems = 0;
  trackedGood: ITrackedGood = null;
  constructor(private documentsService: DocumentsService) {
    super();
    this.settings = {
      ...this.settings,
      columns: GTTRACKER_DOCUMENTS_COLUMNS,
      actions: false,
    };
  }

  ngOnInit(): void {
    this.$params.subscribe(params => {
      this.getDocuments(params);
    });
  }

  getDocuments(params?: FilterParams) {
    this.documentsService
      .getFolio(
        {
          expedientNumber: this.trackedGood.fileNumber,
          goodNumber: this.trackedGood.goodNumber,
        },
        params.getParams()
      )
      .subscribe({
        next: res => {
          this.documents = res.data;
          this.totalItems = res.count;
        },
        error: err => {
          this.documents = [];
          this.totalItems = 0;
        },
      });
  }

  confirm() {}

  close() {}
}
