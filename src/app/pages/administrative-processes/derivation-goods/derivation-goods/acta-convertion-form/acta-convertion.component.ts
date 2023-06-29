import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private serviceGood: GoodService,
    private route: ActivatedRoute
  ) {
    super();
    /* this.route.queryParams.subscribe(params => {
      this.actConvertion = params['actConvertion'] || null;
    });*/
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

  handleSubmitNewItem() {
    /*if (this.actConvertion === this.CVE_ACTA_CONV) {

    }*/
    const payload = this.selectedItems[0];
    payload.paragraph1 = this.parrafo1;
    payload.paragraph2 = this.parrafo2;
    payload.paragraph3 = this.parrafo3;
    payload.universalFolio = Number(payload.universalFolio);
    payload.noRegister =
      Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;

    const newStr = payload.cveActaConvId.slice(0, -5);
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const year = today.getFullYear().toString().substr(-2);

    const formattedDate = day + '/' + month + '/' + year;

    const cveActaConvId = `${newStr}${formattedDate}`;
    payload.cveActaConvId = cveActaConvId;
    this.serviceGood
      .createActaConversion(payload)
      .subscribe(_ => this.fetchItems());
  }

  fetchItems() {
    this.serviceGood.getActasConversion().subscribe((item: any) => {
      this.items = item.data;
    });
  }

  /*create() {
    this.loading = true;
    this.delegationService.create(this.delegationForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }*/

  onCheckboxChange(event: any, item: any) {
    if (event.target.checked) {
      this.selectedItems.push(item);
    } else {
      for (var i = 0; i < this.selectedItems.length; i++) {
        if (this.selectedItems[i].id === item.id) {
          this.selectedItems.splice(i, 1);
        }
      }
    }
  }

  imprimirFolioEscaneo() {
    // if (this.dictamen) {
    /* if (this.dictamen.folioUniversal == null) {
      this.alert('warning', 'No tiene folio de escaneo para imprimir.', '');
      return;
    } else {
      let params = {
        pn_folio: this.dictamen.folioUniversal,
      };
      // let params = {
      //   pn_folio: 3429518,
      // };
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
    }*/
    // } else {
    //   this.alert(
    //     'info',
    //     'Debe seleccionar un dictamen y/o un oficio de dictamen',
    //     ''
    //   );
    // }
  }

  visualizacionFolioEscaneo() {
    // if (this.dictamen) {
    /*if (this.dictamen.folioUniversal == null) {
      this.alert('warning', 'No tiene folio de escaneo para visualizar.', '');
      return;
    } else {
      this.goNextForm();
    }*/
    // } else {
    //   this.alert(
    //     'info',
    //     'Debe seleccionar un dictamen y/o un oficio de dictamen',
    //     ''
    //   );
    // }
  }

  imgSolicitud() {
    // if (this.oficioDictamen && this.dictamen) {
    /*  if (
      this.oficioDictamen.statusOf == 'ENVIADO' &&
      this.dictamen.passOfficeArmy != null
    ) {
      if (this.dictamen.folioUniversal != null) {
        this.alert('warning', 'El acta ya tiene folio de escaneo', '');
        return;
      } else {
        this.alertQuestion(
          'info',
          'Se generará un nuevo folio de escaneo para la declaratoria',
          '¿Deseas continuar?'
        ).then(question => {
          if (question.isConfirmed) {
            this.generarFolioEscaneo();
          }
        });
      }
    } else {
      this.alert(
        'warning',
        'No se puede generar el folio de escaneo en una declaratoria abierta',
        ''
      );
    }*/
    // } else {
    // this.alert(
    //   'info',
    //   'Debe seleccionar un dictamen y/o un oficio de dictamen',
    //   ''
    // );
    // }
  }

  escanearFolioEscaneo() {
    // if (this.oficioDictamen && this.dictamen) {
    /*if (
      this.oficioDictamen.statusOf == 'ENVIADO' &&
      this.dictamen.passOfficeArmy != null
    ) {
      if (this.folioEscaneoNg != '') {
        this.alertQuestion(
          'info',
          'Se abrirá la pantalla de escaneo para el folio de escaneo de la declaratoria',
          '¿Deseas continuar?',
          'Continuar'
        ).then(question => {
          if (question.isConfirmed) {
            // this.onLoadToast('success', 'Enviado a la siguiente forma', '');

            this.goNextForm();
          }
        });
      } else {
        this.alert('error', 'No existe folio de escaneo a escanear', '');
      }
    } else {
      this.alert(
        'error',
        'No se puede escanear para una declaratoria que esté abierta',
        ''
      );
    }*/
    // } else {
    //   this.alert(
    //     'info',
    //     'Debe seleccionar un dictamen y/o un oficio de dictamen',
    //     ''
    //   );
    // }
  }
}
