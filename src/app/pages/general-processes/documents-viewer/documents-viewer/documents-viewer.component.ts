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
    fecha: [null],
    keyTypeDocument: [null],
    descripcion: [null, [Validators.pattern(STRING_PATTERN)]],
    averPrevia: [null, [Validators.pattern(STRING_PATTERN)]],
    causaPenal: [null, [Validators.pattern(STRING_PATTERN)]],
    tipos: [null, [Validators.required]],
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
    private documentSeparatorService: DocumentsSeparatorsService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = GENERAL_DOCS_DOCUMENTS_VIEWER_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.rowClassFunction = (row: { data: { scanStatus: string } }) =>
      row.data.scanStatus == 'ESCANEADO' ? 'pending' : 'digital';
  }

  ngOnInit(): void {
    this.loadDocumentsSeparator(); //Aquí le indico que traiga todas las imágenes cuando se cargue la pantalla
    this.getDocuments();
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
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'numberProceedings':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cve_separador':
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

            console.log(this.columnFilters);
          });
          this.getDocuments();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDocuments());
  }

  onOptionsSelected(value: any) {
    console.log('the selected value is ' + value);
  }

  generateFilterParams(formGroup: FormGroup): string {
    const filterParams: string[] = [];
    console.log(filterParams);

    // Iterar sobre los controles del formulario
    Object.keys(formGroup.controls).forEach(controlName => {
      const controlValue = formGroup.get(controlName).value;

      if (controlValue !== null && controlValue !== undefined) {
        const param = `filter.${controlName}=$eq:${controlValue}`;
        filterParams.push(param);
      }
    });
    // Unir los parámetros con el carácter '&'
    const paramsString = filterParams.join('&');
    console.log('Filter');
    return paramsString;
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
    const inputValue = event.search;
    const param = `filter.id=${inputValue}`;

    this.documentService.getDocumentsType(param).subscribe(response => {
      // Actualiza los datos del ngx-select con la respuesta obtenida
      this.selectTypeDoc = new DefaultSelect(response.data, response.count);
      console.log(this.selectTypeDoc);
    });
  }

  loadDocumentsType(parameter?: string) {
    let params = this.generateFilterParams(this.form);
    this.documentService
      .getDocumentsType()
      .pipe(
        map(res => {
          this.selectTypeDoc = new DefaultSelect(res.data, res.count);
          console.log(this.selectTypeDoc);
        })
      )
      .subscribe();
  }

  loadDocumentsSeparator() {
    this.documentService
      .getDocumentsSeparator()
      .pipe(
        map(res => {
          console.log(res); //Trae todas las imágenes
          this.selectSeparator = new DefaultSelect(res.data, res.count);
        })
      )
      .subscribe();
  }

  onSubmit() {
    // Llamada al endpoint pasando los parámetros del formulario
    this.loading = true;
    let params = this.generateFilterParams(this.form);
    console.log(params);
    console.log('Clic en el botón de Consultar');
    this.documentService.getAll(params).subscribe(
      response => {
        this.documents = response.data;
        console.log(this.documents);
        this.totalItems = response.count || 0;
        console.log(this.totalItems);
        this.data.load(this.documents);
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.data.load([]);
      }
    );
  }
}
