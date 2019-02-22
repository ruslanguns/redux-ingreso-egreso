import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';


import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

import Swal from 'sweetalert2';
import { User } from './user.model';

import { Store } from '@ngrx/store';
import { AppState } from '../reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();
  private usuario: User;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
    private store: Store<AppState>
  ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe( ( fbUser: firebase.User ) => {

      // console.log(fbUser);
      if ( fbUser ) {
        this.userSubscription = this.afDB.doc(`${ fbUser.uid }/usuario`).valueChanges()
            .subscribe( (usuarioObj: any) => {

              // console.log(usuarioObj);

              const newUser = new User( usuarioObj );
              this.store.dispatch( new SetUserAction( newUser ));

              console.log(newUser);
            });
      } else {
        // Para evitar tirar tener
        this.usuario = null;
        this.userSubscription.unsubscribe();
      }

    });
  }

  crearUsuario( nombre: string, email: string, password: string ) {

    this.store.dispatch( new ActivarLoadingAction() );

    this.afAuth.auth
    .createUserWithEmailAndPassword( email, password )
    .then( resp => {
      // console.log( resp );
      const user: User = {
        uid: resp.user.uid,
        nombre: nombre,
        email: resp.user.email
      };

      this.afDB.doc(`${ user.uid }/usuario`)
      .set( user )
      .then( () => {
          this.store.dispatch( new DesactivarLoadingAction() );
          this.router.navigate(['/']);
        });

        // this.router.navigate(['/']);
      })
      .catch( error => {
        // console.log( error );
        this.store.dispatch( new DesactivarLoadingAction() );
        Swal.fire( 'Error en el login', error.message, 'error');
      });
    }

    login( email: string, password: string) {

      this.store.dispatch( new ActivarLoadingAction() );

      this.afAuth.auth
      .signInWithEmailAndPassword( email, password )
      .then( resp => {
        this.store.dispatch( new DesactivarLoadingAction() );
        this.router.navigate(['/']);
      })
      .catch( error => {
        // console.log(error);
        this.store.dispatch( new DesactivarLoadingAction() );
        Swal.fire('Error en el login', error.message, 'error');
    });
  }

  logout() {
    this.afAuth.auth.signOut()
    .then( () => {
      Swal.fire('Logout', 'Ha cerrado sesión correctamente', 'info');
      this.router.navigate(['/login']);
    });
  }

  isAuth() {
    return this.afAuth.authState
      .pipe(
        map( fbUser => {

          if ( fbUser === null ) {
            this.router.navigate(['/login']);
          }

          return fbUser != null;
        })
      );
  }
}
