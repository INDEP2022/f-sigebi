//Components
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  DescriptionGood: {
    title: 'Descripcion del Bien',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  check: {
    title: '',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
};

export interface ExampleFile {
  numberFile: string;
  goods: Good[];
}

export interface Good {
  goodNumber: string;
  DescriptionGood: string;
  status: string;
  check: boolean;
}
export const expediente: ExampleFile[] = [
  {
    numberFile: '1',
    goods: [
      {
        goodNumber: 'Bien 1',
        DescriptionGood: 'Descripcion del bien 1',
        status: '1',
        check: false,
      },
      {
        goodNumber: 'Bien 2',
        DescriptionGood: 'Descripcion del bien 2',
        status: '2',
        check: false,
      },
      {
        goodNumber: 'Bien 3',
        DescriptionGood: 'Descripcion del bien 3',
        status: '3',
        check: false,
      },
    ],
  },
  {
    numberFile: '2',
    goods: [
      {
        goodNumber: 'Bien 1',
        DescriptionGood: 'Descripcion del bien 1',
        status: 'Estatus 1',
        check: false,
      },
      {
        goodNumber: 'Bien 2',
        DescriptionGood: 'Descripcion del bien 2',
        status: 'Estatus 2',
        check: false,
      },
    ],
  },
];

export const statusData = [
  {
    numberStatus: '10',
    descriptionStatus: 'Descripcion del estatus 10',
  },
  {
    numberStatus: '11',
    descriptionStatus: 'Descripcion del estatus 11',
  },
  {
    numberStatus: '12',
    descriptionStatus: 'Descripcion del estatus 12',
  },
];
