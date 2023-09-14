import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil, tap } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import {
  IDonationGoodRequest,
  IDonationPropolsal,
  IRequestDonation,
  ISendRequest,
  ISendRequestProposal,
} from 'src/app/core/models/ms-donation/donation-good.model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { AppraiseService } from 'src/app/core/services/ms-appraise/appraise.service';
import { DonationRequestService } from 'src/app/core/services/ms-donationgood/donation-requets.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS_TABLE_2 } from '../columns-table-2';
import { COLUMNS_TABLE_1 } from './../columns-table-1';

@Component({
  selector: 'app-proposal-inventories-donation',
  templateUrl: './proposal-inventories-donation.component.html',
  styles: [
    `
      .around-tag {
        background: #007bff;
        border-radius: 20px;
        padding: 1rem;
        width: fit-content;
        color: white;
      }
    `,
  ],
})
export class ProposalInventoriesDonationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  data1: IListResponse<IDonationGoodRequest> =
    {} as IListResponse<IDonationGoodRequest>;
  data2: IListResponse<IDonationPropolsal> =
    {} as IListResponse<IDonationPropolsal>;
  settings2 = { ...this.settings, actions: false };
  param: string;
  params = new BehaviorSubject(new ListParams());
  params2 = new BehaviorSubject(new ListParams());
  selectData: IDonationGoodRequest;
  loading2: boolean = false;
  selectData2: IDonationPropolsal;
  coorDesc: any;
  @ViewChild('inventor', { static: true }) inv: ElementRef<HTMLDivElement>;

  constructor(
    private fb: FormBuilder,
    private reportService: SiabService,
    private donationGood: DonationRequestService,
    private actived: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private massiveGoodService: MassiveGoodService,
    private appraiseService: AppraiseService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS_TABLE_1;
    this.settings2.columns = COLUMNS_TABLE_2;

    this.actived.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.param = params['P_TIPO_DONACION'] ?? 'DD';
      });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      warehouseBus: [null, [Validators.pattern(STRING_PATTERN)]],
      coordination: [null, [Validators.pattern(STRING_PATTERN)]],
      warehouse: [null, [Validators.pattern(STRING_PATTERN)]],
      warehouseDesc: [null, [Validators.pattern(STRING_PATTERN)]],
      doneeId: [null, [Validators.pattern(STRING_PATTERN)]],
      donee: [null, [Validators.pattern(STRING_PATTERN)]],
      done: [null, [Validators.pattern(STRING_PATTERN)]],
      delegationNumber: [null, [Validators.pattern(STRING_PATTERN)]],
      delegationDesc: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  public exportInventory() {
    const { warehouse, delegationNumber } = this.form.value;
    console.log('SelectData', this.selectData2);
    let params = {
      requestId: this.selectData2.id_solicitud,
      busWarehouseNumber: warehouse,
      coordinationNumber: Number(delegationNumber),
      donatId: this.selectData.id_donatario,
      pDonationType: this.param,
    };
    console.log('This.param-> ', this.param);
    this.exportExcel(params);
  }

  public callReport() {
    const { warehouseNumb, coordination, doneeId } = this.form.value;

    const params = {
      ALMACEN_BUS: warehouseNumb,
      P_NO_DELEGACION: coordination,
      P_ID_DONATARIO: doneeId,
      P_TIPO_SOLICITUD: this.param,
      P_ID_SOLICITUD: this.selectData.id_solicitud,
      CVE_PROP:
        this.data2.data.length > 0 ? this.data2.data[0].cve_propuesta : '',
    };

    this.reportService
      .fetchReport('RDON_PROPUESTA_INV', params)
      .pipe(
        tap(response => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            },
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        })
      )
      .subscribe();
  }

  public limit(limit: number, field: string, value: string) {
    if (String(value).length > limit) {
      this.form.get(field).patchValue(String(value).slice(0, limit));
    }
  }

  public searchGoodDonac() {
    const { warehouseBus, coordination, doneeId } = this.form.value;
    this.cleanData();
    const dataRequest: ISendRequest = {
      busWarehouseNumber: warehouseBus,
      coordinationNumber: coordination,
      donationId: doneeId,
      donationType: this.param,
    };
    this.params.getValue().page = 1;
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.loading = true;
      this.donationGood
        .getAllDonacGood(dataRequest, this.params.getValue())
        .subscribe({
          next: resp => {
            this.loading = false;
            this.data1 = resp;
          },
          error: () => {
            this.loading = false;
          },
        });
    });
  }

  public updateAdvance() {
    this.alertQuestion(
      'question',
      '¿Desea actualizar el avance del inventario?',
      ''
    ).then(resp => (resp.isConfirmed ? this.updateContracts() : null));
  }

  private updateContracts() {
    const advanceProp = this.data1.data.filter(x => x.avance_propu === 'E');
    let count: number = 0;
    if (advanceProp.length > 0) {
      let ok: number = 0;
      advanceProp.forEach((data, i) => {
        count = i + 1;
        const updGood: IRequestDonation = {
          advanceProp: data.avance_propu,
          donationType: this.param,
          doneeId: Number(data.id_donatario),
          requestId: Number(data.id_solicitud),
          storeNumber: Number(data.no_almacen),
        };

        console.log(count, advanceProp.length);
        console.log('updGood del For Each-> ', updGood);
        this.donationGood.updateRequestDonation(updGood).subscribe({
          next: () => {
            ok++;
            console.log(
              Number(count) == Number(advanceProp.length),
              'ok -->',
              ok
            );
            if (Number(count) == Number(advanceProp.length) && ok == count) {
              this.onLoadToast(
                'success',
                'Ha sido Actualizado Correctamente el Inventario',
                ''
              );
              console.log('entra 1');
            }
            console.log('updGood del servicio-> ', updGood);
          },
          error: () => {},
        });
      });
    } else {
      this.onLoadToast(
        'info',
        "No se tiene inventarios con avance de propuesta 'E'",
        ''
      );
    }
  }

  public selectEvent({ data }: any) {
    this.selectData = data;
    console.log('Select Data', data);
    console.log('this.selectData.no_almacen-> ', this.selectData.no_almacen);
  }

  public inventory() {
    if (this.selectData) {
      this.inv.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      this.loading2 = true;
      const {
        no_almacen,
        id_solicitud,
        id_donatario,
        donatario,
        desc_almacen,
        no_delegacion,
      }: any = this.selectData;
      const sendData: ISendRequestProposal = {
        donationType: this.param,
        doneeId: id_donatario,
        requestId: id_solicitud,
        storeNumber: no_almacen,
        delegationNumber: no_delegacion,
      } as ISendRequestProposal;
      this.params2.getValue().page = 1;

      this.form.get('warehouse').patchValue(no_almacen);
      this.form.get('warehouseDesc').patchValue(desc_almacen);
      this.form.get('doneeId').patchValue(id_donatario);
      this.form.get('donee').patchValue(donatario);
      this.form.get('delegationNumber').patchValue(no_delegacion);

      this.obtenerCoordinacion(no_delegacion);

      this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
        this.donationGood
          .getAllDonacGoodProposal(sendData, this.params2.getValue())
          .subscribe({
            next: resp => {
              this.loading2 = false;
              this.data2 = resp;
            },
            error: () => {
              this.loading2 = false;
            },
          });
      });
    }
  }

  private cleanData() {
    this.data1 = {} as IListResponse<IDonationGoodRequest>;
    this.data2 = {} as IListResponse<IDonationPropolsal>;
    this.form.get('warehouse').patchValue(null);
    this.form.get('warehouseDesc').patchValue(null);
    this.form.get('doneeId').patchValue(null);
    this.form.get('donee').patchValue(null);
    this.form.get('done').patchValue(null);
    this.form.get('delegationNumber').patchValue(null);
    this.form.get('delegationDesc').patchValue(null);
  }

  settingsChange($event: any, op: number): void {
    if (op == 1) this.settings = $event;
    else this.settings2 = $event;
  }

  exportExcel(params: any) {
    this.massiveGoodService.postExportDataExcel(params).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp exportExcel-> ', resp);
          this.convertBase64ToExcel(resp.base64File, resp.nameFile);
        }
      },
      error => {
        console.log('Error exportExcel->', error);
      }
    );
  }

  convertBase64ToExcel(base64Data: string, filename: string) {
    const binaryString = atob(base64Data);
    const byteArray = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    if ((window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else {
      const excelUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = excelUrl;
      link.target = '_blank';
      link.download = filename;
      link.click();
      link.remove();
      this.alert('success', 'Archivo Descargado Correctamente', '');
    }
  }

  obtenerData(data: any) {
    this.selectData2 = data.data;
    console.log('data tabla 2 -> ', this.selectData2);
  }

  obtenerCoordinacion(id: number) {
    this.coorDesc = null;
    console.log('obtenerCoordinacion', id);
    this.appraiseService.getDelegation(id).subscribe(
      resp => {
        try {
          if (resp != null && resp != undefined) {
            console.log('Resp obtenerCoordinacion-> ', resp);
            this.coorDesc = resp.data[0].descripcion;
            console.log('this.coorDesc-> ', this.coorDesc);
            this.form.get('delegationDesc').patchValue(this.coorDesc);
          }
        } catch {
          this.form.get('delegationDesc').patchValue(null);
        }
      },
      error => {
        console.log('AlertError-> ', error);
      }
    );
  }
}
