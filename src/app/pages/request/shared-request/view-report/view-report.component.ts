import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import Quill from 'quill';
import { BasePage } from 'src/app/core/shared/base-page';
import { SignatureTypeComponent } from '../signature-type/signature-type.component';

const font = Quill.import('formats/font');
font.whitelist = ['mirza', 'roboto', 'aref', 'serif', 'sansserif', 'monospace'];
Quill.register(font, true);

class Document {
  _id: string;
  content: string;
}

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styles: [],
})
export class ViewReportComponent extends BasePage implements OnInit {
  documents: Document[];
  document: Document = new Document();
  @ViewChild('tabsReport', { static: false }) tabsReport?: TabsetComponent;

  quillInstance: any;

  form: FormGroup;
  model: any;

  isSigned: boolean = false;
  isSignedReady: boolean = false;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.document.content = this.sanitizer.bypassSecurityTrustHtml(
      this.documents[0].content
    ) as string;
    this.prepareForm();
  }

  prepareForm(): void {
    this.form = this.fb.group({
      template: ['template1'],
    });

    this.form.get('template').valueChanges.subscribe(value => {
      let template = this.documents.find(temp => temp._id == value);
      this.document.content = this.sanitizer.bypassSecurityTrustHtml(
        template.content
      ) as string;
    });
  }

  confirm() {
    this.handleSuccess();
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  sign(context?: Partial<SignatureTypeComponent>): void {
    const modalRef = this.modalService.show(SignatureTypeComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.signatureType.subscribe(next => {
      if (next) {
        this.isSigned = true;
        this.tabsReport.tabs[0].active = true;
      } else {
        this.isSignedReady = false;
        this.isSigned = false;
        this.tabsReport.tabs[0].disabled = false;
        this.tabsReport.tabs[0].active = true;
      }
    });
  }

  nextStep($event: any): void {
    if ($event) {
      this.isSignedReady = true;
      this.tabsReport.tabs[0].active = true;
    } else {
      this.isSignedReady = false;
    }
  }

  attachDocument() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea adjuntar el documento?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Documento adjuntado correctamente', '');
        this.close();
      }
    });
  }
}
