import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IRecepitGuard } from 'src/app/core/models/receipt/receipt.model';
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
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private receptionService: ReceptionGoodService,
    private programmingService: ProgrammingRequestService,
    private wContentService: WContentService,
    private receptionGoodService: ReceptionGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    if (this.typeDoc == 185) {
      this.getGoodsRelReceipt();
    }
    this.getProgramming();
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null],
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
    if (this.typeDoc == 185) {
      if (this.receiptGuards.statusReceiptGuard == 'ABIERTO') {
        console.log('document', this.form.value);
        console.log('goodsId', this.goodId);
        console.log('programming', this.programming);
        console.log('typeDoc', this.typeDoc);

        const formData = {
          keyDoc: this.receiptGuards.id,
          autografos: true,
          electronicos: false,
          dDocTitle: 'ReciboResguardo',
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
              console.log('doc guardado', response);
              const updateReceiptGuard = this.updateReceiptGuard(
                response.dDocName
              );
              if (updateReceiptGuard) {
                this.onLoadToast(
                  'success',
                  'Acción correcta',
                  'Documento Adjuntado correctamente'
                );
                this.close();
              }
            },
          });

        if (this.typeDoc == 185) {
          const formData = {
            keyDoc: this.receiptGuards.id,
            autografos: true,
            electronicos: false,
            dDocTitle: 'ReciboAlmacen',
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
                console.log('doc guardado', response);
                const updateReceiptGuard = this.updateReceiptGuard(
                  response.dDocName
                );
                if (updateReceiptGuard) {
                  this.onLoadToast(
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

  close() {
    this.modalRef.hide();
  }
}
