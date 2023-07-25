import { ViewChild, Component, ElementRef } from '@angular/core';
import { SvgServiceService } from '../svg-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { GraphData, GraphRequest } from '../types/graph_request';
@Component({
  selector: 'app-ast-page',
  templateUrl: './ast-page.component.html',
  styleUrls: ['./ast-page.component.scss']
})
export class AstPageComponent {

  @ViewChild('dataContainer') dataContainer!: ElementRef;

  constructor(
    private svgService : SvgServiceService
  ) {}


  requestForm = new FormGroup({
    program: new FormControl(''),
    encoding: new FormControl('')
  })

  imageString: String = ''
  


  
  onSubmit(){
    console.log("onSubmit called")

    
    const formData = this.requestForm.value; 
    const graphreq = {ast:true, ...formData} as GraphRequest
    let observer = {
      next: (data:GraphData) => {
        this.imageString = data.data; 
      }
    }
    this.svgService.post(graphreq).subscribe(
      observer)
    console.log(this.dataContainer)
    this.dataContainer.nativeElement.innerHTML = this.imageString;
    }
    
  }



