import { Component, OnInit } from '@angular/core';
import {fabric} from 'fabric';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../login/auth.service';
import { WhiteboardService } from './whiteboard.service';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.sass']
})
export class WhiteboardComponent implements OnInit {
  canvas?: fabric.Canvas;
  uid?: string;

  constructor(
    private whiteboardService: WhiteboardService,
    private authService: AuthService
  ) {
    console.log('Whiteboard Constructor Called');
    console.log(BehaviorSubject.create(authService.user$).value) 
  }

  async ngOnInit(): Promise<void> {
    this.uid = (await this.authService.getUserId())!;
    console.log('User Id: ', this.uid);
    this._setupCanvas();
    this._loadCanvasData(this.uid);
  }

  private handleRender(e: fabric.IEvent<Event>){
    const canvasData = JSON.stringify(e.target?.canvas); 
    this.saveCanvas(canvasData);
  }

  private saveCanvas(canvasData: string){
    console.info('Canvas Data :', canvasData);
    const whiteboard = { userId:this.uid!, data: canvasData }
    this.whiteboardService.updateWhiteboard(whiteboard);
  }

  private _setupCanvas(){
    this.canvas = new fabric.Canvas('whiteboard',{
      isDrawingMode: true,
    });
    this.canvas.on('object:added', this.handleRender.bind(this)); // 'modified, removed'
  }
  
  private async _loadCanvasData(uid: string){
  console.log('User Id: ', uid)
   const whiteboardData =  this.whiteboardService.loadWhiteboard(uid);
   console.log('Whiteboard Data: ', whiteboardData);
   if(whiteboardData){
     this.canvas?.loadFromJSON(whiteboardData.data, ()=>{});
   }
  }
}