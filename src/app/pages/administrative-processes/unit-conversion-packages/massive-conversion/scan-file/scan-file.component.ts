import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { IPackage } from 'src/app/core/models/catalogs/package.model';
import { IGenerateFolioMassConv } from 'src/app/core/models/ms-documents/documents';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { PackageGoodService } from 'src/app/core/services/ms-packagegood/package-good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-scan-file-massive-conversion',
  templateUrl: './scan-file.component.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  styleUrls: [],
})
export class ScanFileComponent extends BasePage implements OnInit {
  //Inputs
  @Input() form: FormGroup;
  @Input() formControlName: string = 'folioEscaneo';
  @Input() package: any;
  //Variables locales
  delUser: number;
  subDelUser: number;
  departmentUser: number;
  user =
    localStorage.getItem('username') == 'sigebiadmon'
      ? localStorage.getItem('username')
      : localStorage.getItem('username').toLocaleUpperCase();
  //REPORTES
  loadingText = 'Cargando ...';

  ngOnInit(): void {
    this.getDataUser();
  }

  constructor(
    private serviceDocuments: DocumentsService,
    private serviceNotification: NotificationService,
    private serviceUser: UsersService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private serviceParameterG: ParametersService,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private packageGoodService: PackageGoodService,
    private modalService: BsModalService
  ) {
    super();
  }

  //DATA DE USUARIO
  getDataUser() {
    const routeUser = `?filter.name=$eq:${this.user}`;
    this.serviceUser.getAllSegUsers(routeUser).subscribe(res => {
      const resJson = JSON.parse(JSON.stringify(res.data[0]));
      this.delUser = resJson.usuario.delegationNumber;
      this.subDelUser = resJson.usuario.subdelegationNumber;
      this.departmentUser = resJson.usuario.departamentNumber;
    });
  }

  //GENERAR FOLIO DE ESCANEO
  downloadReport(reportName: string, params: any) {
    this.loadingText = 'Generando reporte ...';
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        this.loading = false;
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

  generateFolio() {
    this.loading = true;
    console.log(this.package);
    console.log(this.package.statuspack);
    console.log(this.package.cvePackage);
    if (this.package.statuspack != 'A' && this.package.cvePackage != null) {
      if (this.form.get(this.formControlName).value != null) {
        this.alert('warning', 'El paquete ya tiene folio de escaneo', '');
      } else {
        this.alertQuestion(
          'question',
          'Se generará un nuevo folio de escaneo para el paquete autorizado',
          '¿Desea continuar?'
        ).then(q => {
          if (q.isConfirmed) {
            const model: IGenerateFolioMassConv = {
              cvePackage: this.package.cvePackage,
              typePackage: this.package.typePackage,
              noDelegation: this.delUser,
              noSubdelegation: this.subDelUser,
              toolbarNoDepartament: this.departmentUser,
              user: this.user,
              noPackage: this.package.numberPackage,
            };
            this.serviceDocuments
              .generateFolioMassiveConversion(model)
              .subscribe(
                res => {
                  console.log(res.lnu_folio);
                  this.form.get(this.formControlName).setValue(res.lnu_folio);
                  const modelUpdate: Partial<IPackage> = {
                    InvoiceUniversal: res.lnu_folio,
                  };

                  this.packageGoodService
                    .updatePaqDestinationEnc(
                      this.package.numberPackage,
                      modelUpdate
                    )
                    .subscribe(
                      res => {
                        const param = {
                          pn_folio: res.lnu_folio,
                        };

                        this.downloadReport('RGERGENSOLICDIGIT', param);
                      },
                      err => {
                        console.log(err);
                      }
                    );
                },
                err => {
                  console.log(err);
                  this.loading = false;
                  this.alert('error', 'Se presentó un error inesperado', '');
                }
              );
          }
        });
      }
    } else {
      console.log('No entro');
    }
  }

  //ESCANEAR
  scan() {
    if (this.package.statuspack != 'A' && this.package.cvePackage != null) {
      if (this.form.get(this.formControlName).value != null) {
        this.alertQuestion(
          'question',
          'Se redireccionará a la pantalla de escaneo',
          '¿Deseas continuar?',
          'Continuar'
        ).then(q => {
          if (q.isConfirmed) {
            this.goToScan();
          }
        });
      } else {
        this.alert('warning', 'No existe folio de escaneo', '');
      }
    } else {
      this.alert(
        'warning',
        'No se puede escanear sin estatus de autorización y clave de paquete',
        ''
      );
    }
  }

  goToScan() {
    localStorage.setItem('noPackage', this.package.numberPackage.toString());

    this.router.navigate([`/pages/general-processes/scan-documents`], {
      queryParams: {
        origin: 'FMTOPAQUETE',
        folio: this.form.get(this.formControlName).value,
      },
    });
  }

  //Folio
  printFolio() {
    if (this.form.get(this.formControlName).value != null) {
      const params = {
        pn_folio: this.form.get(this.formControlName).value,
      };
      this.downloadReport('RGERGENSOLICDIGIT', params);
    } else {
      this.alert('warning', 'No tiene folio de escaneo para imprimir.', '');
    }
  }

  //Ver solicitud de escaneo
  viewScan() {
    if (this.form.get(this.formControlName).value != null) {
      this.goToScan();
    } else {
      this.alert('warning', 'No tiene folio de escaneo', '');
    }
  }
}
