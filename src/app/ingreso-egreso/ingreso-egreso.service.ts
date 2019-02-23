import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  ingresoEgresoListenerSubscription: Subscription = new Subscription();
  ingresoEgresoItemsSubscription: Subscription = new Subscription();

  constructor(
    private afDB: AngularFirestore,
    public authService: AuthService,
    private store: Store<AppState>
  ) { }

  initIngresoEgresoListener() {  // Se iniciará a partir del dashboard.component (ngOnInit)

    this.ingresoEgresoListenerSubscription = this.store.select('auth')
        .pipe(
          filter( auth => auth.user != null )
        )
        .subscribe( auth => {
          this.ingresoEgresoItems( auth.user.uid );
          // console.log( auth.user );
        });
  }

  private ingresoEgresoItems( uid: string ) {

    this.ingresoEgresoItemsSubscription = this.afDB.collection(`${ uid }/ingreso-egresos/items`)
        .snapshotChanges()
        .pipe(
          map( docData => {
            return docData.map( doc => {
              return {
                uid: doc.payload.doc.id, // trae el uid desde el callback
                ...doc.payload.doc.data() // al llamar esta funcion trae la funcion del nodo y con el operador spread lo organiza mejor.
              };
            });
          })
        )
        .subscribe( (coleccion: any) => {
          // console.log( coleccion );
          this.store.dispatch( new SetItemsAction( coleccion) );
        });
  }

  cancelarSubscriptions() {
    this.ingresoEgresoListenerSubscription.unsubscribe();
    this.ingresoEgresoItemsSubscription.unsubscribe();

    this.store.dispatch( new UnsetItemsAction());
  }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {

    const user = this.authService.getUsuario();

    return this.afDB.doc(`${ user.uid }/ingreso-egresos`)
        .collection('items').add({...ingresoEgreso});
  }

  borrarIngresoEgreso( uid: string ) {
    const user = this.authService.getUsuario();

    return this.afDB.doc(`${ user.uid }/ingreso-egresos/items/${ uid }`)
        .delete(); // promesa
  }

}
