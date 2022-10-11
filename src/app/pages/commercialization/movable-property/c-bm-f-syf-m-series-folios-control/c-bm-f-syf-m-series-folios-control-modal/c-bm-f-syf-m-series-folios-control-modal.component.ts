import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import { SERIES_FOLIOS_CONTROL_TYPE_EVENT_COLUMNS } from './series-folios-control-type-event-columns';
import { SERIES_FOLIOS_CONTROL_SEPARATE_PAGES_COLUMNS } from './series-folios-control-separate-pages-columns';

@Component({
  selector: 'app-c-bm-f-syf-m-series-folios-control-modal',
  templateUrl: './c-bm-f-syf-m-series-folios-control-modal.component.html',
  styles: [
  ]
})
export class CBmFSyfMSeriesFoliosControlModalComponent extends BasePage implements OnInit {

  settings1 = {...TABLE_SETTINGS};
  settings2 = {...TABLE_SETTINGS};
  form : FormGroup = new FormGroup({});

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.settings1.columns = SERIES_FOLIOS_CONTROL_TYPE_EVENT_COLUMNS;
    this.settings1.actions.edit = false;
    this.settings1.actions.delete = false;
    this.settings1.actions.add = false;

    this.settings2.columns = SERIES_FOLIOS_CONTROL_SEPARATE_PAGES_COLUMNS;
    this.settings2.actions.edit = false;
    this.settings2.actions.delete = false;
    this.settings2.actions.add = false;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(){
    this.form = this.fb.group({
      idInvoice: ['', [Validators.required]],
      idcoordination: ['', [Validators.required]],
      idRegional: ['', [Validators.required]],
      idSerie : ['', [Validators.required]],
      initialFolio: ['', [Validators.required]],
      finalFolio: ['', [Validators.required]],
      validity: ['', [Validators.required]],
      type: ['', [Validators.required]],
      status : ['', [Validators.required]],
      totalFolios: ['', [Validators.required]],
      availableFolios: ['', [Validators.required]],
      foliosUsed: ['', [Validators.required]],
      userRegister: ['', [Validators.required]],
      registerDate: ['', [Validators.required]],
      address: ['', [Validators.required]],
    })
  }

  close() {
    this.modalRef.hide();
  }

 data1 = [
  {
    evento: "SUBASTA ELECTRÓNICA",
    comentario: "0",
  },
 ]

 data2 = [
  {
    folio: "",
    apartado: "",
    usuarioRegistro: "M",
    fechaRegsitro: ""
  },
];

}
