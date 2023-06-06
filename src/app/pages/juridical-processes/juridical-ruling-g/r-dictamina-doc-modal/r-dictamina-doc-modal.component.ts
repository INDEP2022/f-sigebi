import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IRDictationDoc } from 'src/app/core/models/ms-dictation/r-dictation-doc.model';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/r-dictation-doc.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
    private dictationXGood1Service: DictationXGood1Service
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
      mode: 'inline',
      columns: { ...COLUMNS_DOCUMENTS },
    };
  }

  ngOnInit(): void {
    /*let params = new FilterParams();
    params.addFilter(
      'numberClassifyGood', this.numberClassifyGood,
      SearchFilter.EQ
    );
    params.addFilter(
      'typeDictation', this.typeDictation,
      SearchFilter.EQ
    );
    params.addFilter(
      'crime', this.crime,
      SearchFilter.EQ
    );
    params.addFilter(
      'typeSteeringwheel', this.typeSteeringwheel,
      SearchFilter.EQ
    );*/

    let params = new FilterParams();
    params.addFilter('numberClassifyGood', 906, SearchFilter.EQ);
    params.addFilter('typeDictation', 'PROCEDENCIA', SearchFilter.EQ);
    params.addFilter('crime', 'N', SearchFilter.EQ);
    params.addFilter('typeSteeringwheel', 'T', SearchFilter.EQ);

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

  close() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
