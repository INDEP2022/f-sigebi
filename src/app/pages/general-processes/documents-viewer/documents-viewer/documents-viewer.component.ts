import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GENERAL_DOCS_DOCUMENTS_VIEWER_COLUMNS } from './documents-viewer-columns';

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

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentsService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = GENERAL_DOCS_DOCUMENTS_VIEWER_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.rowClassFunction = (row: { data: { scanStatus: string } }) =>
      row.data.scanStatus == 'ESCANEADO' ? 'digital' : 'pending';
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
          const param = `filter.${controlName}=$eq:${formattedDate}`;
          filterParams.push(param);
        } else if (controlName === 'keyTypeDocument') {
          this.aux = controlName;
          const keyTypeDocument = this.selectTypeDoc;
          const keyTypeDocumentDate = JSON.stringify(keyTypeDocument);
          this.dateInput = keyTypeDocumentDate;
          const param = `filter.${controlName}=$eq:${keyTypeDocument}`;
          filterParams.push(param);
        } else if (controlName === 'keySeparator') {
          this.aux = controlName;
          const keySeparator = this.selectSeparator;
          const keykeySeparatorDate = JSON.stringify(keySeparator);
          this.dateInput = keykeySeparatorDate;
          const param = `filter.${controlName}=$eq:${keySeparator}`;
          filterParams.push(param);
        } else if (controlName === 'preliminaryInquiry') {
          this.aux = controlName;
          const param = `filter.file.${controlName}=$eq:${controlValue}`;
          this.dateInput = controlValue;
          filterParams.push(param);
        } else if (controlName === 'criminalCase') {
          this.aux = controlName;
          const param = `filter.file.${controlName}=$eq:${controlValue}`;
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
          ); // Resultado: "Juan"
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
        if (this.aux === 'numberProceedings') {
          this.alert(
            'error',
            '',
            `No existe el No. expediente ${this.dateInput}`
          );
          this.form.get('numberProceedings').reset();
        } else if (this.aux === 'flyerNumber') {
          this.alert('error', '', `No existe el No. volante ${this.dateInput}`);
          this.form.get('flyerNumber').reset();
        } else if (this.aux === 'separador') {
          this.alert(
            'error',
            '',
            `No existe el No. separador ${this.dateInput}`
          );
          this.form.get('separador').reset();
        } else if (this.aux === 'significantDate') {
          this.alert(
            'error',
            '',
            `No existe la fecha significativa ${this.dateInput}`
          );
          this.form.get('significantDate').reset();
        } else if (this.aux === 'keyTypeDocument') {
          this.alert(
            'error',
            '',
            `No existe el tipo de documento ${this.dateInput}`
          );
          this.form.get('keyTypeDocument').reset();
        } else if (this.aux === 'descriptionDocument') {
          this.alert(
            'error',
            '',
            `No existe la descripción del deocumento ${this.dateInput}`
          );
          this.form.get('descriptionDocument').reset();
        } else if (this.aux === 'preliminaryInquiry') {
          this.alert(
            'error',
            '',
            `No existe la averiguación previa ${this.dateInput}`
          );
          this.form.get('preliminaryInquiry').reset();
        } else if (this.aux === 'criminalCase') {
          this.alert(
            'error',
            '',
            `No existe la No. causa penal ${this.dateInput}`
          );
          this.form.get('criminalCase').reset();
        } else if (this.aux === 'scanStatus') {
          this.alert('error', '', `No existe el el estatus ${this.dateInput}`);
          this.form.get('scanStatus').reset();
        } else if (this.aux === 'origen') {
          this.alert('error', '', `No existe el origen ${this.dateInput}`);
          this.form.get('origen').reset();
        }
        this.loading = false;
        this.data.load([]);
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
