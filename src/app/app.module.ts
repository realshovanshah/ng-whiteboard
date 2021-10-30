import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { initializeApp } from "firebase/app";
import { FirestoreModule } from '@angular/fire/firestore';
import { AuthModule } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';
import { AuthComponent } from './login/auth.component';

const firebaseConfig = {
  apiKey: "AIzaSyD1GdBTBSjIY2BXD1n7__AmWLjcoTv2mzM",
  authDomain: "pencil-app-bb647.firebaseapp.com",
  projectId: "pencil-app-bb647",
  storageBucket: "pencil-app-bb647.appspot.com",
  messagingSenderId: "955173787244",
  appId: "1:955173787244:web:438b497f779e3c49c5ea49"
};

const routes = [
  {path: 'whiteboard', component: WhiteboardComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    WhiteboardComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { 

  constructor() {
    initializeApp(firebaseConfig);
  }
}
