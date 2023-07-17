import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

function createPer(
  proy: boolean,
  val: boolean,
  aut: boolean,
  cerr: boolean,
  can: boolean
) {
  let newCve: string = '';
  try {
    proy ? (newCve = 'P') : (newCve = 'PX');
    val ? (newCve = `${newCve}-V`) : (newCve = `${newCve}-VX`);
    aut ? (newCve = `${newCve}-A`) : (newCve = `${newCve}-AX`);
    cerr ? (newCve = `${newCve}-C`) : (newCve = `${newCve}-CX`);
    can ? (newCve = `${newCve}-X`) : (newCve = `${newCve}-XX`);
  } catch (error) {
  } finally {
    return newCve;
  }
}

export let newData: any;

export const PERMISSIONSUSER_COLUMNS = {
  value: {
    title: 'Usuario',
    sort: false,
  },
  // usuario: {
  //   title: 'Usuario',
  //   valuePrepareFunction: (value: IUserAccessAreas) => {
  //     return value.user;
  //   },
  //   sort: false,
  // },
  user: {
    title: 'Nombre',
    sort: false,
  },
  S: {
    title: 'S',
    sort: false,
    type: 'html',
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return row.abbreviation == 'S' ? true : false;
    },
  },
  N: {
    title: 'N',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return row.abbreviation == 'N' ? true : false;
    },
  },
  null: {
    title: '',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return row.abbreviation == null ? true : false;
    },
  },
};
export const PRIVILEGESUSER_COLUMNS = {
  proy: {
    title: 'PROY.',
    width: '5%',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.proy = data.toggle;
        const cve = createPer(
          data.row.proy,
          data.row.val,
          data.row.aut,
          data.row.cerr,
          data.row.can
        );
      });
    },
  },
  val: {
    title: 'VAL.',
    width: '5%',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.val = data.toggle;
        const cve = createPer(
          data.row.proy,
          data.row.val,
          data.row.aut,
          data.row.cerr,
          data.row.can
        );
        console.log(cve);
      });
    },
  },
  aut: {
    title: 'AUT.',
    width: '5%',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.aut = data.toggle;
        const cve = createPer(
          data.row.proy,
          data.row.val,
          data.row.aut,
          data.row.cerr,
          data.row.can
        );
        console.log(cve);
      });
    },
  },
  cerr: {
    title: 'CERR.',
    width: '5%',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.cerr = data.toggle;
        const cve = createPer(
          data.row.proy,
          data.row.val,
          data.row.aut,
          data.row.cerr,
          data.row.can
        );
        console.log(cve);
      });
    },
  },
  can: {
    title: 'CAN.',
    width: '5%',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.can = data.toggle;
        const cve = createPer(
          data.row.proy,
          data.row.val,
          data.row.aut,
          data.row.cerr,
          data.row.can
        );
        console.log(cve);
      });
    },
  },
};
