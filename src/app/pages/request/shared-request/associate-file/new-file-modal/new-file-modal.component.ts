import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-new-file-modal',
  templateUrl: './new-file-modal.component.html',
  styles: [],
})
export class NewFileModalComponent extends BasePage implements OnInit {
  title: string = 'Carátula';
  coverGenerated: boolean = false;
  maxDate: Date = new Date();
  fileInfo: any = null;
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  coverForm: FormGroup = new FormGroup({});
  userItems = new DefaultSelect();
  unitItems = new DefaultSelect();
  fileItems = new DefaultSelect();
  officialItems = new DefaultSelect();
  dispositions: any[] = [];
  @Output() onCreate = new EventEmitter<boolean>();

  userTestData = [
    {
      id: 1,
      name: 'USUARIO 1',
    },
    {
      id: 2,
      name: 'USUARIO 2',
    },
    {
      id: 3,
      name: 'USUARIO 3',
    },
  ];

  unitTestData = [
    {
      id: 1,
      description: 'UNIDAD 1',
    },
    {
      id: 2,
      description: 'UNIDAD 2',
    },
    {
      id: 3,
      description: 'UNIDAD 3',
    },
  ];

  fileTestData = [
    {
      id: 1,
      description: 'UBICACIÓN 1',
    },
    {
      id: 2,
      description: 'UBICACIÓN 2',
    },
    {
      id: 3,
      description: 'UBICACIÓN 3',
    },
  ];

  officialTestData = [
    {
      id: 1,
      name: 'FUNCIONARIO 1',
    },
    {
      id: 2,
      name: 'FUNCIONARIO 2',
    },
    {
      id: 3,
      name: 'FUNCIONARIO 3',
    },
  ];

  dispositionTestData = [
    {
      id: 1,
      description: 'DISPOSICIÓN 1',
    },
    {
      id: 2,
      description: 'DISPOSICIÓN 2',
    },
    {
      id: 3,
      description: 'DISPOSICIÓN 3',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getSelectItems();
  }

  private prepareForm(): void {
    this.coverForm = this.fb.group({
      user: [null, [Validators.required]],
      unit: [null, [Validators.required]],
      file: [null, [Validators.required]],
      disposition: [null, [Validators.required]],
      publicOfficial: [null, [Validators.required]],
      fileDate: [null, [Validators.required]],
      reserveDate: [null],
      pages: [null, [Validators.required]],
      dossiers: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      regionalDelegation: [
        'BAJA CALIFORNIA',
        [Validators.pattern(STRING_PATTERN)],
      ],
      transferee: ['SAT - COMERCIO EXTERIOR'],
      ddcId: [3919],
      coding: ['AND/AC/10'],
      reservePeriod: [0],
      clasificacition: ['PÚBLICO'],
      documentSection: ['4C'],
      documentSeries: [10],
      procedureFileLifetime: 1,
      concentrationFileLifetime: 30,
      documentValues: [null],
    });
  }

  getSelectItems() {
    // Inicializar items de selects con buscador
    this.getUsers({ page: 1, text: '' });
    this.getUnits({ page: 1, text: '' });
    this.getFiles({ page: 1, text: '' });
    this.getOfficials({ page: 1, text: '' });
    // Llamar servicio para llenar el select de Autoridad
    this.dispositions = this.dispositionTestData;
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.loading = true;
    // Llamar servicio para agregar caratula
    this.loading = false;
    this.onLoadToast('success', 'La carátula se creó con éxito', '');
    this.coverGenerated = true;
    this.fileInfo = {
      fileNo: 431,
      fileDate: '27/03/2018',
      userCreate: 'jfigueroa_sae',
      creationDate: '10-abr-2018',
    };
  }

  handleSuccess() {
    this.onCreate.emit(true);
    this.modalRef.hide();
  }

  openCover() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  getUsers(params: ListParams) {
    // Funcion para demostrar funcionamiento de select. Reemplazar por uso de apis
    if (params.text == '') {
      this.userItems = new DefaultSelect(this.userTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.userTestData.filter((i: any) => i.id == id)];
      this.userItems = new DefaultSelect(item[0], 1);
    }
  }

  getUnits(params: ListParams) {
    // Funcion para demostrar funcionamiento de select. Reemplazar por uso de apis
    if (params.text == '') {
      this.unitItems = new DefaultSelect(this.unitTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.unitTestData.filter((i: any) => i.id == id)];
      this.unitItems = new DefaultSelect(item[0], 1);
    }
  }

  getFiles(params: ListParams) {
    // Funcion para demostrar funcionamiento de select. Reemplazar por uso de apis
    if (params.text == '') {
      this.fileItems = new DefaultSelect(this.fileTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.fileTestData.filter((i: any) => i.id == id)];
      this.fileItems = new DefaultSelect(item[0], 1);
    }
  }

  getOfficials(params: ListParams) {
    // Funcion para demostrar funcionamiento de select. Reemplazar por uso de apis
    if (params.text == '') {
      this.officialItems = new DefaultSelect(this.officialTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.officialTestData.filter((i: any) => i.id == id)];
      this.officialItems = new DefaultSelect(item[0], 1);
    }
  }
}
