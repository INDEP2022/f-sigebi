import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
//BasePage
import { BasePage } from 'src/app/core/shared/base-page';
//Services
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
//Components
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';

export interface IReport {
  data: File;
}

@Component({
  selector: 'app-print-flyers',
  templateUrl: './print-flyers.component.html',
  styles: [],
})
export class PrintFlyersComponent extends BasePage implements OnInit {
  flyersForm: FormGroup;
  select = new DefaultSelect();

  constructor(
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private siabService: SiabService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.confirm();
  }

  prepareForm() {
    this.flyersForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      //noArea: [null, [Validators.required]],
      department: [null, [Validators.required]],
      from: [null, Validators.pattern(STRING_PATTERN)],
      to: [null],
      type: [null],
      fromDate: [null],
      toDate: [null],
      P_IDENTIFICADOR: [null, [Validators.required]],
    });
  }

  confirm(): void {
    this.loading = true;
    //console.log(this.checkedListFA,this.checkedListFI)
    console.log(this.flyersForm.value);

    let form = {
      P_USR: 'LGONZALEZ',
      P_CUMP: 1,
      P_T_NO_CUMP: 2,
      P_T_CUMP: 100,
    };

    let pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RINDICA_0001.pdf?P_USR=LGONZALEZ&P_CUMP=1&P_T_NO_CUMP=2&P_T_CUMP=100`; //window.URL.createObjectURL(blob);
    this.openPrevPdf(pdfurl);
    //this.openPrevPdf(pdfurl)
    // open the window
    //let newWin = window.open(pdfurl,"test.pdf");

    /*this.siabService.getReport('RINDICA_0001',form).
    subscribe((report:IReport)=>{

      console.log(report)
      //TODO: VIEW FILE
    },error=>(this.loading = false));*/
    /*setTimeout(st => {
      this.loading = false;
    }, 5000);*/
  }

  openPrevPdf(pdfurl: string) {
    console.log(pdfurl);
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
  }
}
