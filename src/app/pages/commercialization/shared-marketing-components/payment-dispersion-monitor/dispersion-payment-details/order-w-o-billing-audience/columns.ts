//Components
import { PaPdmCeCCheckboxElementComponent } from '../checkbox-element/pa-pdm-ce-c-checkbox-element.component';

export const COLUMNS={
    username: {
        title: 'Nombre',
    },
    email: {
        title: 'Email',
    },
    mandato: {
        title: 'Mandato',
    },
    to: {
        title: 'Para',
        type: 'custom',
        renderComponent: PaPdmCeCCheckboxElementComponent ,
        onComponentInitFunction(instance:any) {
          instance.toggle.subscribe((data:any) => {
            data.row.to=data.toggle;
          });
        }
    },
    withCopy: {
        title: 'CC',
        type: 'custom',
        renderComponent: PaPdmCeCCheckboxElementComponent ,
        onComponentInitFunction(instance:any) {
          instance.toggle.subscribe((data:any) => {
            data.row.withCopy=data.toggle;
          });
        }
    },
    sendMail: {
        title: 'Enviar',
        type: 'custom',
        renderComponent: PaPdmCeCCheckboxElementComponent ,
        onComponentInitFunction(instance:any) {
          instance.toggle.subscribe((data:any) => {
            data.row.sendMail=data.toggle;
          });
        }
    }
    }