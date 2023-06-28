import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { DocumentsSeparatorsService } from 'src/app/core/services/ms-documents-separators/documents-separators.service';
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
    separador: [null],
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
  private typeDocumentInputChangeSubject = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentsService,
    private documentSeparatorService: DocumentsSeparatorsService,
    private datePipe: DatePipe
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
    this.getDocuments(); //Aquí le indico que traiga todas las imágenes cuando se cargue la pantalla
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
            /*switch para filtros por columna*/
            switch (filter.field) {
              case 'numberProceedings': //Columna No Expediente
                searchFilter = SearchFilter.EQ;
                break;
              case 'id': //Columna Folio universal
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
              console.log(this.columnFilters[field]); //Es el change del filtro de búsqueda
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              ); //Es el datos a filtrar
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

  //CAPTURA EL DATO A BUSCAR
  onOptionsSelected(value: any) {
    this.selectTypeDoc = value.id;
  }

  generateFilterParams(formGroup: FormGroup): string {
    const filterParams: string[] = [];
    // Iterar sobre los controles del formulario
    Object.keys(formGroup.controls).forEach(controlName => {
      const controlValue = formGroup.get(controlName).value;
      if (controlValue !== null && controlValue !== undefined) {
        if (controlName === 'significantDate') {
          //Fecha significativa
          const date = new Date(controlValue);
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear().toString();
          const formattedDate = `${month}/${year}`;
          const param = `filter.${controlName}=$eq:${formattedDate}`;
          filterParams.push(param);
        } else if (controlName === 'keyTypeDocument') {
          //Tipo de documento
          const keyTypeDocument = this.selectTypeDoc;
          const param = `filter.${controlName}=$eq:${keyTypeDocument}`;
          filterParams.push(param);
        } else if (controlName === 'preliminaryInquiry') {
          //Causa penal
          console.log('preliminaryInquiry');
        } else if (controlName === 'criminalCase') {
          //Causa penal
          console.log('criminalCase');
        } else if (controlValue === 'all') {
          //Filtra imagenes por 'Todos'
          return;
        } else {
          const param = `filter.${controlName}=$eq:${controlValue}`;
          console.log('params ', param);
          filterParams.push(param);
        }
      }
    });
    // Unir los parámetros con el carácter '&'
    const paramsString = filterParams.join('&');
    return paramsString;
  }

  //CARGA TODOS LOS DOCUMENTOS
  getDocuments() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.documentService.getAll(params).subscribe(
      response => {
        this.documents = response.data;
        console.log(this.documents);
        this.totalItems = response.count || 0;
        this.data.load(this.documents);
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  //BUSCA POR INPUTCHANGE UN TIPO DE DOCUMENTO
  onTipoDocumentoInputChange(event: any) {
    console.log('Tipo Documento Input Change', event);
    const inputValue = event.search.toUpperCase();
    const param = `filter.id=${inputValue}`;
    this.documentService.getDocumentsType(param).subscribe(response => {
      // Actualiza los datos del ngx-select con la respuesta obtenida
      this.selectTypeDoc = new DefaultSelect(response.data, response.count);
      console.log(this.selectTypeDoc);
    });
  }

  //CARGA LOS TIPOS DE DOCUMENTOS
  loadDocumentsType(parameter?: string) {
    this.documentService
      .getDocumentsType()
      .pipe(
        map(res => {
          this.selectTypeDoc = new DefaultSelect(res.data, res.count);
        })
      )
      .subscribe();
  }

  //CARGA LOS SEPARADORES
  loadDocumentsSeparator() {
    this.documentService
      .getDocumentsSeparator()
      .pipe(
        map(res => {
          console.log(res); // Trae todas las imágenes
          this.selectSeparator = new DefaultSelect(res.data, res.count);
        })
      )
      .subscribe();
  }

  //ENVIA LA PETICION DE CONSULTA
  onSubmit() {
    this.loading = true;
    let params = this.generateFilterParams(this.form);
    console.log(params);
    this.documentService.getAll(params).subscribe(
      response => {
        this.documents = response.data;
        this.totalItems = response.count || 0;
        this.data.load(this.documents);
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.data.load([]);
      }
    );
  }

  cleandInfo() {
    this.form.reset();
    this.form.patchValue({ scanStatus: 'all' });
    this.onSubmit();
    this.loading = false;
    this.selectTypeDoc = new DefaultSelect([], 0);
    this.selectSeparator = new DefaultSelect([], 0);
  }
}
