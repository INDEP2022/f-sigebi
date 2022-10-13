//Components
import { PaPdmCeCCheckboxElementComponent } from '../checkbox-element/pa-pdm-ce-c-checkbox-element.component';

export const COLUMNS={
    user: {
        title: 'Usuario',
        type: 'string',
        sort: false,
    },
    
    username: {
        title: 'Nombre',
        type: 'string',
        sort: false,
    },
    distributionMail: {
        title: 'Correo de dist.',
        type: 'custom',
        renderComponent: PaPdmCeCCheckboxElementComponent,
        onComponentInitFunction(instance:any) {
          instance.toggle.subscribe((data:any)=> {
            data.row.distributionMail=data.toggle;
          });
        },
        sort: false,
    },
    noSendMail: {
        title: 'No enviar a SIRSAE',
        type: 'custom',
        renderComponent: PaPdmCeCCheckboxElementComponent,
        onComponentInitFunction(instance:any) {
          instance.toggle.subscribe((data:any) => {
            data.row.noSendMail=data.toggle;
          });
        },
        sort: false,
    },
    batchEnable: {
        title: 'Hab. Lote Disp. Pagos',
        type: 'custom',
        renderComponent: PaPdmCeCCheckboxElementComponent,
        onComponentInitFunction(instance:any) {
          instance.toggle.subscribe((data:any) => {
            data.row.batchEnable=data.toggle;
          });
        },
        sort: false,
    }
};