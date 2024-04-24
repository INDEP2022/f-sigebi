import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDocumentService } from 'src/app/core/services/ms-documents/idocument.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-consultation-of-records',
  templateUrl: './consultation-of-records.component.html',
  styles: [],
})
export class ConsultationOfRecordsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private documentService: IDocumentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      expedient: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(15)],
      ],
    });
  }

  generateDocuments() {
    if (this.form.get('expedient').value) {
      this.loader.load = true;
      const url = `${environment.API_URL}ldocument/${
        environment.URL_PREFIX
      }/file-proceedings/${this.form.get('expedient').value}`;
      console.log(url);
      window.open(url, '_blank');
      setTimeout(() => {
        this.loader.load = false;
        this.alert('success', 'Archivo Descargado Correctamente', '');
      }, 4000);
    } else {
      this.alert('warning', 'Debe llenar el campo de No. Expediente', '');
    }
  }
}
