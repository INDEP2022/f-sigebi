import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-document-show',
  templateUrl: './document-show.component.html',
  styles: [],
})
export class DocumentShowComponent extends BasePage implements OnInit {
  parameter: any;
  typeDoc: string;

  constructor(
    private modalRef: BsModalRef,
    private regDelegationService: RegionalDelegationService,
    private stateService: StateOfRepublicService,
    private transferetService: TransferenteService,
    private wcontentService: WContentService
  ) {
    super();
  }

  ngOnInit(): void {
    //console.log(this.parameter);
    this.getData();
  }

  async getData() {
    const delegationReg = await this.getRegionalDelegacion(
      this.parameter.xdelegacionRegional
    );
    this.parameter['delegacionRegional'] = delegationReg;
    const state = await this.getState(this.parameter.xestado);
    this.parameter['stateName'] = state;
    const transferente = await this.getTransference(
      this.parameter.xidTransferente
    );
    this.parameter['transferenceName'] = transferente;
  }

  //obtener la transferente
  getTransference(id: number) {
    return new Promise((resolve, reject) => {
      if (id) {
        this.transferetService.getById(id).subscribe({
          next: resp => {
            resolve(resp.nameTransferent);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  //obtener la delegacion regional
  getRegionalDelegacion(id: number) {
    return new Promise((resolve, reject) => {
      if (id) {
        this.regDelegationService.getById(id).subscribe({
          next: resp => {
            resolve(resp.description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  //Obtener el estado
  getState(id: number) {
    return new Promise((resolve, reject) => {
      if (id) {
        this.stateService.getById(id).subscribe({
          next: resp => {
            resolve(resp.descCondition);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  openDocument() {
    const linkSource =
      'data:application/pdf;base64,' + this.parameter.urlDocument;
    const downloadLink = document.createElement('a');
    const fileName = `${this.parameter.dDocName}.pdf`;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  close() {
    this.modalRef.hide();
  }
}
