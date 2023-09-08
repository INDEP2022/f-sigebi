import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IGood } from 'src/app/core/models/good/good.model';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import {
  IReceipt,
  IRecepitGuard,
} from 'src/app/core/models/receipt/receipt.model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-upload-report-receipt',
  templateUrl: './upload-report-receipt.component.html',
  styles: [],
})
export class UploadReportReceiptComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  selectedFile: File;
  validateSizePDF: boolean = false;
  receiptGuards: any;
  goodId: string = '';
  typeDoc: number = 0;
  programming: Iprogramming;
  receipt: IReceipt;
  proceeding: IProceedings;
  guardReception: any;
  actId: number;
  folioPro: string = '';
  userInfo: any;
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private receptionService: ReceptionGoodService,
    private programmingService: ProgrammingRequestService,
    private wContentService: WContentService,
    private receptionGoodService: ReceptionGoodService,
    private proceedingService: ProceedingsService,
    private programminGoodService: ProgrammingGoodService,
    private goodService: GoodService,
    private historyGoodService: HistoryGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    if (this.typeDoc == 185 || this.typeDoc == 186) {
      this.getGoodsRelReceipt();
    }

    if (this.typeDoc == 103) {
      this.getReceipts();
      this.getProceeding();
    }

    if (this.typeDoc == 210 || this.typeDoc == 106 || this.typeDoc == 107) {
      this.programmingGoods();
      this.getProceedingById();
    }
    this.getProgramming();
    this.getInfoUserLog();
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null],
    });
  }

  getInfoUserLog() {
    this.programmingService.getUserInfo().subscribe(data => {
      this.userInfo = data;
    });
  }

  getProceedingById() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.actId;
    this.proceedingService.getProceedings(params.getValue()).subscribe({
      next: response => {
        this.folioPro = response.data[0].folioProceedings;
      },
      error: error => {},
    });
  }

  getGoodsRelReceipt() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.receiptGuardId'] = this.receiptGuards.id;
    this.receptionService.getReceptionGoods(params.getValue()).subscribe({
      next: response => {
        response.data.map((item: IRecepitGuard) => {
          this.goodId += item.idGood + ' ';
        });
      },
      error: error => {},
    });
  }

  programmingGoods() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programming.id;
    this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
      next: response => {
        response.data.map(item => {
          this.goodId += item.goodId;
        });
      },
      error: error => {},
    });
  }

  getReceipts() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programming.id;
    this.receptionGoodService.getReceipt(params.getValue()).subscribe({
      next: response => {
        this.receipt = response.data[0];
      },
      error: error => {},
    });
  }

  getProceeding() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.idPrograming'] = this.programming.id;
    this.proceedingService.getProceedings(params.getValue()).subscribe({
      next: response => {
        this.proceeding = response.data[0];
        this.getGoodsReceipt();
      },
      error: error => {},
    });
  }

  getGoodsReceipt() {
    let good: IRecepitGuard[] = [];
    const formData = {
      programmationId: this.programming.id,
      actId: this.proceeding?.id,
    };
    this.receptionService.getReceiptGoodByIds(formData).subscribe({
      next: response => {
        good.push(response);
        good.map((item: IRecepitGuard) => {
          this.goodId += item.goodId + ' ';
        });
      },
      error: error => {},
    });
  }

  getProgramming() {
    this.programmingService.getProgrammingId(this.programming.id).subscribe({
      next: response => {
        this.programming = response;
      },
      error: error => {},
    });
  }

  selectFile(event?: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile?.size > 100000000) {
      this.validateSizePDF = true;
      this.alertInfo(
        'info',
        'Acción Inválida',
        'Se debe cargar un documentos menor a 100MB'
      ).then(question => {
        if (question.isConfirmed) {
          this.form.get('file').reset;
        }
      });
    }

    const extension = this.selectedFile?.name.split('.').pop();
    if (extension != 'pdf') {
      this.alertInfo(
        'info',
        'Acción Inválida',
        'Se debe cargar un documentos menor a 100MB'
      ).then(question => {
        if (question.isConfirmed) {
          this.form.get('file').reset;
        }
      });
    }
  }

  saveDocument() {
    if (this.typeDoc == 185 || this.typeDoc == 186) {
      let docTitle: string = '';
      if (this.typeDoc == 185) {
        docTitle = 'ReciboResguardo';
      } else if (this.typeDoc == 186) {
        docTitle = 'ReciboAlmacen';
      }
      const formData = {
        keyDoc: this.receiptGuards.id,
        autografos: true,
        electronicos: false,
        dDocTitle: docTitle,
        dSecurityGroup: 'Public',
        xidTransferente: this.programming.tranferId,
        xidBien: this.goodId,
        xNivelRegistroNSBDB: 'Bien',
        xTipoDocumento: this.typeDoc,
        xNoProgramacion: this.programming.id,
        xNombreProceso: 'Ejecutar Recepción',
        xDelegacionRegional: this.programming.regionalDelegationNumber,
        xFolioProgramacion: this.programming.folio,
      };

      const extension = '.pdf';
      let docName: string = '';
      if (this.typeDoc == 185) {
        docName = 'Recibo Resguardo';
      } else if (this.typeDoc == 186) {
        docName = 'Recibo Almacen';
      }

      this.wContentService
        .addDocumentToContent(
          docName,
          extension,
          JSON.stringify(formData),
          this.selectedFile,
          extension
        )
        .subscribe({
          next: async response => {
            const updateReceiptGuard = this.updateReceiptGuard(
              response.dDocName
            );
            if (updateReceiptGuard) {
              this.alertInfo(
                'success',
                'Acción correcta',
                'Documento adjuntado correctamente'
              ).then(question => {
                if (question.isConfirmed) {
                  this.modalRef.content.callback(true);
                  this.close();
                }
              });
            }
          },
        });
    }

    if (this.typeDoc == 103) {
      const idProg = this.programming.id;
      //const idReceipt = this.
      const formData = {
        keyDoc:
          this.programming.id +
          '-' +
          this.receipt.actId +
          '-' +
          this.receipt.id,
        xNivelRegistroNSBDB: 'Bien',
        xNoProgramacion: this.programming.id,
        xNombreProceso: 'Ejecutar Recepción',
        xDelegacionRegional: this.programming.regionalDelegationNumber,
        xFolioProgramacion: this.programming.folio,
        xFolioRecibo: this.receipt.folioReceipt,
        dDocTitle: this.receipt.folioReceipt,
        dSecurityGroup: 'Public',
        xidBien: this.goodId,
        xidTransferente: this.programming.tranferId,
        xTipoDocumento: 103,
      };

      const extension = '.pdf';
      const docName = 'Recibo Resguardo';

      this.wContentService
        .addDocumentToContent(
          docName,
          extension,
          JSON.stringify(formData),
          this.selectedFile,
          extension
        )
        .subscribe({
          next: async response => {
            const updateReceipt = await this.updateReceipt(response.dDocName);

            if (updateReceipt) {
              const updateProgrammingGood = await this.updateProgrammingGood();

              if (updateProgrammingGood) {
                const updateGood = await this.updateGood();

                if (updateGood) {
                  const createHistGood = await this.createHistorailGood();
                  if (createHistGood) {
                    this.alertInfo(
                      'success',
                      'Acción Correcta',
                      'Documento adjuntado correctamente'
                    ).then(question => {
                      if (question.isConfirmed) {
                        this.close();
                        this.modalRef.content.callback(true);
                      }
                    });
                  }
                }
              }
            }
          },
        });
    }

    if (this.typeDoc == 210) {
      const idProg = this.programming.id;
      //const idReceipt = this.
      const formData = {
        keyDoc: this.programming.id + '-' + this.actId,
        xNivelRegistroNSBDB: 'Bien',
        xNoProgramacion: this.programming.id,
        xNombreProceso: 'Ejecutar Recepción',
        xDelegacionRegional: this.programming.regionalDelegationNumber,
        xFolioProgramacion: this.programming.folio,
        DocTitle: this.folioPro,
        xnoActa: this.actId,
        dSecurityGroup: 'Public',
        xidBien: this.goodId,
        xidTransferente: this.programming.tranferId,
        xTipoDocumento: 210,
      };

      const extension = '.pdf';
      const docName = this.folioPro;

      this.wContentService
        .addDocumentToContent(
          docName,
          extension,
          JSON.stringify(formData),
          this.selectedFile,
          extension
        )
        .subscribe({
          next: response => {
            const updateReceipt = this.procedding(response.dDocName);
            if (updateReceipt) {
              this.alertInfo(
                'success',
                'Acción Correcta',
                'Documento adjuntado correctamente'
              ).then(question => {
                if (question.isConfirmed) {
                  this.close();
                  this.modalRef.content.callback(true);
                }
              });
            }
          },
        });
    }

    if (this.typeDoc == 106) {
      const idProg = this.programming.id;
      //const idReceipt = this.
      const formData = {
        keyDoc: this.programming.id + '-' + this.actId,
        xNivelRegistroNSBDB: 'Bien',
        xNoProgramacion: this.programming.id,
        xNombreProceso: 'Ejecutar Recepción',
        xDelegacionRegional: this.programming.regionalDelegationNumber,
        xFolioProgramacion: this.programming.folio,
        DocTitle: this.folioPro,
        xnoActa: this.actId,
        dSecurityGroup: 'Public',
        xidBien: this.goodId,
        xidTransferente: this.programming.tranferId,
        xTipoDocumento: 106,
      };

      const extension = '.pdf';
      const docName = this.folioPro;

      this.wContentService
        .addDocumentToContent(
          docName,
          extension,
          JSON.stringify(formData),
          this.selectedFile,
          extension
        )
        .subscribe({
          next: response => {
            const updateReceipt = this.procedding(response.dDocName);
            if (updateReceipt) {
              this.alertInfo(
                'success',
                'Acción Correcta',
                'Documento adjuntado correctamente'
              ).then(question => {
                if (question.isConfirmed) {
                  this.close();
                  this.modalRef.content.callback(true);
                }
              });
            }
          },
        });
    }

    if (this.typeDoc == 107) {
      const idProg = this.programming.id;
      //const idReceipt = this.
      const formData = {
        keyDoc: this.programming.id + '-' + this.actId,
        xNivelRegistroNSBDB: 'Bien',
        xNoProgramacion: this.programming.id,
        xNombreProceso: 'Ejecutar Recepción',
        xDelegacionRegional: this.programming.regionalDelegationNumber,
        xFolioProgramacion: this.programming.folio,
        DocTitle: this.folioPro,
        xnoActa: this.actId,
        dSecurityGroup: 'Public',
        xidBien: this.goodId,
        xidTransferente: this.programming.tranferId,
        xTipoDocumento: 107,
      };

      const extension = '.pdf';
      const docName = this.folioPro;

      this.wContentService
        .addDocumentToContent(
          docName,
          extension,
          JSON.stringify(formData),
          this.selectedFile,
          extension
        )
        .subscribe({
          next: response => {
            const updateReceipt = this.procedding(response.dDocName);
            if (updateReceipt) {
              this.alertInfo(
                'success',
                'Acción Correcta',
                'Documento adjuntado correctamente'
              ).then(question => {
                if (question.isConfirmed) {
                  this.close();
                  this.modalRef.content.callback(true);
                }
              });
            }
          },
        });
    }
  }

  updateReceiptGuard(docName: string) {
    return new Promise((resolve, reject) => {
      const formData: any = {
        id: this.receiptGuards.id,
        statusReceiptGuard: 'CERRADO',
        contentId: docName,
      };

      this.receptionGoodService
        .updateReceiptGuard(this.receiptGuards.id, formData)
        .subscribe({
          next: response => {
            resolve(true);
          },
          error: error => {},
        });
    });
  }

  procedding(docName: string) {
    return new Promise((resolve, reject) => {
      const formData: any = {
        id: this.actId,
        idPrograming: this.programming.id,
        statusProceeedings: 'CERRADO',
        id_content: docName,
        closingDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };

      this.proceedingService.updateProceeding(formData).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {},
      });
    });
  }

  updateReceipt(docName: string) {
    return new Promise((resolve, reject) => {
      const formData: any = {
        id: this.receipt.id,
        actId: this.receipt.actId,
        programmingId: this.programming.id,
        statusReceipt: 'CERRADO',
        contentId: docName,
      };

      this.receptionGoodService.updateReceipt(formData).subscribe({
        next: () => {
          resolve(true);
        },
        error: error => {
          resolve(true);
        },
      });
    });
  }

  updateProgrammingGood() {
    return new Promise((resolve, reject) => {
      const goodsReception = this.guardReception.value;

      goodsReception.map((item: IGood) => {
        const formData: Object = {
          programmingId: this.programming.id,
          goodId: item.id,
          status: 'EN_RECEPCION',
        };
        this.programminGoodService.updateGoodProgramming(formData).subscribe({
          next: response => {
            resolve(true);
          },
          error: error => {},
        });
      });
    });
  }

  updateGood() {
    return new Promise((resolve, reject) => {
      const goodsReception = this.guardReception.value;
      goodsReception.map((item: IGood) => {
        const formData: Object = {
          id: item.id,
          goodId: item.goodId,
          goodStatus: 'EN_RECEPCION',
          status: 'ADM',
        };
        this.goodService.updateByBody(formData).subscribe({
          next: response => {
            resolve(true);
          },
          error: error => {},
        });
      });
    });
  }

  createHistorailGood() {
    return new Promise((resolve, reject) => {
      const goodsReception = this.guardReception.value;
      goodsReception.map((item: IGood) => {
        const historyGood: IHistoryGood = {
          propertyNum: item.goodId,
          status: 'ADM',
          changeDate: new Date(),
          userChange: this.userInfo.name,
          statusChangeProgram: 'TR_UPD_HISTO_BIENES',
          reasonForChange: 'AUTOMATICO',
        };

        this.historyGoodService.create(historyGood).subscribe({
          next: response => {
            resolve(true);
          },
          error: error => {},
        });
      });
    });
  }

  close() {
    this.modalRef.hide();
  }
}
