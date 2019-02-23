import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';

import Swal from 'sweetalert2';
import { UpperCasePipe } from '@angular/common';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  items: IngresoEgreso[];
  subscripcion: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    public ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit() {
    this.subscripcion = this.store.select('ingresoEgreso')
              .subscribe( ingresoEgreso => {
                // console.log(ingresoEgreso);
                this.items = ingresoEgreso.items;
              });
  }

  ngOnDestroy() {
    this.subscripcion.unsubscribe();
  }

  borrarItem( item: IngresoEgreso ) {
    this.ingresoEgresoService.borrarIngresoEgreso( item.uid )
        .then( () => {
          Swal.fire(`Eliminado el ${ item.tipo.toUpperCase() }`, '', 'success');
          console.log(item.monto);
        });

  }


}
