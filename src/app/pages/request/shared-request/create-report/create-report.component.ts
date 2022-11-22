import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Quill from 'quill';
import { BasePage } from 'src/app/core/shared/base-page';
import { DOCS } from './template';

const font = Quill.import('formats/font');
font.whitelist = ['mirza', 'roboto', 'aref', 'serif', 'sansserif', 'monospace'];
Quill.register(font, true);

class Document {
  _id: string;
  content: string;
}

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styles: [],
})
export class CreateReportComponent extends BasePage implements OnInit {
  documents: Document[] = DOCS;
  document: Document = new Document();
  // we use this property to store the quill instance
  quillInstance: any;

  status: string = 'Nuevo';
  edit: boolean = false;

  form: FormGroup = new FormGroup({});
  model: any;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
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
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.handleSuccess();
    //Call Service To Create PDF
    /*this.bankService.create(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );*/
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
    /*this.bankService.update(this.bank.bankCode, this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );*/
  }

  onContentChanged = (event: any) => {
    //console.log(event);
    this.document.content = event.html;
    this.quillInstance = event.content;
  };

  created(event: any) {
    //console.log(event);
    this.quillInstance = event.getContents();
    //quillDelta = this.quillInstance.getContents();
  }

  /*pdfCreate(): void {
    const quillDelta = this.quillInstance
    console.log(quillDelta)
    pdfExporter.generatePdf(quillDelta,).then((blob:any)=>{
          console.log(blob)
          let pdfurl = window.URL.createObjectURL(blob);
          this.openPrevPdf(pdfurl)
          // open the window
          //let newWin = window.open(downloadURL,"newpdf.pdf");
    }).catch(err=>{
      console.log(err)
    });
  }*/

  /*openPrevPdf(pdfurl:string) {
    console.log(pdfurl)
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfurl),
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
  }*/
}
