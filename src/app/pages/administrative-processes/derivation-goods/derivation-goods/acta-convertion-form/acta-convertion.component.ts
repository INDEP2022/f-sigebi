import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { IZoneGeographic } from 'src/app/core/models/catalogs/zone-geographic.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ConvertiongoodService } from '../../../../../core/services/ms-convertiongood/convertiongood.service';

@Component({
  selector: 'app-acta-convertion-form',
  templateUrl: './acta-convertion-form.component.html',
  styleUrls: ['./acta-convertion.component.scss'],
})
export class ActaConvertionFormComponent extends BasePage implements OnInit {
  delegationForm: ModelForm<IDelegation>;
  expedientNuember: string;
  conversion: any;
  edit: boolean = false;
  flagNewActa: boolean = false;
  flagAsignaActa: boolean = false;
  disableAllChecks: boolean = false;
  delegation: any;
  states = new DefaultSelect<IStateOfRepublic>();
  zones = new DefaultSelect<IZoneGeographic>();
  items: any[] = [];
  selectedItems: any[] = [];

  parrafo1: string = '';
  parrafo2: string = '';
  parrafo3: string = '';
  actConvertion: string = '';
  tipoConv: string;
  pGoodFatherNumber: any;
  numberFoli: any;
  selectedIndex: number | null = null;
  selectItem: string = '';
  selectItem2: string = '';
  user: ISegUsers;
  refresh: boolean = false;
  save: boolean = true;
  insertParaphs: boolean = true;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private serviceGood: GoodService,
    private route: ActivatedRoute,
    private router: Router,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private proceedingsService: ProceedingsService,
    private modalService: BsModalService,
    private convertiongoodService: ConvertiongoodService,
    private readonly userServices: UsersService,
    private token: AuthService
  ) {
    super();
    this.getDataUser();
  }

  ngOnInit(): void {
    //nombre de reporte RGERGENSOLICDIGIT
  }

  insertarParrafos(descTransferente: string) {
    this.parrafo1 = `- - - En la Ciudad de ______________, siendo las _____ horas, del día ____de ________ de 200__, se encuentran presentes en la Bodega ubicada en la calle de ________________________ de esta Ciudad, el C. _____________________ con cargo de ___________________, de la empresa ______________ y el C. ___________________ adscrito a _______________ del Servicio de Administración y Enajenación de Bienes (SAE), Organismo Descentralizado de la Administración Pública Federal; ambos con el fin de llevar a cabo la validación y conversión de bienes muebles transferidos y en administración del SAE - - - - - - - - - - - - - - - - - - - - - - - - -\n
    - - -Intervienen como testigos de asistencia los CC. _______________________, y _____________________, - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - -\n\n
    -------------------------------------------------- A N T E C E D E N T E S ------------------------------------------\n
    - - - l. Los bienes muebles fueron transferidos al SAE por [_____________________________], con fundamento en los artículos 3 de la LFAEBSP, 12 y 13 del Reglamento de la ley en comento. - -\n
    - - - II.- Los bienes muebles sujetos a validación y conversión de unidades de medida, se encuentran en administración del SAE y bajo la custodia de _(precisar MYMLAND, CR o DEBM)____________ los cuales se incorporan a este procedimiento a efecto de facilitar la ejecución de su destino.- - - - - - - - - - - -\n\n
    ----------------------------------------------------- DECLARACIONES ---------------------------------------------\n
    - - - PRIMERA.- El C. _________________ manifiesta que los bienes muebles que fueron transferidos al SAE se encuentran bajo su custodia y que con el fin de dar cumplimento al destino final de precisar destino -venta-donación o destrucción-  sugerido por la Entidad ${
      descTransferente != null ? descTransferente : ''
    }, se sujetarán a un procedimiento de validación y conversión de unidades de medida toda vez que fueron puestos a disposición con un tipo de unidad diferente al requerido para el destino previsto.\n\n
    - - - SEGUNDA.- Que para realizar el proceso de validación se verifican las cantidades físicas contra las cantidades señaladas en los documentos oficiales y registros SIAB para posteriormente determinar el valor de conversión de los bienes muebles siguientes:- - - - - - - - - - - - - - - - -`;

    this.parrafo2 = `- - - TERCERA.- Una vez validada la existencia física en las cantidades y características señaladas en los documentos de recepción de los bienes muebles descritos en la declaratoria anterior, se determinó que su valor de conversión corresponde a:`;

    this.parrafo3 = `- - - CUARTA.- Los  valores de conversión determinados en la Cláusula Tercera son una referencia para ejecutar el destino de [ precisar destino -venta-donación o destrucción__] de los bienes muebles, por lo que cada registro SIAB conserva el número de expediente y de bien, así como los atributos de referencia recibidos del transferente - - - - - - - - - - -  -- - - - - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - -\n\n
    - - - - - - - - - - - - - - - - - - - - - - - - - -  CIERRE DEL ACTA --------------------------------------------\n
    Se da por concluida la presente acta, siendo las ____ horas del día ____ de __________ de 200__, firmando  al margen y al calce por las personas que en ella intervienen, para todos los efectos a que haya lugar. - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n\n\n\n
    \t\t\tPOR EL TLP\t\t\tPOR EL S.A.E.\n\n\n\n\n\n
    \t\t\tC. _____________________\t\t\t\t\t\t\t\tC. _____________________\n\n\n\n
    Ultima página del Acta Administrativa de Validación y Conversión de Unidades de Medida de Bienes Muebles con Clave ${
      this.selectItem2 != null ? this.selectItem2 : ''
    } de fecha ___ de  _________ de 2008, constante de ____ fojas. - - - - - - - - - - - - -`;
    //hay q actualizar atravez el id de convercion los parrofos
  }
  close() {
    this.router.navigate(['/pages/administrative-processes/derivation-goods'], {
      queryParams: {},
    });
    this.modalRef.hide();
  }
  payload: any;
  handleSubmitNewItem() {
    this.flagNewActa = true;
    this.flagAsignaActa = true;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].cve_acta_conv === this.selectItem2) {
        this.selectedItems = this.items[i].cve_acta_conv;
        this.selectedIndex = i + 1;
      }
    }
    let parts: any = this.selectItem2.split('/');
    const DATAselectItem2 = parts.join('/');
    const str = this.updateString(DATAselectItem2);
    this.selectItem2 = str;
    this.items.push({ cve_acta_conv: this.selectItem2 });

    if (this.items[this.items.length - 1]) {
      const payload: any = {
        cveActaConvId: this.selectItem2,
        typeActa: null,
        broadcaster: null,
        administeredBy: null,
        run: null,
        universalFolio: null,
        paragraph1: null,
        paragraph2: null,
        paragraph3: null,
      };
      console.log('Acta a enviar: ', payload);
      // this.serviceGood
      //   .createActaConversion(payload)
      //   .subscribe(_ => this.fetchItems());
      // this.router.navigate(
      //   ['/pages/administrative-processes/derivation-goods'],
      //   {
      //     queryParams: {
      //       newActConvertion: this.selectItem2,
      //     },
      //   }
      // );
      this.insertParaphs = false;
    }
    if (this.actConvertion) {
      /*this.alert(
          'error',
          'La Conversison No tiene un CVE_ACTA_CONV',
          'Genere Un CVE_ACTA_CONV'
        );*/
      if (this.items[this.items.length - 1].parrafo1) {
        this.alertQuestion(
          'question',
          `¿El Proceso Reinicializa los Párrafos, se Continua?`,
          ''
        ).then(q => {
          if (q.isConfirmed) {
            this.insertParaph();
            /*SOLO ES PREGUNTA */
            //http://sigebimsdev.indep.gob.mx/catalog/api/v1/apps/pupInsertParaph
            //END POINT NO ESTA ACTUALIZANDO NADA
            /*this.serviceGood
                      .updateGoodStatus(this.numberGoodFather.value, 'CAN')
                      .subscribe(
                        res => {
                          this.alert(
                            'success',
                            'Se cambio el estatus del Bien',
                            `El Bien estatus del bien con id: ${this.numberGoodFather.value}, fue cambiado a CAN`
                          );
                        },
                        err => {
                          this.alert(
                            'error',
                            'No se pudo cambiar el estatus del bien',
                            'Se presentó un error inesperado que no permitió el cambio de estatus del bien, por favor intentelo nuevamente'
                          );
                        }
                      );*/
          }
        });
        this.items = [];
        /*LLAMAR AL END POINT OTRA VES PERO ESTA VES FILTRAR  CON UN LIKE BLK_CACTAS.CVE_ACTA_CONV EN EL LISTADO DE CONVERSIONES ACTAS */
        const params = new ListParams();
        params['filter.cveActaConvId'] = this.selectItem2;
        this.convertiongoodService
          .getAllMinuteConversions(params)
          .subscribe((item: any) => {
            this.numberFoli = item.data[0].universalFolio;
            this.parrafo1 = item.data[0].paragraph1;
            this.parrafo2 = item.data[0].paragraph2;
            this.parrafo3 = item.data[0].paragraph3;
          });
        this.flagNewActa = true;
        this.flagAsignaActa = true;
      }
    }
  }

  insertParaph() {
    let payload: any;
    if (this.selectItem2) {
      payload = {
        actConvKey: this.selectItem2,
      };
    } else {
      payload = {
        actConvKey: this.actConvertion,
      };
    }

    this.convertiongoodService.postPupInsertParaph(payload).subscribe({
      next: (res: any) => {
        this.insertarParrafos(res.data[0].v_desc_transferente);
        this.save = false;
      },
      error: error => {
        this.alert('error', 'error', error.message);
      },
    });
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
        // this.route.queryParams.subscribe(params => {
        //   this.actConvertion = params['actConvertion'] || null;
        //   this.tipoConv = params['tipoConv'] || null;
        //   this.pGoodFatherNumber = params['pGoodFatherNumber'] || null;
        //   console.log(this.pGoodFatherNumber);
        //
        // });
        this.fetchItems();
        console.log(this.tipoConv);
      },
      error: err => {
        console.log(err);
      },
    });
  }
  fetchItems() {
    this.items = [];
    console.log('tipoConv -> ', this.tipoConv);
    if (this.tipoConv === '2') {
      //console.log(this.tipoConv);
      if (this.actConvertion) {
        this.selectItem2 = this.actConvertion;
        this.flagNewActa = true;
        this.flagAsignaActa = true;
        this.disableAllChecks = true;
        this.save = true;
        let filter = {
          pDelivery: this.actConvertion,
          vFilter: 'false',
        };
        this.proceedingsService.postBlkConversions(filter).subscribe({
          next: response => {
            console.log(response);
            this.items = response.data;
            this.numberFoli = response.data[0].folio_universal;
            this.parrafo1 = response.data[0].parrafo1;
            this.parrafo2 = response.data[0].parrafo2;
            this.parrafo3 = response.data[0].parrafo3;
            console.log(this.numberFoli);
            this.refresh = true;
          },
          error: err => {
            console.error(err);
            this.alert('error', 'ERROR', err.error.message);
          },
        });
      } else {
        console.log(this.user.usuario.delegationNumber);
        const payload = {
          pGoodFatherNumber: this.pGoodFatherNumber,
          pDelegationNumber: this.user.usuario.delegationNumber,
          //buscar numero de delegacion del usuario logeado
        };
        this.serviceGood.generateWeaponKey(payload).subscribe((item: any) => {
          console.log(item);
          this.selectItem2 = item;
          this.items = [{ cve_acta_conv: item }];

          this.selectedIndex = 0;
          this.flagAsignaActa = true;
        });
        let filter = {
          pDelivery: this.selectItem2,
          vFilter: 'true',
        };
        this.proceedingsService.postBlkConversions(filter).subscribe({
          next: response => {
            console.log(response);
          },
          error: err => {
            console.error(err);
            this.alert('error', 'ERROR', err.error.message);
          },
        });
      }
    } else {
    }
  }

  onCheckboxChange(event: any, index: number) {
    this.flagAsignaActa = event.target.checked ? false : true;
    console.log(event.target.checked);
    if (event.target.checked) {
      this.selectedIndex = index;
      this.selectedItems = [this.items[index]];
      this.selectItem = this.selectedItems[0].cve_acta_conv;
    } else if (this.selectedIndex === index) {
      this.selectItem2 = '';
      this.selectedIndex = null;
      this.selectedItems = [];
      this.selectItem = '';
    }
  }

  generateAsignarActa() {
    console.log(this.selectItem);
    console.log(this.selectedIndex);
    if (this.flagAsignaActa == false) {
      this.selectItem2 = this.selectItem;
      this.disableAllChecks = true;
      this.flagNewActa = true;
      this.flagAsignaActa = true;
    }
  }

  imprimirFolioEscaneo() {}

  visualizacionFolioEscaneo() {}

  imgSolicitud() {}

  escanearFolioEscaneo() {}
  /*GENERA NUEVA ACTA DE CONVERSIONiD */
  generateNewCveActaConvIds(items: any) {
    return items.map((item: any) => {
      const itemParts = item.cveActaConvId.split('/');

      const matchingItems = items.filter((otherItem: any) => {
        const otherItemParts = otherItem.cveActaConvId.split('/');
        return (
          otherItemParts[4] === itemParts[4] &&
          otherItemParts[6] === itemParts[6]
        );
      });

      const maxNumber = Math.max(
        ...matchingItems.map((matchingItem: any) => {
          return parseInt(matchingItem.cveActaConvId.split('/')[5]);
        })
      );

      const newNumber = isNaN(maxNumber) ? 1 : maxNumber + 1;
      /*CODIGO GENERADO  */
      const newNumberString = String(newNumber).padStart(5, '0');
      this.selectItem2 = newNumberString;
      if (this.selectItem2) {
        this.router.navigate(
          ['/pages/administrative-processes/derivation-goods'],
          {
            queryParams: {
              bkConversionsCveActaCon: this.selectItem2,
            },
          }
        );
      }
      itemParts[5] = newNumberString;

      const newCveActaConvId = itemParts.join('/');

      return { ...item, cveActaConvId: newCveActaConvId };
    });
  }
  printAct() {
    let params = {
      PCLAVE: '',
      PDESTINO: '',
    };

    this.siabService
      // .fetchReport('RGENACTACONVBIS', params)
      .fetchReportBlank('blank')
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
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
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
        }
      });
  }

  /*V_CONSECUTIVO  */

  updateString(str: any) {
    let parts = str.split('/');

    let num = parts[5];
    if (!isNaN(num)) {
      num = parseInt(num);
      num = isNaN(num) ? 1 : num + 1;
    } else {
      num = 1;
    }
    let consecutivo = num.toString().padStart(5, '0');

    return `${parts[0]}/${parts[1]}/${parts[2]}/${parts[3]}/${parts[4]}/${consecutivo}/${parts[6]}/${parts[7]}`;
  }
  document(doc: IDocuments) {
    console.log(doc.id);
    this.numberFoli = doc.id;
    this.flagNewActa = false;
  }
  createMinuteConversion() {
    console.log('tipoConv -> ', this.tipoConv);

    const payload: any = {
      cveActaConvId: this.selectItem2,
      typeActa: this.tipoConv,
      broadcaster: null,
      administeredBy: null,
      run: null,
      universalFolio: Number(this.numberFoli),
      paragraph1: this.parrafo1,
      paragraph2: this.parrafo2,
      paragraph3: this.parrafo3,
    };
    // this.router.navigate(
    //   ['/pages/administrative-processes/derivation-goods'],
    //   {
    //     queryParams: {
    //       newActConvertion: this.selectItem2,
    //       // expedientNumber: this.form.value.numberDossier,
    //     },
    //   }
    // );
    console.log('minute-conversions -> ', payload);
    this.convertiongoodService.createMinuteConversion(payload).subscribe({
      next: (res: IListResponse<any>) => {
        this.alert('success', `Acta Creada Correctamente`, '');
        console.log('minute-conversions res -> ', res);
        this.router.navigate(
          ['/pages/administrative-processes/derivation-goods'],
          {
            queryParams: {
              newActConvertion: this.selectItem2,
              // expedientNumber: this.form.value.numberDossier,
            },
          }
        );
        this.modalRef.hide();
      },
      error: error => {
        console.log(error.error.message);
        if (error.error.message == 'Datos duplicados') {
          this.putMinuteConversion(payload);
        }
        // this.alert('error', 'error', error.message);
      },
    });
  }
  putMinuteConversion(payload: any) {
    // putMinuteConversion
    this.convertiongoodService.putMinuteConversion(payload).subscribe({
      next: (res: IListResponse<any>) => {
        this.alert('success', `Acta Actualizada Correctamente`, '');
        console.log('minute-conversions res -> ', res);
        this.router.navigate(
          ['/pages/administrative-processes/derivation-goods'],
          {
            queryParams: {
              newActConvertion: this.selectItem2,
              // expedientNumber: this.form.value.numberDossier,
            },
          }
        );
        this.modalRef.hide();
      },
      error: error => {
        console.log(error.error.message);
        // this.alert('error', 'error', error.message);
      },
    });
  }
}
