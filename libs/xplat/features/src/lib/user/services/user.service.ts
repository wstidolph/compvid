import { Injectable } from "@angular/core";
import { Auth, onAuthStateChanged, User, UserCredential, UserInfo } from "@angular/fire/auth";

import { doc, docData, DocumentReference, Firestore, getDoc, setDoc} from "@angular/fire/firestore";
import { Router } from "@angular/router";

import { BehaviorSubject, Observable, of, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from ".";

export enum UserRole {
  GUEST,   // can see the photos, items, 'goesTo'
           // e.g., an estate sales company
  ITEMID,  // can add itemsseen (identify items)
           // e.g., a neighbor or family member
  GRANTEE, // can be target of a GoesTo
  GRANTOR, // can allocate items
  ADMIN
}
export interface UserRoles {
  admin:boolean;
}

export interface UserProfile {
  nickname?: string
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  _user$ = new BehaviorSubject<User | null>(null);
  _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  _profile$ = new BehaviorSubject<UserProfile | null>(null)

  user$ = this._user$.asObservable();
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  profile$ = this._profile$.asObservable();
  profileNow: UserProfile | null = null;;

  isLoggedOut$: Observable<boolean>;

  pictureUrl$: Observable<string | null>;
  // roles$: Observable<UserRoles>

  subs: Subscription[] = [];
  constructor(
      private afAuth: Auth,
      private firestore: Firestore,
      private authService: AuthService,
      private router: Router
  ){

    onAuthStateChanged(this.afAuth, user => {
      console.log('auth state chng', user);
      this._user$.next(user);
      if (user) {
        this._isLoggedIn$.next(true);
        const tokens = user.getIdTokenResult().
            then((t) => console.log('roles',t.claims.role));
        const profileRef = doc(firestore, `users/${user.uid}`);
        console.log(`UserService looking up user users/${user.uid}`)
        getDoc(profileRef).then(prof => {
          const profileDoc = prof.data();
          if(profileDoc) {
            this.profileNow = profileDoc as UserProfile;
            console.log('setting user profileNow', this.profileNow)}
          this._profile$.next(profileDoc as UserProfile ?? null)
      })
      } else {
        this._isLoggedIn$.next(false);
        this._profile$.next(null);
        this.profileNow = null;
      }
    });

    this.isLoggedOut$ = this.isLoggedIn$.pipe(
      map(loggedIn => !loggedIn)
    );

    this.pictureUrl$ = this.user$ ?
      this.user$.pipe(map((u)=>u?.photoURL ?? null))
      : of(null)
  }

  get uid() {
    return this.afAuth.currentUser?.uid;
  }

  getUserProfile() {
    return this.profile$;
  }

  // async uploadImage(cameraFile: Photo) {
  //   const user = this.afAuth.currentUser;
  //   const path = `uploads/${user.uid}/profile.png`;
  //   const storageRef = ref(this.storage, path);

  //   try {
  //     await uploadString(storageRef, cameraFile.base64String, 'base64');

  //     const imageUrl = await getDownloadURL(storageRef);

  //     const userDocRef = doc(this.firestore, `users/${user.uid}`);
  //     await setDoc(userDocRef, {
  //       imageUrl,
  //     });
  //     return true;
  //   } catch (e) {
  //     return null;
  //   }
  // }
  // untested, sample-from-web function
  private updateUserData(user: UserCredential | null) {
    const userRef= doc(this.firestore, `users/${user?.user.uid}`);
    const data = {
      uid: user?.user.uid,
      email: user?.user.email,
      displayName: user?.user.displayName,
      photoURL: user?.user.photoURL,
      admin: false
    };
    return setDoc(userRef, data, {merge: true});
  }

  logout() {
      this.afAuth.signOut();
      //this.router.navigateByUrl('/login');
  }
}
