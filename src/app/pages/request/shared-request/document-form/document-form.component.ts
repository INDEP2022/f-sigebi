import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IWContent } from 'src/app/core/models/ms-wcontent/wcontent.model';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUM_POSITIVE_LETTERS,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss'],
})
export class DocumentFormComponent extends BasePage implements OnInit {
  documentForm: FormGroup = new FormGroup({});
  wcontent: ModelForm<IWContent>;
  typesDocuments: any = []; //= new DefaultSelect();
  transferents = new DefaultSelect();
  states = new DefaultSelect();
  parameter: any;
  typeDoc: string;
  regionalDelegacionName: string = '';
  idRegDelegation: number = null;
  file: File = null;
  registerLvl = '';
  isreadOnly = true;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private wcontentService: WContentService,
    private delegationStateService: DelegationStateService,
    private transferentService: TransferenteService,
    private regDelegationService: RegionalDelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getDocType(new ListParams());
    this.setRegionalDelegacion();
    this.setByTypeDocument();
    this.reactiveFormCalls();
  }

  prepareForm() {
    this.documentForm = this.fb.group({
      xtipoDocumento: [null, [Validators.required]],
      document: [null, [Validators.required]],
      ddocTitle: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      xidSolicitud: [null],
      xidExpediente: [null],
      xidBien: [null],
      //numberGestion: [5296016],
      xidSIAB: [
        null,
        [Validators.pattern(NUM_POSITIVE_LETTERS), Validators.maxLength(30)],
      ],
      xresponsable: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      xdelegacionRegional: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      xcontribuyente: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      xestado: [null],
      xnoOficio: [
        null,
        [Validators.pattern(NUM_POSITIVE_LETTERS), Validators.maxLength(30)],
      ],
      xidTransferente: [null],
      //numberProgramming: [5397],
      xremitente: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      //programmingFolio: ['R-METROPOLITANA-SAT-5397-OS'],
      xcargoRemitente: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      xcomments: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
    });
  }

  setByTypeDocument() {
    if (this.typeDoc === 'doc-expediente') {
      this.documentForm.controls['xidExpediente'].setValue(
        this.parameter.recordId
      );
      this.registerLvl = 'Expediente';
    } else if (this.typeDoc === 'doc-solicitud') {
      this.documentForm.controls['xidSolicitud'].setValue(this.parameter.id);
      this.registerLvl = 'Solicitud';
    } else if (this.typeDoc === 'doc-bien') {
      this.documentForm.controls['xidBien'].setValue(this.parameter.goodId);
      this.registerLvl = 'Bien';
    } else if (this.typeDoc === 'doc-buscar') {
      if (this.parameter) {
        this.documentForm.controls['xidSolicitud'].setValue(
          this.parameter.xidSolicitud
        );
        this.documentForm.controls['xidExpediente'].setValue(
          this.parameter.xidExpediente
        );
        this.documentForm.controls['xidBien'].setValue(this.parameter.xidBien);
        this.registerLvl = 'Expediente';
        this.isreadOnly = false;
      }
    }
  }

  getDocumentSelect(typeDocument: ListParams) {}

  getTransferents(params: ListParams) {
    params['filter.status'] = `$eq:${1}`;
    params['filter.nameTransferent'] = `$ilike:${params.text}`;
    this.transferentService.getAll(params).subscribe({
      next: resp => {
        this.transferents = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getState(params: ListParams) {
    let id = this.documentForm.controls['xdelegacionRegional'].value;
    params['filter.regionalDelegation'] = `$eq:${id}`;
    this.delegationStateService.getAll(params).subscribe({
      next: resp => {
        let result = resp.data
          .map((x: any) => {
            return x.stateCode;
          })
          .filter((x: any) => x != undefined);

        this.states = new DefaultSelect(result, result.length);
      },
    });
  }

  setRegionalDelegacion() {
    if (this.parameter.regionalDelegation) {
      this.documentForm.controls['xdelegacionRegional'].setValue(
        this.parameter.regionalDelegation.id
      );
      this.regionalDelegacionName =
        this.parameter.regionalDelegation.description;
      this.getState(new ListParams());
    } else {
      let deleRegId = 0;
      if (this.typeDoc === 'doc-buscar') {
        deleRegId = this.parameter.xdelegacionRegional;
      } else {
        deleRegId = this.parameter.regionalDelegacionId;
      }
      this.regDelegationService.getById(deleRegId).subscribe({
        next: resp => {
          this.documentForm.controls['xdelegacionRegional'].setValue(resp.id);
          this.regionalDelegacionName = resp.description;
          this.getState(new ListParams());
        },
      });
    }
  }

  getDocType(params: ListParams) {
    this.wcontentService.getDocumentTypes(params).subscribe({
      next: (resp: any) => {
        this.typesDocuments = resp.data; //= new DefaultSelect(resp.data, resp.length);
      },
    });
  }

  uploadFile(event: any) {
    if (!event.target.files[0].name.endsWith('.pdf')) {
      this.onLoadToast(
        'error',
        'Error al carga el archivo',
        'Solo se permiten archivos en formato PDF'
      );
      this.documentForm.controls['document'].setValue(null);
      return;
    }
    if (event.target.files[0].size > 10485760) {
      this.onLoadToast(
        'error',
        'Carga Archivo',
        'Seleccione un archivo no mayor a 10 Mb.'
      );
      this.documentForm.controls['document'].setValue(null);
      return;
    }
    this.file = event.target.files[0];
  }

  confirm() {
    if (!this.file) {
      this.onLoadToast(
        'error',
        'Carga Archivo',
        'Es requerido cargar un documento'
      );
      return;
    }
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea crear un nuevo documento?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        const doctype = this.documentForm.controls['xtipoDocumento'].value;
        let docName = '';
        if (this.typeDoc !== 'doc-bien') {
          docName = 'Reporte_' + doctype + this.formatDate() + '.pdf';
        } else {
          docName = 'Imagen_' + doctype + this.formatDate() + '.img';
        }

        const form = this.documentForm.getRawValue();
        for (const key in form) {
          if (form[key] === null) {
            form[key] = '';
          }
        }
        form['ddocName'] = docName;
        form['dSecurityGroup'] = 'Public';
        form['xNivelRegistroNSBDB'] = this.registerLvl;
        form['xNombreProceso'] = 'Captura Solicitud';
        delete form['document'];

        if (this.typeDoc !== 'doc-bien') {
          this.saveDocument(docName, '.pdf', form);
        } else {
          this.saveGoodImgs(docName, '.img', form);
        }
      }
    });
  }

  //sube documentos
  saveDocument(docName: string, type: string, form: any) {
    this.wcontentService
      .addDocumentToContent(
        docName,
        type,
        JSON.stringify(form),
        this.file,
        '.pdf'
      )
      .subscribe({
        next: resp => {
          this.onLoadToast(
            'success',
            'Documento Guardado',
            'El documento se guardó correctamente'
          );

          this.close();
        },
        error: error => {},
      });
  }

  //sube imagenes
  saveGoodImgs(docName: string, type: string, form: any) {
    this.wcontentService
      .addImagesToContent(docName, type, JSON.stringify(form), this.file)
      .subscribe({
        next: resp => {
          this.onLoadToast(
            'success',
            'Imagen Guardada',
            'La imagen se guardó correctamente'
          );

          this.close();
        },
      });
  }

  close() {
    this.modalRef.hide();
  }

  formatDate() {
    const date = new Date();

    return date.getFullYear() + '' + date.getMonth() + '' + date.getDate();
  }

  getDate() {
    const date = new Date();
  }
  reactiveFormCalls() {
    this.documentForm.controls['xestado'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          this.getTransferents(new ListParams());
        }
      }
    );
  }
}
