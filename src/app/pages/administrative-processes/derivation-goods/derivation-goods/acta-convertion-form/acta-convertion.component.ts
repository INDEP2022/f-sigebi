import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { IZoneGeographic } from 'src/app/core/models/catalogs/zone-geographic.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-acta-convertion-form',
  templateUrl: './acta-convertion-form.component.html',
  styleUrls: ['./acta-convertion.component.scss'],
})
export class ActaConvertionFormComponent extends BasePage implements OnInit {
  delegationForm: ModelForm<IDelegation>;
  edit: boolean = false;
  delegation: any;
  states = new DefaultSelect<IStateOfRepublic>();
  zones = new DefaultSelect<IZoneGeographic>();
  items: any[] = [];
  selectedItems: any[] = [];

  parrafo1: string = '';
  parrafo2: string = '';
  parrafo3: string = '';
  actConvertion: string = '';
  tipoConv: any;
  pGoodFatherNumber: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private serviceGood: GoodService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.route.queryParams.subscribe(params => {
      this.actConvertion = params['actConvertion'] || null;
      this.tipoConv = params['tipoConv'] || null;
      this.pGoodFatherNumber = params['pGoodFatherNumber'] || null;
    });
  }

  ngOnInit(): void {
    this.fetchItems();
  }

  insertarParrafos() {
    this.parrafo1 = `- - - En la Ciudad de ______________, siendo las _____ horas, del día ____de ________ de 200__, se encuentran presentes en la Bodega ubicada en la calle de ________________________ de esta Ciudad, el C. _____________________ con cargo de ___________________, de la empresa ______________ y el C. ___________________ adscrito a _______________ del Servicio de Administración y Enajenación de Bienes (SAE), Organismo Descentralizado de la Administración Pública Federal; ambos con el fin de llevar a cabo la validación y conversión de bienes muebles transferidos y en administración del SAE - - - - - - - - - - - - - - - - - - - - - - - - -\n
- - -Intervienen como testigos de asistencia los CC. _______________________, y _____________________, - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - -\n\n
-------------------------------------------------- A N T E C E D E N T E S ------------------------------------------\n
- - - l. Los bienes muebles fueron transferidos al SAE por [_____________________________], con fundamento en los artículos 3 de la LFAEBSP, 12 y 13 del Reglamento de la ley en comento. - -\n
- - - II.- Los bienes muebles sujetos a validación y conversión de unidades de medida, se encuentran en administración del SAE y bajo la custodia de _(precisar MYMLAND, CR o DEBM)____________ los cuales se incorporan a este procedimiento a efecto de facilitar la ejecución de su destino.- - - - - - - - - - - -\n\n
----------------------------------------------------- DECLARACIONES ---------------------------------------------\n
- - - PRIMERA.- El C. _________________ manifiesta que los bienes muebles que fueron transferidos al SAE se encuentran bajo su custodia y que con el fin de dar cumplimento al destino final de precisar destino -venta-donación o destrucción-  sugerido por la Entidad V_DESC_TRANSFERENTE, se sujetarán a un procedimiento de validación y conversión de unidades de medida toda vez que fueron puestos a disposición con un tipo de unidad diferente al requerido para el destino previsto.\n\n
- - - SEGUNDA.- Que para realizar el proceso de validación se verifican las cantidades físicas contra las cantidades señaladas en los documentos oficiales y registros SIAB para posteriormente determinar el valor de conversión de los bienes muebles siguientes:- - - - - - - - - - - - - - - - -`;

    this.parrafo2 = `- - - TERCERA.- Una vez validada la existencia física en las cantidades y características señaladas en los documentos de recepción de los bienes muebles descritos en la declaratoria anterior, se determinó que su valor de conversión corresponde a:`;

    this.parrafo3 = `- - - CUARTA.- Los  valores de conversión determinados en la Cláusula Tercera son una referencia para ejecutar el destino de [ precisar destino -venta-donación o destrucción__] de los bienes muebles, por lo que cada registro SIAB conserva el número de expediente y de bien, así como los atributos de referencia recibidos del transferente - - - - - - - - - - -  -- - - - - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - -\n\n
- - - - - - - - - - - - - - - - - - - - - - - - - -  CIERRE DEL ACTA --------------------------------------------\n
Se da por concluida la presente acta, siendo las ____ horas del día ____ de __________ de 200__, firmando  al margen y al calce por las personas que en ella intervienen, para todos los efectos a que haya lugar. - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n\n\n\n
\t\t\tPOR EL TLP\t\t\tPOR EL S.A.E.\n\n\n\n\n\n
\t\t\tC. _____________________\t\t\t\t\t\t\t\tC. _____________________\n\n\n\n
Ultima página del Acta Administrativa de Validación y Conversión de Unidades de Medida de Bienes Muebles con Clave :CONVERSIONES_ACTAS.CVE_ACTA_CONV de fecha ___ de  _________ de 2008, constante de ____ fojas. - - - - - - - - - - - - -`;
  }
  close() {
    this.modalRef.hide();
  }
  payload: any;
  handleSubmitNewItem() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].cveActaConvId === 'CONV/RT/ALAF/GDL/GDL/00018/10/11') {
        this.selectedItems = this.items[i].cveActaConvId;
        this.selectedIndex = i;
      }
    }
    let parts: any = this.selectItem2.split('/');
    const DATAselectItem2 = parts.join('/');
    const str = this.updateString(DATAselectItem2);
    this.selectItem2 = str;
    this.items.push({ cveActaConvId: this.selectItem2 });

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
      this.serviceGood
        .createActaConversion(payload)
        .subscribe(_ => this.fetchItems());
      this.router.navigate(
        ['/pages/administrative-processes/derivation-goods'],
        {
          queryParams: {
            newActConvertion: this.selectItem2,
          },
        }
      );
    }
    console.log('NOS QUIEDAMOS ACA');
    if (this.actConvertion) {
      /*this.alert(
          'error',
          'La Conversison No tiene un CVE_ACTA_CONV',
          'Genere Un CVE_ACTA_CONV'
        );*/
      if (this.items[this.items.length - 1].parrafo1) {
        this.alertQuestion(
          'question',
          `¿El proceso reinicializa los párrafos, se continua?`,
          ''
        ).then(q => {
          if (q.isConfirmed) {
            /*FALTA END POINT PARA ACTUALIZAR LOS PARRAFOS DEL LA CONVERSIO NDE ACTA */
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
        this.flagNewActa = true;
        this.flagAsignaActa = true;
      }
    }
  }

  fetchItems() {
    if (this.tipoConv === '2') {
      if (this.actConvertion) {
        this.selectItem2 = this.actConvertion;
        this.items = [{ cveActaConvId: this.actConvertion }];
      } else {
        /*VALIDAR CON BACK END DE QUE MANERA USAN EL FILTRO PARA ESTE END POINT POR cveActaConvId PADRE */
        this.serviceGood
          .getActasConversion(this.actConvertion)
          .subscribe((item: any) => {
            this.items = item.data;
            // this.items = item.data.filter((item:any) => item.cveActaConvId === 'CONV/RT/ALAF/OFICINAS CENTRALES/TIJ/%/23/06');
          });
        const payload = {
          pGoodFatherNumber: this.pGoodFatherNumber,
          pDelegationNumber: 1,
        };
        this.serviceGood.generateWeaponKey(payload).subscribe((item: any) => {
          this.selectItem2 = item;
        });
      }
    }
  }
  selectedIndex: number | null = null;
  selectItem: string = '';
  selectItem2: string = '';

  onCheckboxChange(event: any, index: number) {
    this.flagAsignaActa = event.target.checked ? false : true;
    if (event.target.checked) {
      this.selectedIndex = index;
      this.selectedItems = [this.items[index]];
      this.selectItem = this.selectedItems[0].cveActaConvId;
    } else if (this.selectedIndex === index) {
      this.selectItem2 = '';
      this.selectedIndex = null;
      this.selectedItems = [];
      this.selectItem = '';
    }
  }
  flagNewActa: boolean = false;
  flagAsignaActa: boolean = false;
  disableAllChecks: boolean = false;

  generateAsignarActa() {}

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
}
