import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IRDictationDoc } from 'src/app/core/models/ms-dictation/r-dictation-doc.model';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/r-dictation-doc.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EditDocumentsModalComponent } from '../edit-documents-modal/edit-documents-modal.component';
import { COLUMNS_DOCUMENTS } from './columns-document';

@Component({
  selector: 'app-r-dictamina-doc-modal',
  templateUrl: './r-dictamina-doc-modal.component.html',
  styles: [],
})
export class RDictaminaDocModalComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  listParams = new BehaviorSubject<ListParams>(new ListParams());
  numberClassifyGood: any;
  typeDictation: any;
  crime: any;
  typeSteeringwheel: any;
  dataDocuments: IRDictationDoc[] = [];
  constructor(
    private modalRef: BsModalRef,
    private dictationXGood1Service: DictationXGood1Service,
    private modalService: BsModalService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...COLUMNS_DOCUMENTS },
    };
  }

  ngOnInit(): void {
    let params = new FilterParams();
    params.addFilter(
      'numberClassifyGood',
      this.numberClassifyGood,
      SearchFilter.EQ
    );
    params.addFilter(
      'typeDictation',
      this.typeDictation, //ok
      SearchFilter.EQ
    );
    params.addFilter(
      'crime',
      this.crime, //ok
      SearchFilter.EQ
    );
    params.addFilter(
      'typeSteeringwheel',
      this.typeSteeringwheel, //ok
      SearchFilter.EQ
    );

    /*let params = new FilterParams();
    params.addFilter('numberClassifyGood', 906, SearchFilter.EQ);
    params.addFilter('typeDictation', 'PROCEDENCIA', SearchFilter.EQ);
    params.addFilter('crime', 'N', SearchFilter.EQ);
    params.addFilter('typeSteeringwheel', 'T', SearchFilter.EQ);*/

    this.dictationXGood1Service.getAll(params.getParams()).subscribe({
      next: resp => {
        this.dataDocuments = resp.data;
        console.log('Respuesta: ', resp.data);
      },
      error: error => {
        console.log('Respuesta: ', error);
      },
    });
  }

  openForm(documents?: IRDictationDoc) {
    let config: ModalOptions = {
      initialState: {
        documents,
        callback: (next: boolean) => {
          /*if (next) {
            
          }*/
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(EditDocumentsModalComponent, config);
  }

  close() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
