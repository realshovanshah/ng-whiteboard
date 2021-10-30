import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WhiteboardService {

  whiteboardCollection: AngularFirestoreCollection<Whiteboard>;
  whiteBoard$: Observable<Whiteboard[]>;

  constructor(private firestore: AngularFirestore) { 
    this.whiteboardCollection = this.firestore.collection<Whiteboard>('whiteboard');
    this.whiteBoard$ = this.whiteboardCollection.valueChanges();
  }

  async loadWhiteboard(whiteboardId: string): Promise<Whiteboard | undefined> {
    console.info('Loading whiteboard from firebase..');
    return (await this.whiteboardCollection.doc(whiteboardId).get().toPromise()).data();
  }

  updateWhiteboard(whiteboard: Whiteboard): void{
    console.info('Saving whiteboard to firebase..')
    this.whiteboardCollection.doc(whiteboard.id).set(whiteboard).catch(error => {
      console.error('Updating whiteboard failed',error);
    }).then(() => {
      console.info('Saved to firebase sucessfully.');
    });
  }
}

 interface Whiteboard {
  id: string
  data: string
}