import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

import { BehaviorSubject, skip } from 'rxjs';
import { IRDictationDoc } from 'src/app/core/models/ms-dictation/r-dictation-doc.model';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/r-dictation-doc.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DOCUMENTS_COLUMNS } from './documents-form-columns';

type ResultHide = IRDictationDoc & { descripcion: string };
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
  queryParams: { [key: string]: string };
  selection = new Map();

  @Output() refresh = new EventEmitter<true>();
  @Output() onSelect = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<ResultHide[]>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private dictationService: DictationService,
    private readonly documentService: DocumentsService,
    private DictationXGood1Service: DictationXGood1Service
  ) {
    super();
    //  = {
    // ...DOCUMENTS_COLUMNS.selection,
    (DOCUMENTS_COLUMNS.selection.onComponentInitFunction =
      this.onClickSelect.bind(this)),
      // };
      (this.settings.columns = DOCUMENTS_COLUMNS);
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getDocumentsbyDictation();
    this.params.pipe(skip(1)).subscribe((params: ListParams) => {
      this.getDocumentsbyDictation(params);
    });
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
    this.onClose.emit(this.convertMapToArray(this.selection));
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

  convertMapToArray(map: Map<any, any>) {
    return Array.from(map.values());
  }

  onClickSelect(event: any) {
    event.toggle.subscribe((data: any) => {
      console.log(data, this.selection);
      // data.row.seleccion = data.toggle;
      if (data.toggle) {
        this.selection.set(data.row.cveDocument, data.row);
      } else {
        // this.selection = this.selection.filter(
        //   (item: any) => item.id !== data.row.id
        // );
        this.selection.delete(data.row.cveDocument);
      }
    });
  }

  handleSuccess() {
    this.refresh.emit(true);
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  getDocumentsbyDictation(params: ListParams = new ListParams()) {
    this.loading = true;
    Object.keys(this.queryParams).forEach((key: any) => {
      params[`filter.${key}`] = this.queryParams[key];
    });
    this.DictationXGood1Service.getAll(params).subscribe({
      next: resp => {
        const data = resp.data.map((item: any) => {
          item['descripcion'] = item.documentDetails.description;
          return item;
        });
        this.totalItems = resp.count;
        console.log('DATA', data);
        this.documents = data;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }
}
