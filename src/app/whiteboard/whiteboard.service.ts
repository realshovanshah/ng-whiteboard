import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WhiteboardService {

  whiteboardCollection: AngularFirestoreCollection<Whiteboard>;
  whiteBoard$: BehaviorSubject<Whiteboard[]>;

  constructor(private firestore: AngularFirestore) { 
    this.whiteboardCollection = this.firestore.collection<Whiteboard>('whiteboard');
    this.whiteBoard$ = BehaviorSubject.create(this.whiteboardCollection.valueChanges());
  }

   loadWhiteboard(userId: string): Whiteboard | undefined {
    console.info('Loading whiteboard from firebase..');
    return this.whiteBoard$.value.find(whiteboard => whiteboard.userId === userId);
  }

  updateWhiteboard(whiteboard: Whiteboard): void{
    console.info('Saving whiteboard to firebase..')
    this.whiteboardCollection.doc(whiteboard.id).set(whiteboard).catch(error => {
      console.error('Updating whiteboard failed',error);
    })
    .then(() => {
      console.info('Saved to firebase sucessfully.');
    });
  }
}

 interface Whiteboard {
  id?: string
  userId: string
  data: string
}