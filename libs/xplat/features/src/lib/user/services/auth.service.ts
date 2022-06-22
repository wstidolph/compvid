import { Injectable } from '@angular/core';
import { Auth, User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  getAuth,
  signOut,
  UserCredential} from '@angular/fire/auth';

import { map, Observable } from 'rxjs';

export interface EmailPw {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$!: Observable<User | null>;

  constructor(private auth: Auth) {
  }

  async register({email, password}: EmailPw) {
   try{
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      return user;
   } catch (e) {
      console.log('register failed',e)
      return null;
   }
  }


  async login({email, password}: EmailPw) {
    try{
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
   } catch (e) {
      console.log('login  failed',e)
      return null;
   }
  }

  async loginAnon() {
    const auth = getAuth();
    await signInAnonymously(auth).then( () =>{
      console.log('signed in anon, should trigger all the auth state handler stuff');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('anon login failed', errorCode, errorMessage)
    });
  }

  // add other account /login providers and management here

  logout() {
    console.log('AuthService logout');
    return signOut(this.auth); // does logout belong here, or just on the UserService?
  }
}
