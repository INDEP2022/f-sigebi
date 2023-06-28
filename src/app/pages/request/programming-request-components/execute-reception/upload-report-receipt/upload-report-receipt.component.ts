import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import {
  IReceipt,
  IRecepitGuard,
} from 'src/app/core/models/receipt/receipt.model';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
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
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private receptionService: ReceptionGoodService,
    private programmingService: ProgrammingRequestService,
    private wContentService: WContentService,
    private receptionGoodService: ReceptionGoodService,
    private proceedingService: ProceedingsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    console.log('this.typeDoc', this.typeDoc);
    if (this.typeDoc == 185 || this.typeDoc == 186) {
      this.getGoodsRelReceipt();
    }

    if (this.typeDoc == 103) {
      this.getReceipts();
      this.getProceeding();
      this.getGoodsReceipt();

      console.log('guardReception');
    }
    this.getProgramming();
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null],
    });
  }

  getGoodsReceipt() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmationId'] = this.programming.id;
    this.receptionService.getReceiptGood(params.getValue()).subscribe({
      next: response => {
        console.log('response', response); //Hace falta un filtro
        response.data.map((item: IRecepitGuard) => {
          this.goodId += item.idGood + ' ';
        });
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
        console.log('proc', response);
        this.proceeding = response.data[0];
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
    if (this.selectedFile?.size > 10000000) {
      this.validateSizePDF = true;
      this.onLoadToast(
        'warning',
        'Error',
        'Se debe cargar un documentos menor a 10MB'
      );
      this.form.get('file').reset;
    }

    const extension = this.selectedFile?.name.split('.').pop();
    if (extension != 'pdf') {
      this.onLoadToast('warning', 'Error', 'Se debe cargar un documento PDF');
      this.form.get('file').setValue(null);
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
                'Documento Adjuntado correctamente'
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
      console.log('Soy un recibo de entrega listo para ser creado');
      const idProg = this.programming.id;
      console.log('recibos', this.receipt);
      console.log('actas', this.proceeding);
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

      console.log('formData', formData);

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
          next: response => {
            console.log('doc guardado', response);
            const updateReceipt = this.updateReceipt(response.dDocName);
            if (updateReceipt) {
              const updateGood = this.onLoadToast(
                'success',
                'Acción correcta',
                'Documento Adjuntado correctamente'
              );
              this.close();
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

  updateReceipt(docName: string) {
    return new Promise((resolve, reject) => {
      console.log('receipt', this.receipt);
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
      });
    });
  }

  close() {
    this.modalRef.hide();
  }
}
