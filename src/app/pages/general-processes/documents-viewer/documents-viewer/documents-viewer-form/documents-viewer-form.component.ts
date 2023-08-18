import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./documents-viewer.component.scss'],
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
    private modalService: BsModalService
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
        console.log(this.documentT);
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
    this.modalService.show(DocumentsViewerByFolioComponent, modalConfig);
  }
}

/*



import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  styleUrls: ['./documents-viewer.component.scss'],
})
export class DocumentViewerFormComponent extends BasePage implements OnInit {
  documentViewerForm: ModelForm<IDocumentsViewerFlyerNumber>;
  title: string = 'Folios relacionados al expediente';
  edit: boolean = false;
  documentViewer: IDocumentsViewerFlyerNumber;

  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];F
  documentT: IDocumentsViewerFlyerNumber[] = [];
  totalItems: number = 0;

  selectedRows: any[] = [];
  isRowSelected: boolean = false;

  aux: string;
  dateInput: number | string;
  dateInputString: string;

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
        console.log(this.documentT[3].sheets)
        console.log(this.documentT)
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


  generateFilterParams(formGroup: FormGroup): any {
    const filterParams: string[] = [];
    Object.keys(formGroup.controls).forEach(controlName => {
      const controlValue = formGroup.get(controlName).value;
      if (controlValue !== null && controlValue !== undefined) {
        if (controlName === 'scanStatus') {
          const param = `filter.${controlName}=$eq:${controlValue}`;
          this.aux = controlName;
          this.dateInput = controlValue;
          filterParams.push(param);
        }
      }
    });
    return filterParams;
  }

  onSubmit() {
    this.loading = true;
    if (this.generateFilterParams(this.documentViewerForm).length > 0) {
      for (let i = 0; i < this.generateFilterParams(this.documentViewerForm).length; i++) {
        let filter = '';
        let content = '';
        const indice = this.generateFilterParams(this.documentViewerForm)[i].indexOf('=');
        if (indice !== -1) {
          filter = this.generateFilterParams(this.documentViewerForm)[i].substring(0, indice);
        }
        const indice1 = this.generateFilterParams(this.documentViewerForm)[i].indexOf('=');
        if (indice1 !== -1) {
          content = this.generateFilterParams(this.documentViewerForm)[i].substring(
            indice1 + 1
          );
        }
        this.params.getValue()[filter] = content;
      }
    } else {
      this.params = new BehaviorSubject<ListParams>(new ListParams());
    }

    console.log(this.params.getValue())
    this.documentService.getAll2(this.params.getValue()).subscribe(
      response => {
        this.documentT = response.data;
        this.totalItems = response.count || 0;
        this.data.load(this.documentT);
        this.loading = false;
      },
      error => {
        let contador = 0;
        const errors: { [key: string]: string } = {};

        Object.keys(this.documentViewerForm.controls).forEach(controlName => {
          if (this.aux === controlName) {
            let errorMessage = '';
            switch (controlName) {
              case 'scanStatus':
                errorMessage = 'Estatus de digitalización no encontrado';
                this.documentViewerForm.get('scanStatus').reset();
                this.onSubmit();
                break;
            }

            if (errorMessage !== '') {
              errors[controlName] = errorMessage;
              contador++;
            }
          }
          this.loading = false;
          // this.data.load([]);
          // this.totalItems =  0;
          this.params = new BehaviorSubject<ListParams>(new ListParams());
        });

        if (contador === 0) {
          this.alert('warning', 'No se encontraron registros', '');
          this.cleandInfo();
        } else {
          Object.keys(errors).forEach(controlName => {
            const errorMessage = errors[controlName];
            this.alert(
              'warning',
              errorMessage,
              `Si en el formulario quedó un filtro, presiona de nuevo en "Consultar"`
            );
          });
        }
      }
    );
  }

  cleandInfo() {
    this.documentViewerForm.reset();
    this.documentViewerForm.patchValue({ scanStatus: 'all' });
    this.onSubmit();
    this.loading = false;
  }
}


*/
