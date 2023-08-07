import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-scanning-foil',
  templateUrl: './scanning-foil.component.html',
  styles: [``],
})
export class ScanningFoilComponent
  extends BasePage
  implements OnInit, OnChanges
{
  //Reactive Forms
  form: FormGroup;
  user: ISegUsers;
  document: IDocuments;
  params = new BehaviorSubject<ListParams>(new ListParams());
  generateFo: boolean = true;
  @Input() numberFoli: string | number = '';
  @Input() cveScreen: string | number = '';
  @Input() reportPrint: string = '';
  @Input() refresh: boolean = false;
  @Input() good: IGood;
  @Output() documentEmmit = new EventEmitter<IDocuments>();
  @Output() change = new EventEmitter<any>();

  loadingText = 'Cargando ...';
  get scanningFoli() {
    return this.form.get('scanningFoli');
  }
  constructor(
    private fb: FormBuilder,
    private readonly documnetServices: DocumentsService,
    private token: AuthService,
    private readonly userServices: UsersService,
    private readonly goodServices: GoodService,
    private readonly router: Router,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.numberFoli);

    this.buildForm();
    this.scanningFoli.setValue(this.numberFoli);
    this.form.disable();
    this.getDataUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      console.log(this.good);
      if (this.refresh) {
        console.log('REFRESHHHH....');
        this.scanningFoli.setValue('');
        /* this.document = undefined;
        this.good = undefined; */
      }
    }
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      scanningFoli: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  generateFoli() {
    console.log(
      this.scanningFoli.value != null,
      this.good,
      this.scanningFoli.value
    );
    if (this.good === null || this.good === undefined) {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'Debe cargar un Bien',
        ''
      );
      return;
    }
    if (this.document !== undefined) {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'El número de Bien para este proceso ya tiene folio de escaneo.'
      );
      return;
    }
    const documents: IDocuments = {
      numberProceedings: this.good.fileNumber,
      keySeparator: '60',
      keyTypeDocument: 'ENTRE',
      natureDocument: 'ORIGINAL',
      descriptionDocument: 'REGULARIZACION JURIDICA',
      significantDate: this.significantDate(),
      scanStatus: 'SOLICITADO',
      userRequestsScan: this.user.usuario.user,
      scanRequestDate: new Date(),
      associateUniversalFolio: null,
      flyerNumber: Number(this.good.flyerNumber),
      goodNumber: Number(this.good.id),
      numberDelegationRequested: this.user.usuario.delegationNumber,
      numberDepartmentRequest: this.user.usuario.departamentNumber,
      numberSubdelegationRequests: this.user.usuario.subdelegationNumber,
    };
    console.log(documents);
    this.documnetServices.create(documents).subscribe({
      next: response => {
        this.document = response;
        console.log(response);
        this.scanningFoli.setValue(response.id);
        this.documentEmmit.emit(response);
        /* this.onLoadToast(
          'success',
          'Generado correctamente',
          `Se generó el Folio No ${response.id}`
        ); */
        this.generateFo = false;
        const params = {
          pn_folio: this.form.get('scanningFoli').value,
        };
        this.downloadReport(this.reportPrint, params);
      },
      error: err => {
        console.error(err);
        this.alert('error', 'Ha ocurrido un error', err.error.message);
      },
    });
  }
  significantDate() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return month < 10 ? `0${month}/${year}` : `${month}/${year}`;
  }
  generate() {
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
  }
  getDataUser() {
    const params: ListParams = {
      'filter.id': this.token.decodeToken().preferred_username,
    };
    console.log(params);

    this.userServices.getAllSegUsers(params).subscribe({
      next: response => {
        console.log(response);
        this.user = response.data[0];
      },
      error: err => {
        console.log(err);
      },
    });
  }
  validFoli() {
    console.log('Entro');
    if (this.good !== undefined) {
      this.documnetServices.getByGood(this.good.id).subscribe({
        next: response => {
          if (response.count === 0) return;
          console.log(response);
          this.document = response.data[0];
          this.scanningFoli.setValue(this.document.id);
          this.documentEmmit.emit(this.document);
        },
      });
    }
  }
  scan() {
    if (this.good === undefined) {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'No existe folio de escaneo',
        ''
      );
      return;
    }
    console.log(this.form.get('scanningFoli').value);
    if (this.form.get('scanningFoli').value !== '') {
      this.alertQuestion(
        'question',
        'Se abrirá la pantalla de escaneo para el folio de escaneo del Bien consultado',
        '¿Deseas continuar?',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          this.goToScan();
        }
      });
    } else {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'No existe folio de escaneo',
        ''
      );
    }
  }
  goToScan() {
    this.change.emit('Se hizo el change');
    if (this.document !== undefined) {
      this.change.emit('Se hizo el change');
      localStorage.setItem('documentLegal', JSON.stringify(this.document));
    }
    console.log(this.cveScreen);
    this.router.navigate([`/pages/general-processes/scan-documents`], {
      queryParams: {
        origin: this.cveScreen,
        folio: this.form.get('scanningFoli').value,
      },
    });
  }
  seeImages() {
    if (this.good === undefined) {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'No existe folio de escaneo',
        ''
      );
      return;
    }
    if (this.document !== undefined) {
      this.change.emit('Se hizo el change');
      localStorage.setItem('documentLegal', JSON.stringify(this.document));
    }
    if (this.form.get('scanningFoli').value !== '') {
      this.documnetServices
        .getByFolio(this.form.get('scanningFoli').value)
        .subscribe(res => {
          const data = JSON.parse(JSON.stringify(res));
          const scanStatus = data.data[0]['scanStatus'];
          const idMedium = data.data[0]['mediumId'];

          if (scanStatus === 'ESCANEADO') {
            this.goToScan();
          } else {
            this.alert(
              'warning',
              'Regularización Jurídica',
              'No existe documentación para este folio',
              ''
            );
          }
        });
    } else {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'No tiene folio de escaneo para visualizar.',
        ''
      );
    }
  }

  printScanFile() {
    if (this.good === undefined) {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'No existe folio de escaneo',
        ''
      );
      return;
    }
    if (this.form.get('scanningFoli').value !== '') {
      const params = {
        pn_folio: this.form.get('scanningFoli').value,
      };
      this.downloadReport(this.reportPrint, params);
    } else {
      this.alert(
        'warning',
        'Regularización Jurídica',
        'No existe folio de escaneo',
        ''
      );
    }
  }

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
}
