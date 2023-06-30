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
        this.alert('success', 'Visualización de documentos', 'Borrado');
        this.getDocuments();
      },
      error: error => {
        this.alert(
          'warning',
          'Visualización de documentos',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
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
        if (this.aux === 'numberProceedings') {
          this.alert('warning', 'No se encontró el expediente', ``);
          this.form.get('numberProceedings').reset();
          this.onSubmit();
        } else if (this.aux === 'flyerNumber') {
          this.alert('warning', 'No se encontró el volante', ``);
          this.form.get('flyerNumber').reset();
          this.onSubmit();
        } else if (this.aux === 'separador') {
          this.alert('warning', 'No se encontró el separador', ``);
          this.form.get('separador').reset();
          this.onSubmit();
        } else if (this.aux === 'significantDate') {
          this.alert('warning', 'No se encontró la fecha significativa', ``);
          this.form.get('significantDate').reset();
          this.onSubmit();
        } else if (this.aux === 'keyTypeDocument') {
          this.alert('warning', 'No se encontró el tipo de documento', ``);
          this.form.get('keyTypeDocument').reset();
          this.onSubmit();
        } else if (this.aux === 'descriptionDocument') {
          this.alert('warning', 'No se encontró la descripción', ``);
          this.form.get('descriptionDocument').reset();
          this.onSubmit();
        } else if (this.aux === 'preliminaryInquiry') {
          this.alert('warning', 'No se encontró la averiguación previa', ``);
          this.form.get('preliminaryInquiry').reset();
          this.onSubmit();
        } else if (this.aux === 'criminalCase') {
          this.alert('warning', 'No se encontró la causa penal', ``);
          this.form.get('criminalCase').reset();
          this.onSubmit();
        } else if (this.aux === 'scanStatus') {
          this.alert('warning', 'No se encontró el estatus', ``);
          this.form.get('scanStatus').reset();
          this.onSubmit();
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

//http://sigebimsqa.indep.gob.mx/documents/api/v1/documents --> Trae todas las imágenes
//http://sigebimsqa.indep.gob.mx/documents/api/v1/documents?filter.numberProceedings=$eq:33785 --> Búsqueda por No Expediente
//http://sigebimsqa.indep.gob.mx/documents/api/v1/documents?filter.flyerNumber=$eq:467963 --> Búsqueda por No Volante
//http://sigebimsqa.indep.gob.mx/documents/api/v1/documents?filter.keySeparator=$eq:MUEBLES --> Búsqueda por No Volante
//http://sigebimsqa.indep.gob.mx/documents/api/v1/documents?filter.significantDate=$eq:04/2023 --> Búsqueda por Fecha significativa
//http://sigebimsqa.indep.gob.mx/documents/api/v1/documents?filter.keyTypeDocument=$eq:CARGA --> Búsqueda por Tipo de documento
//http://sigebimsqa.indep.gob.mx/documents/api/v1/documents?filter.descriptionDocument=$eq:PRUEBA RAFAEL 2 --> Búsqueda por Descripción del documento
//http://sigebimsqa.indep.gob.mx/documents/api/v1/documents?filter.scanStatus=$eq:ESCANEADO --> Para buacar por 'scanStatus'
//http://sigebimsqa.indep.gob.mx/documents/api/v1/documents?filter.file.criminalCase=$eq:49/2002 --> Búsqueda por Causa penal
//http://sigebimsqa.indep.gob.mx/documents/api/v1/documents?filter.file.preliminaryInquiry=$eq:PGR/UEDO/134/2002 --> Búsqueda por Averiguación previa

//   onSubmit() {
//     this.loading = true;
//     if (this.generateFilterParams(this.form).length > 0) {
//       for (let i = 0; i < this.generateFilterParams(this.form).length; i++) {
//         let filter = '';
//         let content = '';
//         const indice = this.generateFilterParams(this.form)[i].indexOf('=');
//         if (indice !== -1) {
//           filter = this.generateFilterParams(this.form)[i].substring(0, indice);
//         }
//         const indice1 = this.generateFilterParams(this.form)[i].indexOf('=');
//         if (indice1 !== -1) {
//           content = this.generateFilterParams(this.form)[i].substring(
//             indice1 + 1
//           );
//         }
//         this.params.getValue()[filter] = content;
//       }
//     } else {
//       this.params = new BehaviorSubject<ListParams>(new ListParams());
//     }

// this.documentService.getAll(this.params.getValue()).subscribe({
//   next: response => {
//     this.documents = response.data;
//     console.log(this.documents);
//     this.totalItems = response.count || 0;
//     this.data.load(this.documents);
//     this.loading = false;
//   },
//   error: error => {
//     let contador = 0;
//     let errores = 0;
//     if (this.aux === 'numberProceedings') {
//       this.form.get('numberProceedings').reset();
//       this.onSubmit();
//       contador++;
//       errores++;
//     } else if (this.aux === 'flyerNumber') {
//       this.form.get('flyerNumber').reset();
//       this.onSubmit();
//       contador++;
//       errores++;
//     } else if (this.aux === 'separador') {
//       this.form.get('separador').reset();
//       this.onSubmit();
//       contador++;
//       errores++;
//     } else if (this.aux === 'significantDate') {
//       this.form.get('significantDate').reset();
//       this.onSubmit();
//       contador++;
//       errores++;
//     } else if (this.aux === 'keyTypeDocument') {
//       this.form.get('keyTypeDocument').reset();
//       this.onSubmit();
//       contador++;
//       errores++;
//     } else if (this.aux === 'descriptionDocument') {
//       this.form.get('descriptionDocument').reset();
//       this.onSubmit();
//       contador++;
//       errores++;
//     } else if (this.aux === 'preliminaryInquiry') {
//       this.form.get('preliminaryInquiry').reset();
//       this.onSubmit();
//       contador++;
//       errores++;
//     } else if (this.aux === 'criminalCase') {
//       this.form.get('criminalCase').reset();
//       this.onSubmit();
//       contador++;
//       errores++;
//     } else if (this.aux === 'scanStatus') {
//       this.form.get('scanStatus').reset();
//       this.onSubmit();
//       contador++;
//       errores++;
//     }

//     if (contador === 0) {
//       this.alert('warning', 'No se encontraron registros', '');
//       this.cleandInfo();
//     } else if (errores === 1) {
//       this.alert('warning', 'uno', '');
//     } else if (errores > 1) {
//       this.alert('warning', 'dos', '');
//     }

//     this.loading = false;
//     this.data.load([]);
//   }
// });
