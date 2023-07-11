import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as FileSaver from 'file-saver';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SeraLogService } from 'src/app/core/services/ms-audit/sera-log.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ButtonColumnComponent } from 'src/app/shared/components/button-column/button-column.component';
import { ClaimsFollowUpDetailComponent } from '../claims-follow-up-detail/claims-follow-up-detail.component';

@Component({
  selector: 'app-claims-follow-up',
  templateUrl: './claims-follow-up.component.html',
  styles: [],
})
export class ClaimsFollowUpComponent extends BasePage implements OnInit {
  claimsFollowUpForm: FormGroup;
  dateDelAlForm: FormGroup;
  lawyers: any[] = [];
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  newSiniester: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private seraLogService: SeraLogService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: false,
        position: 'right',
      },
      columns: {
        officialConclusion: {
          title: 'Ver Oficio Conclusión',
          type: 'custom',
          sort: false,
          renderComponent: ButtonColumnComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              console.log(row);
              this.seeOfficialConclusion(row);
            });
          },
        },
        officeMail: {
          title: 'Ver Oficio Correo',
          type: 'custom',
          sort: false,
          renderComponent: ButtonColumnComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              console.log(row);
              this.seeOfficeMail(row);
            });
          },
        },
        seeClaimLetter: {
          title: 'Ver Carta Reclamación',
          type: 'custom',
          sort: false,
          renderComponent: ButtonColumnComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              console.log(row);
              this.seeClaimLetter(row);
            });
          },
        },

        idsiniestro: {
          title: 'Id Siniestro',
          type: 'number',
          sort: false,
        },
        nobien: {
          title: 'No. Bien',
          type: 'number',
          sort: false,
        },
        siniestro: {
          title: 'Siniestro',
          type: 'string',
          sort: false,
        },
        polizaafectada: {
          title: 'Poliza Afectada',
          type: 'string',
          sort: false,
        },
        tiposiniestro: {
          title: 'Tipo Siniestro',
          type: 'string',
          sort: false,
        },
        detallebienoafectadas: {
          title: 'Det. Bien o Afectadas',
          type: 'string',
          sort: false,
        },
        fechasiniestro: {
          title: 'Fecha Siniestro',
          type: 'string',
          sort: false,
        },
        fechareporteaseguradora: {
          title: 'Fec. Rep. Aseguradora',
          type: 'string',
          sort: false,
        },
        fechareportecabi: {
          title: 'Fec. Rep. Cabi',
          type: 'string',
          sort: false,
        },
        unidadadminusuaria: {
          title: 'Unidad Admin Usuario',
          type: 'string',
          sort: false,
        },
        montoreclamado: {
          title: 'Monto Reclamado',
          sort: false,
        },
        montoajustado: {
          title: 'Monto Ajustado',
          type: 'string',
          sort: false,
        },
        deducible: {
          title: 'Deducible',
          type: 'string',
          sort: false,
        },
        coaseguro: {
          title: 'Coas Seguro',
          type: 'string',
          sort: false,
        },
        montoindemnizado: {
          title: 'Monto Indemnización',
          type: 'string',
          sort: false,
        },
        formaconclusion: {
          title: 'Forma Conclusión',
          type: 'string',
          sort: false,
        },
        cartareclamacion: {
          title: 'Carta Reclamación',
          type: 'string',
          sort: false,
        },
        ordendeingreso: {
          title: 'Orden de Ingreso',
          type: 'string',
          sort: false,
        },
        primersegundacapa: {
          title: 'Primer Segunda Capa',
          type: 'string',
          sort: false,
        },
        estatus: {
          title: 'Estatus',
          type: 'string',
          sort: false,
        },

        // officialDocumentConclusion: {
        //   title: 'Doc.Oficio minuta conclusion',
        //   type: 'string',
        //   sort: false,
        // },

        // docClaimLetter: {
        //   title: 'Doc.Carta reclamación',
        //   type: 'string',
        //   sort: false,
        // },
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.claimsFollowUpForm = this.fb.group({
      numberGood: [null, Validators.required],
      description: [null],
    });
    this.dateDelAlForm = this.fb.group({
      del: [null, [Validators.required]],
      al: [null, [Validators.required]],
    });
  }
  add() {
    this.openForm();
  }
  validGood() {
    this.claimsFollowUpForm.markAllAsTouched();
    this.claimsFollowUpForm.controls['description'].setValue('');

    let data = {
      pGoodNumber: this.claimsFollowUpForm.controls['numberGood'].value,
      pOperation: 1,
    };
    this.seraLogService.postObtnGoodSinister(data).subscribe({
      next: data => {
        if (data) {
          this.claimsFollowUpForm.controls['description'].setValue(
            data.data[0].descripcion
          );
          this.newSiniester = true;
          this.queryClaims();
        } else {
          this.claimsFollowUpForm.controls['description'].setValue('');
          this.alert(
            'warning',
            'No se encontró el número de bien buscado.',
            ''
          );
        }
      },
      error: error => (this.loading = false),
    });
  }
  queryClaims() {
    this.loading = true;
    let data = {
      pGoodNumber: this.claimsFollowUpForm.controls['numberGood'].value,
      pOperation: 2,
    };
    this.seraLogService.postObtnGoodSinister(data).subscribe({
      next: data => {
        //INSERTAR DATA PARA TABLA
        console.log(data);
        this.lawyers = data.data;
        this.totalItems = data.count | 0;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  openForm(siniester?: any) {
    let good = {
      numberInGood: this.claimsFollowUpForm.controls['numberGood'].value,
      description: this.claimsFollowUpForm.controls['description'].value,
    };
    let config: ModalOptions = {
      initialState: {
        siniester,
        good,
        callback: (next: boolean) => {
          if (next) {
            this.queryClaims();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ClaimsFollowUpDetailComponent, config);
  }
  edit(siniester: any) {
    this.openForm(siniester);
  }

  delete(bank: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
  seeOfficialConclusion(data: any) {
    if (data.docoficiominutaconclusion) {
      const columnas = Object.keys(data);
      let colum = '';
      columnas.forEach(element => {
        if (element === 'docoficiominutaconclusion') {
          colum = 'docOfficeMinConcluIn';
        }
      });
      let res = {
        sinisterInId: data.idsiniestro,
        numberInGood: data.nobien,
        colum: colum,
      };
      this.vewReport(res);
    } else {
      this.alert(
        'warning',
        'Siniestros Seguimiento',
        'No se encontro documento oficio conclusión.'
      );
    }
  }
  seeOfficeMail(data: any) {
    if (data.docoficiocorreo) {
      const columnas = Object.keys(data);
      let colum = '';
      columnas.forEach(element => {
        if (element === 'docoficiocorreo') {
          colum = 'docOfficeMailIn';
        }
      });
      let res = {
        sinisterInId: data.idsiniestro,
        numberInGood: data.nobien,
        colum: colum,
      };
      this.vewReport(res);
    } else {
      this.alert(
        'warning',
        'Siniestros Seguimiento',
        'No se encontro documento oficio correo.'
      );
    }
  }
  seeClaimLetter(data: any) {
    if (data.doccartareclamacion) {
      const columnas = Object.keys(data);
      let colum = '';
      columnas.forEach(element => {
        if (element === 'doccartareclamacion') {
          colum = 'docLetterRelcamationIn';
        }
      });
      let res = {
        sinisterInId: data.idsiniestro,
        numberInGood: data.nobien,
        colum: colum,
      };
      this.vewReport(res);
    } else {
      this.alert(
        'warning',
        'Siniestros Seguimiento',
        'No se encontro documento oficio reclamación.'
      );
    }
  }
  vewReport(res: any) {
    this.seraLogService.postSinisterRecordFile(res).subscribe(
      response => {
        if (response !== null) {
          const url = `data:application/pdf;base64,${response}`;
          console.log();
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
        }
      },
      error => {
        this.alert(
          'warning',
          'Siniestros Seguimiento',
          'El documento no existe.'
        );
      }
    );
  }
  exportDelAl() {
    if (this.claimsFollowUpForm.controls['numberGood'].value) {
      let data = {
        initDate: this.convertDate(this.dateDelAlForm.controls['del'].value),
        endDate: this.convertDate(this.dateDelAlForm.controls['del'].value),
      };
      this.seraLogService.postDateExport(data).subscribe(
        response => {
          console.log(response);
          this.convertAndDownloadExcel(
            response,
            `SINIESTROS SEGUIMIENTO ${this.claimsFollowUpForm.controls['numberGood'].value}`
          );
          this.alert(
            'success',
            'Siniestros Seguimiento',
            'Se genero el archivo excel'
          );
        },
        error => {
          this.alert(
            'warning',
            'Siniestros Seguimiento',
            'Error al generar el archivo excel.'
          );
        }
      );
    } else {
      this.alert('warning', 'Siniestros Seguimiento', 'Debe validar un Bien.');
    }
  }
  export() {
    let data = {
      pGoodNumber: this.claimsFollowUpForm.controls['numberGood'].value,
      pOperation: 2,
    };
    this.seraLogService.postExport(data).subscribe(
      response => {
        console.log(response);
        this.convertAndDownloadExcel(
          response,
          `SINIESTROS SEGUIMIENTO ${this.claimsFollowUpForm.controls['numberGood'].value}`
        );
        this.alert(
          'success',
          'Siniestros Seguimiento',
          'Se genero el archivo excel'
        );
      },
      error => {
        this.alert(
          'warning',
          'Siniestros Seguimiento',
          'Error al generar el archivo excel.'
        );
      }
    );
  }
  convertDate(date: Date): string {
    const dateString: string = this.datePipe.transform(date, 'yyyy-MM-dd');
    return dateString;
  }
  convertAndDownloadExcel(base64String: string, nombreArchivo: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'application/vnd.ms-excel' });

    FileSaver(blob, nombreArchivo);
  }
}
