//Components
import { PaPdmCeCCheckboxElementComponent } from '../checkbox-element/pa-pdm-ce-c-checkbox-element.component';

export const COLUMNS={
    user: {
        title: 'Usuario',
    },
    username: {
        title: 'Nombre',
    },
    distributionMail: {
        title: 'Correo de dist.',
        type: 'custom',
        renderComponent: PaPdmCeCCheckboxElementComponent,
        onComponentInitFunction(instance:any) {
          instance.toggle.subscribe((data:any)=> {
            data.row.distributionMail=data.toggle;
          });
        }
    },
    noSendMail: {
        title: 'No enviar a SIRSAE',
        type: 'custom',
        renderComponent: PaPdmCeCCheckboxElementComponent,
        onComponentInitFunction(instance:any) {
          instance.toggle.subscribe((data:any) => {
            data.row.noSendMail=data.toggle;
          });
        }
    },
    batchEnable: {
        title: 'Hab. Lote Disp. Pagos',
        type: 'custom',
        renderComponent: PaPdmCeCCheckboxElementComponent,
        onComponentInitFunction(instance:any) {
          instance.toggle.subscribe((data:any) => {
            data.row.batchEnable=data.toggle;
          });
        }
    }
};