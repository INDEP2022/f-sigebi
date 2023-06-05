import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { format } from 'date-fns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PreviewDocumentsComponent } from '../../preview-documents/preview-documents.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan-file-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './scan-file-shared.component.html',
})
export class ScanFileSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() formControlName: string = 'folioEscaneo';
  @Input() cveDocument: string;
  @Input() noExpedient: string | number;
  @Input() statusProceeding: string
  @Input() cveScreen: string

  @Output() emitfileNumber = new EventEmitter();

  get numberFile() {
    return this.form.get(this.formControlName);
  }

  fileNumber: number;

  //REPORTES
  loadingText = 'Cargando ...';
  

  constructor(
    private serviceDocuments: DocumentsService,
    private serviceNotification: NotificationService,
    private serviceUser: UsersService,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.form.get(this.formControlName).valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  prepareForm() {}

  replicateFolio() {}

  //GENERAR FOLIO DE ESCANEO
  generateFolio() {
    let wheelNumber: string | number;

    const route = `notification?filter.wheelNumber=$not:$null&filter.expedientNumber=$eq:${this.noExpedient}&sortBy=wheelNumber:DESC`;
    this.serviceNotification.getAllFilter(route).subscribe(
      res => {
        wheelNumber = res.data[0]['wheelNumber'];
        const user =
          localStorage.getItem('username') == 'sigebiadmon'
            ? localStorage.getItem('username')
            : localStorage.getItem('username').toLocaleUpperCase();
        const routeUser = `?filter.name=$eq:${user}`;
        this.serviceUser.getAllSegUsers(routeUser).subscribe(
          res => {
            console.log(res);
            const resJson = JSON.parse(JSON.stringify(res.data[0]));
            console.log(resJson);
            const modelDocument: IDocuments = {
              id: 0,
              natureDocument: 'ORIGINAL',
              descriptionDocument: `ACTA ${this.cveDocument}`,
              significantDate: format(new Date(), 'MM/yyyy'),
              scanStatus: 'SOLICITADO',
              fileStatus: '',
              userRequestsScan: user,
              scanRequestDate: new Date(),
              userRegistersScan: '',
              dateRegistrationScan: undefined,
              userReceivesFile: '',
              dateReceivesFile: undefined,
              keyTypeDocument: 'ENTRE',
              keySeparator: '60',
              numberProceedings: this.noExpedient,
              sheets: '',
              numberDelegationRequested: resJson.usuario.delegationNumber,
              numberSubdelegationRequests: resJson.usuario.subdelegationNumber,
              numberDepartmentRequest: resJson.usuario.departamentNumber,
              registrationNumber: 0,
              flyerNumber: wheelNumber,
              userSend: '',
              areaSends: '',
              sendDate: undefined,
              sendFilekey: '',
              userResponsibleFile: '',
              mediumId: '',
              associateUniversalFolio: 0,
              dateRegistrationScanningHc: undefined,
              dateRequestScanningHc: undefined,
              goodNumber: 0,
            };

            console.log(modelDocument);
            this.serviceDocuments.create(modelDocument).subscribe(
              res => {
                console.log(res.id);
                this.form.get(this.formControlName).setValue(res.id);
                const params = {
                  PARAMSFORM: 'NO',
                  PN_FOLIO: res.id,
                  DESTYPE: 'PREVIEW',
                  PRINTJOB: 'YES',
                };

                this.downloadReport('RGERGENSOLICDIGIT', params);
              },
              err => {
                this.alert('error', 'Se presentó un error inesperado', '');
              }
            );
          },
          err => {
            console.log(err);
            this.alert('error', 'Se presentó un error inesperado', '');
          }
        );
      },
      err => {
        console.log(err);
        this.alert('error', 'Se presentó un error inesperado', '');
      }
    );
  }

  downloadReport(reportName: string, params: any) {
    this.loading = true;
    this.loadingText = 'Generando reporte ...';
    return this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
  }

  //ESCANEAR
  scan(){
    if(!['CERRADO','CERRADA'].includes(this.statusProceeding) && this.statusProceeding != null){
        if(this.form.get(this.formControlName).value != null){
            this.alertQuestion('question','Se abrirá la pantalla de escaneo para el folio de escaneo del acta abierta','¿Deseas continuar?','Continuar').then(q => {
                if(q.isConfirmed){
                    this.goToScan()
                }
            })
        }else{
            this.alert('warning','No existe folio de escaneo a escanear','')
        }
    }else{
        this.alert('warning','No se puede escanear para un acta cerrada','')
    }
  }

  goToScan(){
    localStorage.setItem('numberExpedient', this.noExpedient.toString());

    this.router.navigate([`/pages/general-processes/scan-documents`], {
        queryParams: { origin: this.cveScreen, folio: this.form.get(this.formControlName) },
      });
  }

  //IMPRIMIR
  printScanFile(){
    if(this.form.get(this.formControlName).value != null){
        const params = {
            PARAMSFORM: 'NO',
            PN_FOLIO: this.form.get(this.formControlName).value,
            DESTYPE: 'PREVIEW',
            PRINTJOB: 'YES',
          };
          this.downloadReport('RGERGENSOLICDIGIT', params);
    }else{
        this.alert('warning', 'No tiene folio de escaneo para imprimir.', '');
    }
  }

  //CONSULTA DE IMAGENES
  seeImages(){
    if(this.form.get(this.formControlName).value != null){
        this.serviceDocuments.getByFolio(this.form.get(this.formControlName).value).subscribe(
            res => {
                const data = JSON.parse(JSON.stringify(res));
                const scanStatus = data.data[0]['scanStatus']
                const idMedium = data.data[0]['mediumId']

                if(scanStatus === 'ESCANEADO'){
                    if([-1,-2].includes(idMedium)){

                    }else{

                    }
                }else{
                    this.alert('warning','No existe documentación para este folio','')
                }
            }
        )
    }else{
      this.alert('warning', 'No tiene folio de escaneo para visualizar.', '');
    }
  }

  visualizeImages(idMedium:any){
    
  }
}
