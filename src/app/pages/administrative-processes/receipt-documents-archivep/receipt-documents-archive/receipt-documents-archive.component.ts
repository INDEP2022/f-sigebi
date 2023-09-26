import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDocument } from 'src/app/core/models/ms-documents/document';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsService } from 'src/app/core/services/ms-documents-type/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { BasePage } from 'src/app/core/shared';
import { ModalGuardaValorComponent } from '../modal-guarda-valor/modal-guarda-valor.component';
import { COLUMNS } from './columns';

interface IGuardaValor {
  estatus_estante: string;
  estatus_casillero: string;
  estatus_bateria: string;
  cve_guardavalor: string;
  desc_guardavalor: string;
  no_bateria: string;
  desc_bateria: string;
  no_estante: string;
  desc_estante: string;
  no_casillero: string;
  desc_casillero: string;
}

@Component({
  selector: 'app-receipt-documents-archive',
  templateUrl: './receipt-documents-archive.component.html',
  styles: [],
})
export class ReceiptDocumentsArchiveComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  totalItemsRecib: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsRecib = new BehaviorSubject<ListParams>(new ListParams());
  form: FormGroup;
  formRecib: FormGroup;
  //Data Table
  warehouses: any[] = [];
  origin: string = '';
  dataFactGen: LocalDataSource = new LocalDataSource();
  dataRecib: LocalDataSource = new LocalDataSource();
  origin2: string = '';
  origin3: string = '';
  origin4: string = '';
  screenKey = 'FACTARGRECEPDOCS';
  columnFilters: any = [];
  title: string = 'Recepción de documentos en el archivo';
  recib: boolean = false;
  loadingRecib: boolean = this.loading;
  settingsRecib = this.settings;
  blkGuardaValor: IGuardaValor;
  document: IDocument;
  get authUser() {
    return this.authService.decodeToken().username;
  }

  constructor(
    private fb: FormBuilder,
    private documnetsServices: DocumentsService,
    private authService: AuthService,
    private modalService: BsModalService,
    private expedientService: ExpedientService
  ) {
    super();

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...COLUMNS },
      noDataMessage: 'No se encontrarón registros',
      rowClassFunction: (row: any) => {
        if (row.data.scanStatus !== null) {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };
    //scanStatus
  }

  ngOnInit(): void {
    this.prepareForm();
    this.dataFactGen
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
              case 'numberProceedings':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getDocuments();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDocuments());

    this.paramsRecib
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDocumentsRecib());
  }

  select(event: any) {
    console.error(event);
    this.form.get('descriptionDocument').setValue(event.descriptionDocument);
  }

  selectRecib(event: any) {
    console.error(event);
    this.formRecib
      .get('descriptionDocument')
      .setValue(event.descriptionDocument);
  }

  prepareForm() {
    this.form = this.fb.group({
      descriptionDocument: [null],
    });
    this.formRecib = this.fb.group({
      descriptionDocument: [null],
    });
    this.form.disable();
    this.formRecib.disable();
  }

  openModal() {
    let config: ModalOptions = {
      initialState: {
        blkGuardaValor: this.blkGuardaValor,
        document: this.document,
        title: this.title,
        callback: (next: IDocument) => {
          if (next) {
            this.document.fileStatus = 'ARCHIVADO';
            this.document.dateReceivesFile = new Date();
            this.document.userReceivesFile = this.authUser;
            this.updateDocuments(this.document);

            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getDocuments());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalGuardaValorComponent, config);
  }

  getDocuments() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.fileStatus'] = `$eq:ENVIADO`;
    this.documnetsServices.getAll(params).subscribe({
      next: response => {
        const data = response.data.map(item => {
          console.log('A' + item.sendDate);
          const fechaString = item.sendDate;
          const fechaProporcionada = new Date(fechaString);
          const fechaActual = new Date();
          const diferenciaEnMilisegundos =
            fechaActual.getTime() - fechaProporcionada.getTime();
          const diferenciaEnDias =
            diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);
          return {
            ...item,
            retraso: item.sendDate ? diferenciaEnDias : '',
          };
        });

        this.dataFactGen.load(data);
        this.dataFactGen.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  getDocumentsRecib() {
    this.loadingRecib = true;
    let params = {
      ...this.paramsRecib.getValue(),
      ...this.columnFilters,
    };
    params['filter.fileStatus'] = `$in:ARCHIVADO,PRESTADO`;
    this.documnetsServices.getAll(params).subscribe({
      next: response => {
        const data = response.data.map(item => {
          const fechaString = item.sendDate;
          const fechaProporcionada = new Date(fechaString);
          const fechaActual = new Date();
          const diferenciaEnMilisegundos =
            fechaActual.getTime() - fechaProporcionada.getTime();
          const diferenciaEnDias =
            diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);
          return {
            ...item,
            retraso: item.sendDate ? diferenciaEnDias : '',
          };
        });

        this.dataRecib.load(data);
        this.dataRecib.refresh();
        this.totalItemsRecib = response.count;
        this.loadingRecib = false;
      },
      error: error => (this.loadingRecib = false),
    });
  }

  async check(document: any) {
    //const recibe: string = 'S';
    this.document = document;

    if (document.recibe === 'S' && document.scanStatus === 'ESCANEADO') {
      /// aqui buscar en el servicio
      /// keySaveValue
      const ubication = await this.getExpedient(document.numberProceedings);
      if (ubication === 'S') {
        /// llamar al modal
        this.blkGuardaValor = {
          estatus_estante: 'N',
          estatus_casillero: 'N',
          estatus_bateria: 'N',
          cve_guardavalor: null,
          desc_guardavalor: null,
          no_bateria: null,
          desc_bateria: null,
          no_estante: null,
          desc_estante: null,
          no_casillero: null,
          desc_casillero: null,
        };
        this.openModal();
      } else {
        const confirm = await this.alertQuestion(
          'question',
          this.title,
          '¿Seguro que desea recibir el documento?'
        );
        if (confirm.isConfirmed) {
          this.document.fileStatus = 'ARCHIVADO';
          this.document.dateReceivesFile = new Date();
          this.document.userReceivesFile = this.authUser;
          /// Hacer el llamdo al MS
          this.updateDocuments(this.document);
        } else {
          document.recibe === 'N';
        }
      }
    } else {
      document.recibe === 'N';
      this.alert(
        'warning',
        this.title,
        'Documento pendiente de Digitalizar, para archivarlo debe digitalizarlo.'
      );
    }
  }

  updateDocuments(document: IDocument) {
    this.documnetsServices
      .updateDocument2(document.associateUniversalFolio, document)
      .subscribe({
        next: response => {
          console.log(response);
          this.alert(
            'success',
            this.title,
            'Documento actualizado correctamente'
          );
        },
        error: error => {
          console.log(error);
          this.alert('error', this.title, 'No se pudo actualizar el documento');
        },
      });
  }

  getExpedient(idExpedient: number | string) {
    return new Promise<string>((resolve, _reject) => {
      const params: ListParams = {};
      params['filter.id'] = `$eq:${idExpedient}`;
      params['filter.keySaveValue'] = `$null`;
      this.expedientService.getExpedient2(params).subscribe({
        next: response => {
          resolve('S');
        },
        error: error => {
          resolve('N');
        },
      });
    });
  }
}
