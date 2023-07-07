import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IDocumentsViewerFlyerNumber } from 'src/app/core/models/ms-documents/documents-viewer-flyerNumber.models';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GENERAL_DOCS_DOCUMENTS_VIEWER_COLUMNS } from './documents-viewer-columns';
import { DocumentViewerFormComponent } from './documents-viewer-form/documents-viewer-form.component';

@Component({
  selector: 'app-documents-viewer',
  templateUrl: './documents-viewer.component.html',
  styleUrls: ['./documents-viewer.component.scss'],
})
export class DocumentsViewerComponent extends BasePage implements OnInit {
  documents: IDocuments[] = [];
  totalItems: number = 0;

  form = this.fb.group({
    numberProceedings: [null],
    flyerNumber: [null],
    keySeparator: [null],
    significantDate: [null],
    keyTypeDocument: [null],
    descriptionDocument: [null, [Validators.pattern(STRING_PATTERN)]],
    preliminaryInquiry: [null, [Validators.pattern(STRING_PATTERN)]],
    criminalCase: [null, [Validators.pattern(STRING_PATTERN)]],
    scanStatus: ['all', [Validators.required]],
    origen: [null, [Validators.required]],
  });

  selectTypeDoc = new DefaultSelect();
  selectSeparator = new DefaultSelect();
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  aux: string;
  dateInput: number | string;
  dateInputString: string;
  otro: any = [];
  id: number | string;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentsService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GENERAL_DOCS_DOCUMENTS_VIEWER_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.edit = false;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.rowClassFunction = (row: { data: { scanStatus: string } }) =>
      row.data.scanStatus == 'ESCANEADO'
        ? 'bg-success text-white'
        : 'bg-dark text-white';
  }

  ngOnInit(): void {
    this.loadDocumentsSeparator();
    this.getDocuments();
    this.loadDocumentsType();
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
            switch (filter.field) {
              case 'numberProceedings':
                searchFilter = SearchFilter.EQ;
                break;
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cve_separador':
                searchFilter = SearchFilter.EQ;
                break;
              case 'keyTypeDocument':
                searchFilter = SearchFilter.EQ;
                break;
              case 'significantDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'flyerNumber':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getDocuments();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDocuments());
  }

  formatDate(dateString: string): string {
    if (dateString === '') {
      return '';
    }
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${month}/${year}`;
  }

  resetFilters(): void {
    // Eliminar los filtros aplicados aquí
    this.columnFilters = {};
    this.getDocuments();
  }
  onOptionsSelectedTypeDocument(value: any) {
    this.selectTypeDoc = value.id;
  }

  onOptionsSelectedSeparator(value: any) {
    this.selectSeparator = value.key;
  }

  generateFilterParams(formGroup: FormGroup): any {
    const filterParams: string[] = [];
    Object.keys(formGroup.controls).forEach(controlName => {
      const controlValue = formGroup.get(controlName).value;
      if (controlValue !== null && controlValue !== undefined) {
        if (controlName === 'significantDate') {
          this.aux = controlName;
          const date = new Date(controlValue);
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear().toString();
          const formattedDate = `${month}/${year}`;
          this.dateInput = formattedDate;
          const param = `filter.${controlName}=$ilike:${formattedDate}`;
          filterParams.push(param);
        } else if (controlName === 'keyTypeDocument') {
          this.aux = controlName;
          const keyTypeDocument = this.selectTypeDoc;
          const keyTypeDocumentDate = JSON.stringify(keyTypeDocument);
          this.dateInput = keyTypeDocumentDate;
          const param = `filter.${controlName}=$ilike:${keyTypeDocument}`;
          filterParams.push(param);
        } else if (controlName === 'keySeparator') {
          this.aux = controlName;
          const keySeparator = this.selectSeparator;
          const keykeySeparatorDate = JSON.stringify(keySeparator);
          this.dateInput = keykeySeparatorDate;
          const param = `filter.${controlName}=$ilike:${keySeparator}`;
          filterParams.push(param);
        } else if (controlName === 'preliminaryInquiry') {
          this.aux = controlName;
          const param = `filter.file.${controlName}=$ilike:${controlValue}`;
          this.dateInput = controlValue;
          filterParams.push(param);
        } else if (controlName === 'criminalCase') {
          this.aux = controlName;
          const param = `filter.file.${controlName}=$ilike:${controlValue}`;
          this.dateInput = controlValue;
          filterParams.push(param);
        } else if (controlName === 'descriptionDocument') {
          this.aux = controlName;
          const param = `filter.${controlName}=$ilike:${controlValue}`;
          this.dateInput = controlValue;
          filterParams.push(param);
        } else if (controlValue === 'all') {
          return;
        } else {
          const param = `filter.${controlName}=$eq:${controlValue}`;
          this.aux = controlName;
          this.dateInput = controlValue;
          filterParams.push(param);
        }
      }
    });
    return filterParams;
  }

  getDocuments() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.documentService.getAll(params).subscribe(
      response => {
        this.documents = response.data;
        this.totalItems = response.count || 0;
        this.data.load(this.documents);
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  onTipoDocumentoInputChange(event: any) {
    const inputValue = event.search.toUpperCase();
    const param = `filter.id=${inputValue}`;
    this.documentService.getDocumentsType(param).subscribe(response => {
      this.selectTypeDoc = new DefaultSelect(response.data, response.count);
    });
  }

  loadDocumentsType() {
    this.documentService
      .getDocumentsType()
      .pipe(
        map(res => {
          this.selectTypeDoc = new DefaultSelect(res.data, res.count);
        })
      )
      .subscribe();
  }

  onDocumentsSeparatorInputChange(event: any) {
    const inputValue = event.search.toUpperCase();
    const param = `filter.key=${inputValue}`;
    this.documentService.getDocumentsSeparator(param).subscribe(response => {
      this.selectSeparator = new DefaultSelect(response.data, response.count);
    });
    this.loading = false;
  }

  loadDocumentsSeparator() {
    this.documentService
      .getDocumentsSeparator()
      .pipe(
        map(res => {
          this.selectSeparator = new DefaultSelect(res.data, res.count);
        })
      )
      .subscribe();
  }

  modalImage(documentViewer: IDocumentsViewerFlyerNumber) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      ignoreBackdropClick: false,
      documentViewer,
      callback: (next: boolean) => {
        if (next) this.getDocuments();
      },
    };
    this.modalService.show(DocumentViewerFormComponent, modalConfig);
  }

  showDeleteAlert(documentViewerUpdate: IDocuments) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(documentViewerUpdate.id);
      }
    });
  }

  delete(id: string | number) {
    this.documentService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Expediente eliminado', '');
        this.getDocuments();
      },
      error: error => {
        this.alert('warning', 'No es posible eliminar el expediente', '');
      },
    });
  }

  onSubmit() {
    this.loading = true;
    if (this.generateFilterParams(this.form).length > 0) {
      for (let i = 0; i < this.generateFilterParams(this.form).length; i++) {
        let filter = '';
        let content = '';
        const indice = this.generateFilterParams(this.form)[i].indexOf('=');
        if (indice !== -1) {
          filter = this.generateFilterParams(this.form)[i].substring(0, indice);
        }
        const indice1 = this.generateFilterParams(this.form)[i].indexOf('=');
        if (indice1 !== -1) {
          content = this.generateFilterParams(this.form)[i].substring(
            indice1 + 1
          );
        }
        this.params.getValue()[filter] = content;
      }
    } else {
      this.params = new BehaviorSubject<ListParams>(new ListParams());
    }

    this.documentService.getAll(this.params.getValue()).subscribe(
      response => {
        this.documents = response.data;
        this.totalItems = response.count || 0;
        this.data.load(this.documents);
        this.loading = false;
      },
      error => {
        let contador = 0;
        const errors: { [key: string]: string } = {};

        Object.keys(this.form.controls).forEach(controlName => {
          if (this.aux === controlName) {
            let errorMessage = '';
            switch (controlName) {
              case 'numberProceedings':
                errorMessage = 'No. de expediente no encontrado';
                this.form.get('numberProceedings').reset();
                this.onSubmit();
                break;
              case 'flyerNumber':
                errorMessage = 'No. de volante no encontrado';
                this.form.get('flyerNumber').reset();
                this.onSubmit();
                break;
              case 'separador':
                errorMessage = 'Separador no encontrado';
                this.form.get('separador').reset();
                this.onSubmit();
                break;
              case 'significantDate':
                errorMessage = 'Fecha significativa no encontrada';
                this.form.get('significantDate').reset();
                this.onSubmit();
                break;
              case 'keyTypeDocument':
                errorMessage = 'Tipo de documento no existe';
                this.form.get('keyTypeDocument').reset();
                this.onSubmit();
                break;
              case 'descriptionDocument':
                errorMessage = 'Descripción no encontrada';
                this.form.get('descriptionDocument').reset();
                this.onSubmit();
                break;
              case 'preliminaryInquiry':
                errorMessage = 'Averiguación previa no encontrada';
                this.form.get('preliminaryInquiry').reset();
                this.onSubmit();
                break;
              case 'criminalCase':
                errorMessage = 'Causa penal no encontrada';
                this.form.get('criminalCase').reset();
                this.onSubmit();
                break;
              case 'scanStatus':
                errorMessage = 'Estatus de digitalización no encontrado';
                this.form.get('scanStatus').reset();
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
    this.form.reset();
    this.form.patchValue({ scanStatus: 'all' });
    this.onSubmit();
    this.loadDocumentsSeparator();
    this.loadDocumentsType();
    this.loading = false;
    this.selectTypeDoc = new DefaultSelect([], 0);
    this.selectSeparator = new DefaultSelect([], 0);
  }
}
