import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  numberWorehouse: {
    title: 'No Alm',
    sort: false,
  },

  description: {
    title: 'Descripción',
    sort: false,
  },
  ubication: {
    title: 'Ubicación',
    sort: false,
  },
  typeWorehouse: {
    title: 'Tipo Almacén',
    sort: false,
  },
  delegationRes: {
    title: 'Delegacion Res',
    sort: false,
  },
  responsible: {
    title: 'Responsable',
    sort: false,
  },
  federativeOrganization: {
    title: 'Entidad Federativa',
    sort: false,
  },
  municipality: {
    title: 'Municipio',
    sort: false,
  },
  city: {
    title: 'Ciudad',
    sort: false,
  },
  locality: {
    title: 'Localidad',
    sort: false,
  },
  active: {
    title: 'Activo',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  inactive: {
    title: 'Inactivo',
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
