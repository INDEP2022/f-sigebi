import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/r-dictation-doc.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DOCUMENTS_COLUMNS } from './documents-form-columns';

@Component({
  selector: 'app-documents-form',
  templateUrl: './documents-form.component.html',
  styles: [],
})
export class DocumentsFormComponent extends BasePage implements OnInit {
  documentForm: FormGroup = new FormGroup({});
  documents: any[] = [];
  title: string = 'Dictamen';
  edit: boolean = false;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  @Output() refresh = new EventEmitter<true>();
  @Output() onSelect = new EventEmitter<any>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private dictationService: DictationService,
    private readonly documentService: DocumentsService,
    private DictationXGood1Service: DictationXGood1Service
  ) {
    super();
    this.settings.columns = DOCUMENTS_COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getDocumentsbyDictation();
  }

  prepareForm() {
    console.log('TESTDATASELECTOR', this.fb);
    this.documentForm = this.fb.group({
      id: [null],
      description: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(''),
        ]),
      ],
      numRegister: [
        null,
        Validators.compose([Validators.minLength(1), Validators.pattern('')]),
      ],
    });
    if (this.edit) {
      // this.status = 'Actualizar';
      // this.documentForm.patchValue(this.id);
    }
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.onSelect.emit(this.documentForm.value);
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    // this.opinionService.create(this.documentForm.value).subscribe({
    //   next: data => this.handleSuccess(),
    //   error: error => (this.loading = false),
    // });
  }

  update() {
    // this.loading = true;
    // this.opinionService
    //   .update(this.opinion.id, this.documentForm.value)
    //   .subscribe({
    //     next: data => this.handleSuccess(),
    //     error: error => (this.loading = false),
    //   });
  }

  handleSuccess() {
    this.refresh.emit(true);
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  getDocumentsbyDictation() {
    this.loading = true;
    let params = new HttpParams();

    if (this.dictationService.typeDictamination.typeDictum === 'PROCEDENCIA') {
      params = params
        .set('filter.crime', this.dictationService.crime)
        .set(
          'filter.typeDictum',
          this.dictationService.typeDictamination.typeDictum
        );
    }
    if (this.dictationService.typeDictamination.typeDictum !== 'PROCEDENCIA') {
      params = params.set(
        'filter.typeDictum',
        this.dictationService.typeDictamination.typeDictum
      );
    }

    this.DictationXGood1Service.getAll(params).subscribe({
      next: (resp: any) => {
        const data = resp.data.map((item: any) => {
          item.descripcion = item.documentDetails.description;
          return item;
        });
        this.documents = data;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }
}
