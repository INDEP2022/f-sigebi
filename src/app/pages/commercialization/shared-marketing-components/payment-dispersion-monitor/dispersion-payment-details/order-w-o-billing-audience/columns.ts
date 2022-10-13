//Components
import { PaPdmCeCCheckboxElementComponent } from '../checkbox-element/pa-pdm-ce-c-checkbox-element.component';

export const COLUMNS={
    username: {
        title: 'Nombre',
        type: 'string',
        sort: false,
    },
    email: {
        title: 'Email',
        type: 'string',
        sort: false,
    },
    mandato: {
        title: 'Mandato',
        type: 'string',
        sort: false,
    },
    to: {
        title: 'Para',
        type: 'custom',
        renderComponent: PaPdmCeCCheckboxElementComponent ,
        onComponentInitFunction(instance:any) {
          instance.toggle.subscribe((data:any) => {
            data.row.to=data.toggle;
          });
        },
        sort: false,
    },
    withCopy: {
        title: 'CC',
        type: 'custom',
        renderComponent: PaPdmCeCCheckboxElementComponent ,
        onComponentInitFunction(instance:any) {
          instance.toggle.subscribe((data:any) => {
            data.row.withCopy=data.toggle;
          });
        },
        sort: false,
    },
    sendMail: {
        title: 'Enviar',
        type: 'custom',
        renderComponent: PaPdmCeCCheckboxElementComponent ,
        onComponentInitFunction(instance:any) {
          instance.toggle.subscribe((data:any) => {
            data.row.sendMail=data.toggle;
          });
        },
        sort: false,
    }
    }