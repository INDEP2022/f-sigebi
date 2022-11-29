import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Quill from 'quill';
import { BasePage } from 'src/app/core/shared/base-page';

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

  quillInstance: any;

  form: FormGroup;
  model: any;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
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
}
