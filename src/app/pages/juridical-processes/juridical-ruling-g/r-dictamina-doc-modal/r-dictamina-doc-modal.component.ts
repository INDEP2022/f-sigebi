import { Component, OnInit, ViewChild } from '@angular/core';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  dataDocuments: any[] = [];
  stateNumber: any;
  selectedDocs: any;
  dateValid: any;
  @ViewChild('tabla') tabla: Ng2SmartTableComponent;
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
        delete: false,
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
        let result = resp.data.map(async (item: any) => {
          item['date'] = '';
        });
        this.dataDocuments = resp.data;
        console.log('Respuesta: ', resp.data);
      },
      error: error => {
        console.log('Respuesta: ', error);
      },
    });
  }

  selectProceedings(event: any) {
    console.log('EVENT', event);
    this.selectedDocs = event.selected;
  }

  openForm(documents?: IRDictationDoc) {
    const typeDictation = this.typeDictation;
    const stateNumber = this.stateNumber;
    const dateValid = this.dateValid;
    // let config: ModalOptions = {
    //   initialState: {
    //     typeDictation,
    //     stateNumber,
    //     documents,
    //     callback: (next: any) => {
    //       console.log("NEXT", next)
    //       /*if (next) {

    //       }*/
    //     },
    //   },
    //   class: 'modal-lg modal-dialog-centered',
    //   ignoreBackdropClick: true,
    // };
    // this.modalService.show(EditDocumentsModalComponent, config)
    const modalRef = this.modalService.show(EditDocumentsModalComponent, {
      initialState: {
        typeDictation,
        stateNumber,
        documents,
        dateValid,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.dataText.subscribe((next: any) => {
      let filaAEditar = this.dataDocuments.find(
        item => item.cveDocument === next.cve
      );
      filaAEditar.date = next.date;
      this.actualizarTabla();
      // filaAEditar.email = 'maria.fernanda@gmail.com';
      for (let i = 0; i < this.dataDocuments.length; i++) {
        console.log('this.dataDocuments[i]', this.dataDocuments[i]);
        if (next.cve === this.dataDocuments[i].cveDocument) {
          this.dataDocuments[i].date = next.date;
        }
      }
    });
  }

  actualizarTabla() {
    this.tabla.grid.dataSet.setData(this.dataDocuments);
  }

  close() {
    for (let i = 0; i < this.dataDocuments.length; i++) {
      if (this.dataDocuments[i].date == '') {
        this.onLoadToast(
          'info',
          'Asegúrese de ingresar las fechas en los documentos',
          ''
        );
        return;
      }
    }
    this.modalRef.content.callback(this.dataDocuments);
    this.modalRef.hide();
  }
}
