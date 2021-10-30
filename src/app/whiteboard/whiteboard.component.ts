import { Component, OnInit } from '@angular/core';
import {fabric} from 'fabric';
import { WhiteboardService } from './whiteboard.service';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.sass']
})
export class WhiteboardComponent implements OnInit {
  canvas?: fabric.Canvas;

  constructor(private whiteboardService: WhiteboardService) { }

  async ngOnInit(): Promise<void> {
    this._setupCanvas();
    await this._loadCanvasData();
  }

  private handleRender(e: fabric.IEvent<Event>){
    const canvasData = JSON.stringify(e.target?.canvas); 
    this.saveCanvas(canvasData);
  }

  private saveCanvas(canvasData: string){
    console.info('Canvas Data :', canvasData);
    const whiteboard = { id:'1', data: canvasData }
    this.whiteboardService.updateWhiteboard(whiteboard);
  }

  private _setupCanvas(){
    this.canvas = new fabric.Canvas('whiteboard',{
      isDrawingMode: true,
    });
    this.canvas.on('object:added', this.handleRender.bind(this)); // 'modified, removed'
  }
  
  private async _loadCanvasData(){
   const whiteboardData = await this.whiteboardService.loadWhiteboard("1");
   console.log('Whiteboard Data: ', whiteboardData);
   if(whiteboardData){
     this.canvas?.loadFromJSON(whiteboardData.data, ()=>{});
   }
  }
}
