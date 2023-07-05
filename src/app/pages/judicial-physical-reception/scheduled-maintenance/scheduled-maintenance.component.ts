import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { FileSaverService } from 'src/app/common/services/file-saver.service';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { MsIndicatorGoodsService } from 'src/app/core/services/ms-indicator-goods/ms-indicator-goods.service';
import { ProceedingsExcelService } from 'src/app/core/services/ms-proceedings/proceeding-excel.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-detail-delivery-reception.service';
import { ScheduledMaintenance } from './scheduled-maintenance';

@Component({
  selector: 'app-scheduled-maintenance',
  templateUrl: './scheduled-maintenance.component.html',
  styleUrls: [
    '../scheduled-maintenance-1/scheduled-maintenance.scss',
    './scheduled-maintenance.component.scss',
  ],
})
export class ScheduledMaintenanceComponent
  extends ScheduledMaintenance
  implements OnInit
{
  // showTable1 = true;
  loadingExcel = false;
  flagDownload = false;
  paramsIndicators = new BehaviorSubject<ListParams>(new ListParams());
  path: string;

  // data2: any[] = [];
  constructor(
    protected override fb: FormBuilder,
    protected override deliveryService: ProceedingsDeliveryReceptionService,
    protected override detailService: ProceedingsDetailDeliveryReceptionService,
    private serviceIndicator: MsIndicatorGoodsService,
    private excelService: ProceedingsExcelService,
    private router: Router,
    private fileSaverService: FileSaverService
  ) {
    super(
      fb,
      deliveryService,
      detailService,
      'filtersIndica',
      'paramsActaRecepciones'
    );
    // this.settings1 = {
    //   ...this.settings1,
    //   actions: null,
    // };
    this.settings1 = {
      ...this.settings1,
      actions: {
        columnTitle: 'Acciones',
        position: 'left',
        add: false,
        edit: true,
        delete: true,
      },
      add: {
        ...this.settings1.add,
        addButtonContent: 'Capturar',
      },
    };
    // this.tiposEvento = [
    //   {
    //     id: 'EVENTREC',
    //     description: 'RECEPCIÓN FÍSICA',
    //   },
    // ];
    // this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
    //   next: response => {
    //     console.log(response);

    //     this.getData(true);
    //   },
    // });
  }

  updateCoord(event: any) {
    console.log(event);
  }

  captureEvent() {
    console.log(this.form.value);
    if (!this.form.get('tipoEvento').value) {
      this.alert(
        'error',
        'Captura de Evento',
        'No se ha especificado el Tipo de Evento'
      );
    }
    this.router.navigate(
      [
        'pages/final-destination-process/delivery-schedule/schedule-of-events/capture-event',
      ],
      { queryParams: { tipoEvento: this.form.value.tipoEvento } }
    );
    // if(this.form.get('tipoEvento').value === 'EVENTREC'){

    // }
  }

  get typeEvents1() {
    return this.typeEvents
      ? window.location.href.includes('judicial-physical-reception')
        ? this.typeEvents.filter(x => !x.descripcion.includes('ENTREGA'))
        : this.typeEvents.filter(x => x.area_tramite !== 'RF')
      : [];
  }

  override extraOperations() {
    if (window.location.href.includes('judicial-physical-reception')) {
      this.path =
        'proceeding/api/v1/proceedings-delivery-reception/get-types?filter.id=EVENTREC';
    } else {
      this.path =
        'proceeding/api/v1/proceedings-delivery-reception/get-types?filter.description=ENTREGA';
    }
    // this.path = 'proceeding/api/v1/proceedings-delivery-reception/get-types?filter.id=$not:$eq:EVENTREC'
  }

  deleteRow(item: IProceedingDeliveryReception) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.deliveryService.deleteById(item).subscribe({
          next: response => {
            console.log(response);
            this.getData();
            this.alert(
              'success',
              'Eliminación',
              `Se elimino el acta No. ${item.id}`
            );
          },
          error: err => {
            console.log(err);
            let message = `No se pudo eliminar`;
            if (err.error.message.includes('detalle_acta_ent_recep')) {
              message = message + ` porque tiene detalles de acta`;
            }
            this.alert('error', `Acta No. ${item.id}`, message);
          },
        });
      }
    });
  }

  rowsSelected(event: IProceedingDeliveryReception) {
    console.log(event);
    if (event.id) {
      this.router.navigate(
        [
          'pages/final-destination-process/delivery-schedule/schedule-of-events/capture-event',
        ],
        {
          queryParams: {
            tipoEvento: event.typeProceedings,
            numeroActa: event.id,
          },
        }
      );
      // this.showTable1 = false;
      // this.loading = true;
      // let params = this.paramsIndicators.value;
      // params['id'] = event.id;
      // this.serviceIndicator
      //   .getGoodsByProceeding(params)
      //   .pipe(takeUntil(this.$unSubscribe))
      //   .subscribe({
      //     next: response => {
      //       this.data2 = response.data;
      //       this.totalItemsIndicators = response.count;
      //       this.loading = false;
      //     },
      //     error: err => {
      //       this.data2 = [];
      //       this.totalItemsIndicators = 0;
      //       this.loading = false;
      //     },
      //   });
    }
  }

  public base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  public downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    console.log(this.form.value);
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('pdf', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    this.alert('success', 'Reporte Excel', 'Descarga Finalizada');
    URL.revokeObjectURL(objURL);
  }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  async exportExcel2() {
    this.loadingExcel = true;

    this.alert(
      'info',
      'Reporte de Mantenimiento de Programaciones',
      'Consiguiendo datos'
    );
    const v = this.form.getRawValue();
    const body = {
      statusProceedings: v.statusEvento,
      typeProceedings: v.tipoEvento,
      elaborate: v.usuario,
      captureDate: v.rangeDate
        ?.map((f: Date) => format(f, 'yyyy-MM-dd'))
        .join(','),
      description: v.coordRegional?.map((e: any) => `'${e}'`).join(','),
    };
    console.log(body);
    try {
      const resp = await firstValueFrom(this.excelService.getExcel(body));
      console.log(resp);
      this.downloadDocument('Programación de Recepciones', 'excel', resp.file);
      this.loadingExcel = false;
    } catch (error) {
      this.loadingExcel = false;
      this.alert('error', 'Error', `Error al obtener el documento `);
    }
  }

  async exportExcel() {
    // const data = <IProceedingDeliveryReception[]>this.table.source.data;
    // this.elementToExport = data.map(item => {
    //   return {
    //     CVE_ACTA: item.keysProceedings,
    //     LOC_TRANSF:item.address,

    //   };
    // })
    this.loadingExcel = true;
    this.elementToExport = null;
    this.alert(
      'info',
      'Reporte de Mantenimiento de Programaciones',
      'Consiguiendo datos'
    );
    // debugger;
    const data = await this.data.getAll();
    try {
      const array = await firstValueFrom(this.deliveryService.getExcel2(data));
      if (array.length > 0) {
        this.elementToExport = array;
        this.flagDownload = !this.flagDownload;
        console.log(this.elementToExport);
      }
      this.loadingExcel = false;
    } catch (x) {
      this.alert(
        'error',
        'Reporte de Mantenimiento de Programaciones',
        'Error en obtención de datos'
      );
      this.loadingExcel = false;
    }

    // this.service.getExcel(this.filterParams).subscribe(x => {
    //   this.elementToExport = x;
    //   this.flagDownload = !this.flagDownload;
    //   console.log(x);
    //   this.loadingExcel = false;
    //   setTimeout(() => {
    //     this._toastrService.clear();
    //   }, 1000);
    // });
    // console.log(this.table);
  }
}
