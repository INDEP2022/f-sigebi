import { DobleclickaddComponent } from '../dobleclickadd/dobleclickadd.component';

export const COLUMNS = {
  goodNumber: {
    title: 'No.Bien',
    sort: false,
  },
  descriptionGood: {
    title: 'Descripción del Bien',
    sort: false,
  },
  motive1: {
    title: 'Motivo 1',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive2: {
    title: 'Motivo 2',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 2';
      instance.updateAtt = 'motive2';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive3: {
    title: 'Motivo 3',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 3';
      instance.updateAtt = 'motive3';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive4: {
    title: 'Motivo 4',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 4';
      instance.updateAtt = 'motive4';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive5: {
    title: 'Motivo 5',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 5';
      instance.updateAtt = 'motive5';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive6: {
    title: 'Motivo 6',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 6';
      instance.updateAtt = 'motive6';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive7: {
    title: 'Motivo 7',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 7';
      instance.updateAtt = 'motive7';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive8: {
    title: 'Motivo 8',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 8';
      instance.updateAtt = 'motive8';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive9: {
    title: 'Motivo 9',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 9';
      instance.updateAtt = 'motive9';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive10: {
    title: 'Motivo 10',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 10';
      instance.updateAtt = 'motive10';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive11: {
    title: 'Motivo 11',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 11';
      instance.updateAtt = 'motive11';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive12: {
    title: 'Motivo 12',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 12';
      instance.updateAtt = 'motive12';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive13: {
    title: 'Motivo 13',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 13';
      instance.updateAtt = 'motive13';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive14: {
    title: 'Motivo 14',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 14';
      instance.updateAtt = 'motive14';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive15: {
    title: 'Motivo 15',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 15';
      instance.updateAtt = 'motive15';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive16: {
    title: 'Motivo 16',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 16';
      instance.updateAtt = 'motive16';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive17: {
    title: 'Motivo 17',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 17';
      instance.updateAtt = 'motive17';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive18: {
    title: 'Motivo 18',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 18';
      instance.updateAtt = 'motive18';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive19: {
    title: 'Motivo 19',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 19';
      instance.updateAtt = 'motive19';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
  motive20: {
    title: 'Motivo 20',
    sort: false,
    type: 'custom',
    renderComponent: DobleclickaddComponent,
    onComponentInitFunction: (instance: any) => {
      instance.label = 'Motivo 20';
      instance.updateAtt = 'motive20';
      instance.funcionEjecutada.subscribe(() => {
        // this.miFuncion();
      });
    },
  },
};
