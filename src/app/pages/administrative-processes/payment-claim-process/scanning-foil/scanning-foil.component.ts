import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-scanning-foil',
  templateUrl: './scanning-foil.component.html',
  styles: [``],
})
export class ScanningFoilComponent extends BasePage implements OnInit {
  //Reactive Forms
  form: FormGroup;
  user: ISegUsers;
  document: IDocuments;
  params = new BehaviorSubject<ListParams>(new ListParams());
  generateFo: boolean = true;
  @Input() numberFoli: string | number = '';
  @Input() goods: IGood[] = [];
  @Output() documentEmmit = new EventEmitter<IDocuments>();
  @Output() firstGood = new EventEmitter<IGood>();
  // get scanningFoli() {
  //   return this.form.get('scanningFoli');
  // }
  @Input() emitirFolio: string;
  @Input() cambiarFolioUniversal: Function;

  folioEscaneoNg: any = '';
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  constructor(
    private fb: FormBuilder,
    private readonly documnetServices: DocumentsService,
    private token: AuthService,
    private readonly userServices: UsersService,
    private readonly goodServices: GoodService,
    private router: Router,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('emitirFolio', this.emitirFolio);
    this.buildForm();
    // this.form.get('scanningFoli').setValue(this.numberFoli);
    this.form.disable();
    this.getDataUser();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      scanningFoli: [
        this.folioEscaneoNg,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
  }
  generateFoli() {
    this.goods.forEach((good, index) => {
      if (index !== 0) {
        const documents: IDocuments = {
          numberProceedings: good.fileNumber,
          keySeparator: 60,
          keyTypeDocument: 'ENTRE',
          natureDocument: 'ORIGINAL',
          descriptionDocument: 'PROCESO DE RECLAMACIÓN DE PAGO',
          significantDate: this.significantDate(),
          scanStatus: 'ESCANEADO',
          userRequestsScan: this.user.usuario.user,
          scanRequestDate: new Date(),
          associateUniversalFolio: this.document.id,
          flyerNumber: good.flyerNumber,
          goodNumber: good.id,
          numberDelegationRequested: this.user.usuario.delegationNumber,
          numberDepartmentRequest: this.user.usuario.departamentNumber,
          numberSubdelegationRequests: this.user.usuario.subdelegationNumber,
        };
        this.documnetServices.create(documents).subscribe({
          next: response => {
            console.log(response);
          },
          error: err => {
            console.log(err);
            this.onLoadToast('error', 'ERROR', err.error.message);
          },
        });
      }
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

  question() {
    console.log('this.folioEscaneoNg', this.folioEscaneoNg);
    if (this.folioEscaneoNg != '') {
      this.onLoadToast(
        'warning',
        'El folio de escaneo ya ha sido generado.',
        ''
      );
      return;
    }
    if (this.goods.length === 0) {
      this.onLoadToast('warning', 'Debe cargar al menos un Bien', '');
      return;
    }
    this.alertQuestion(
      'info',
      'Se generará un folio de escaneo para los bienes',
      '¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.document1(this.goods[0]);
      }
    });
  }

  document1(good: IGood) {
    this.firstGood.emit(good);
    const documents: IDocuments = {
      numberProceedings: good.fileNumber,
      keySeparator: 60,
      keyTypeDocument: 'ENTRE',
      natureDocument: 'ORIGINAL',
      descriptionDocument: 'PROCESO DE RECLAMACIÓN DE PAGO',
      significantDate: this.significantDate(),
      scanStatus: 'SOLICITADO',
      userRequestsScan: this.user.usuario.user,
      scanRequestDate: new Date(),
      associateUniversalFolio: null,
      flyerNumber: good.flyerNumber,
      goodNumber: good.id,
      numberDelegationRequested: this.user.usuario.delegationNumber,
      numberDepartmentRequest: this.user.usuario.departamentNumber,
      numberSubdelegationRequests: this.user.usuario.subdelegationNumber,
    };
    this.documnetServices.create(documents).subscribe({
      next: response => {
        console.log(response);
        this.folioEscaneoNg = response.id;
        this.documentEmmit.emit(response);
        this.document = response;
        this.alert(
          'success',
          `Folio de escaneo generado correctamente`,
          `Nro. ${response.id}`
        );
        this.generateFo = false;
        // this.generate();
        this.generateFoli();
      },
      error: err => {
        console.log(err);
        this.onLoadToast('error', 'ERROR', err.error.message);
      },
    });
  }
  toNextForm() {
    this.goNextForm();
  }
  goNextForm() {
    // localStorage.setItem('goodData', this.goods);

    this.router.navigate([`/pages/general-processes/scan-documents`], {
      queryParams: { origin: 'FPROCRECPAG', folio: this.folioEscaneoNg },
    });
  }

  imprimirFolioEscaneo() {
    // if (this.dictamen) {
    if (this.folioEscaneoNg.folioUniversal == '') {
      this.alert('warning', 'No tiene folio de escaneo para imprimir.', '');
      return;
    } else {
      let params = {
        pn_folio: this.folioEscaneoNg,
      };
      this.siabService
        .fetchReport('RGERGENSOLICDIGIT', params)
        .subscribe(response => {
          if (response !== null) {
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
            this.onLoadToast('success', '', 'Reporte generado');
            this.modalService.show(PreviewDocumentsComponent, config);
          }
        });
    }
  }

  visualizacionFolioEscaneo() {
    if (this.folioEscaneoNg == '') {
      this.alert('warning', 'No tiene folio de escaneo para visualizar.', '');
      return;
    } else {
      this.goNextForm();
    }
  }
  actualizarVariable(val: boolean, folioEscaneoNg: string) {
    this.folioEscaneoNg = folioEscaneoNg;
    this.generateFo = val;
  }

  getDocument(good: any) {
    this.firstGood.emit(good);
    console.log('good', good);
    this.filter1.getValue().removeAllFilters();
    this.filter1.getValue().addFilter('goodNumber', good.id, SearchFilter.EQ);
    // this.filter1.getValue().addFilter('scanStatus', 'ESCANEADO', SearchFilter.EQ)
    this.documnetServices
      .getAllFilter(this.filter1.getValue().getParams())
      .subscribe({
        next: response => {
          console.log('DOCUMENT', response);
          this.folioEscaneoNg = response.data[0].id;
          this.documentEmmit.emit(response.data[0]);
          this.document = response.data[0];
          this.generateFo = false;
          // this.generate();
        },
        error: err => {
          console.log(err);
          this.folioEscaneoNg = '';
        },
      });
  }
}
