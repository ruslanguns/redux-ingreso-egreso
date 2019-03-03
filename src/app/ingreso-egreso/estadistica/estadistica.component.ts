import { Component, OnInit, OnDestroy } from '@angular/core';
// import { AppState } from '../../reducer';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../ingreso-egreso.model';
import * as fromIngresoEgreso from './../ingreso-egreso.reducer';



@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  ingresos: number;
  egresos: number;

  cuantosIngresos: number;
  cuantosEgresos: number;

  subscripcion: Subscription = new Subscription();

  public doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: number[] = [];

  constructor(
    private store: Store<fromIngresoEgreso.AppState>
  ) { }

  ngOnInit() {
    this.subscripcion = this.store.select('ingresoEgreso')
                            .subscribe( ingresoEgreso => {
                              this.contarIngresoEgreso( ingresoEgreso.items );
                            });
  }

  ngOnDestroy() {
    this.subscripcion.unsubscribe();
  }

  contarIngresoEgreso( items: IngresoEgreso[] ) {
    this.ingresos = 0;
    this.egresos = 0;

    this.cuantosIngresos = 0;
    this.cuantosEgresos = 0;


    items.forEach( item => {

      const transaccion = Number( item.monto );

      if ( item.tipo === 'ingreso' ) {
        this.cuantosIngresos ++;
        this.ingresos += transaccion;
      } else {
        this.cuantosEgresos ++;
        this.egresos += transaccion;
      }
    });

    this.doughnutChartData = [ 123, 125 ];
  }

}
