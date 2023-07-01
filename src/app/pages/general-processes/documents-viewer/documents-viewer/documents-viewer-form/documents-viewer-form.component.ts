import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDocumentsViewerFlyerNumber } from 'src/app/core/models/ms-documents/documents-viewer-flyerNumber.models';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RELATED_FOLIO_COLUMNS } from './related-folio-columns';

@Component({
  selector: 'documents-viewer-form',
  templateUrl: './documents-viewer-form.component.html',
  styles: [],
})
export class DocumentViewerFormComponent extends BasePage implements OnInit {
  documentViewerForm: ModelForm<IDocumentsViewerFlyerNumber>;
  title: string = 'Folios relacionados al expediente';
  edit: boolean = false;
  documentViewer: IDocumentsViewerFlyerNumber;

  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  documentT: IDocumentsViewerFlyerNumber[] = [];
  totalItems: number = 0;

  selectedRows: any[] = [];
  isRowSelected: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private documentService: DocumentsService,
    private modalService: BsModalService,
    private renderer: Renderer2
  ) {
    super();
    this.settings.columns = RELATED_FOLIO_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.edit = false;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
  }

  ngOnInit(): void {
    this.getDeductives();
    this.prepareForm();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' ||
            filter.field == 'sheets' ||
            filter.field == 'descriptionDocument'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getDeductives();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  getDeductives() {
    const flyerNumber = this.documentViewer.flyerNumber;
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.documentService.getAllFlyerNumber(flyerNumber, params).subscribe({
      next: response => {
        this.documentT = response.data;
        this.data.load(this.documentT);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  private prepareForm() {
    this.documentViewerForm = this.fb.group({
      id: [null],
      sheets: [null],
      descriptionDocument: [null],
      flyerNumber: [null],
    });
    if (this.documentViewer != null) {
      this.edit = true;
      this.documentViewerForm.patchValue(this.documentViewer);
    }
  }

  close() {
    this.modalRef.hide();
  }

  onRowSelect(event: any) {
    if (event.selected && event.selected.length > 0) {
      const selectedRows = event.selected[0].id;
      this.selectedRows = selectedRows;
      this.isRowSelected = true;
    } else {
      this.isRowSelected = false;
    }
  }

  logSelectedRows() {
    let folio = this.selectedRows;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      ignoreBackdropClick: false,
      folio,
    };

    // Ocultar el primer modal antes de mostrar el segundo modal
    this.modalRef.hide();

    this.modalService.show(DocumentsViewerByFolioComponent, modalConfig);
  }
}
