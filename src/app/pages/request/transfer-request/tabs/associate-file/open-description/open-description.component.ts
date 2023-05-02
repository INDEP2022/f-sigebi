import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestHelperService } from 'src/app/pages/request/request-helper-services/request-helper.service';

@Component({
  selector: 'app-open-description',
  templateUrl: './open-description.component.html',
  styles: [],
})
export class OpenDescriptionComponent implements OnInit {
  parameter: any = {};

  constructor(
    private bsModal: BsModalRef,
    private wcontentService: WContentService,
    private requestHelperService: RequestHelperService
  ) {}

  ngOnInit(): void {}

  download() {
    this.wcontentService.obtainFile(this.parameter.docName).subscribe({
      next: resp => {
        const base64 = resp;
        const linkSource = 'data:application/pdf;base64,' + base64;
        const downloadLink = document.createElement('a');
        const fileName = `${this.parameter.docName}.pdf`;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      },
    });
  }

  close() {
    this.closeAssociateExpedientTab();
    this.bsModal.hide();
  }

  closeAssociateExpedientTab() {
    this.requestHelperService.associateExpedient(true);
  }
}
