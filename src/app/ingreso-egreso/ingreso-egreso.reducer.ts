

import * as fromIngresoEgreso from './ingreso-egreso.actions';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AppState } from '../reducer';


export interface IngresoEgresoState {
  items: IngresoEgreso[];
}

export interface AppState extends AppState {
  ingresoEgreso: IngresoEgresoState;
}


const estadoInicial: IngresoEgresoState = {
  items: []
};


export function IngresoEgresoReducer( state = estadoInicial, action: fromIngresoEgreso.actions ): IngresoEgresoState {

  switch ( action.type ) {

    case fromIngresoEgreso.SET_ITEMS:
      return {
        items: [ // La idea es romper los arreglos internos en el arreglo y estamos regresando un nuevo elemento
          ...action.items.map( item => {
            return {
              ...item
            };
          })
        ]
      };

    case fromIngresoEgreso.UNSET_ITEMS:
    return { // estamos purgando todos los elementos en este estado
      items: []
    };

    default:
      return state;
  }
}



