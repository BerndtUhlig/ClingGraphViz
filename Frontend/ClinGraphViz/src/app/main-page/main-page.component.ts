import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SvgServiceService } from '../svg-service.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GraphRequest, GraphResponse } from '../types/messageTypes';
import { NodeOptions, Option } from '../types/options';
import { ASPtranslateService } from '../asptranslate.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements AfterViewInit {

  @ViewChild("svgContainer")
  svgContainer!:ElementRef;

  optionsForm!: FormGroup
  svgString = ""
  type = ""
  nodeOptionsList:NodeOptions[] = []
  currID: string = ""
  optionsList: Option[] = []

  constructor(private svgService: SvgServiceService, private fb:FormBuilder, private aspService:ASPtranslateService){
  }
  ngAfterViewInit(): void {
    let emptyRequest = {"user_input":""} as GraphRequest
    this.fetchSvg(emptyRequest)
    this.svgContainer.nativeElement.innerHTML = this.svgString
  }

  handleNodeClick(event:Event){
    let element = event.target as HTMLElement
    let parent = element.parentNode as HTMLElement
    if(parent !== null && parent.nodeName == 'g'){
      if(parent.firstChild !== null && parent.firstChild.nodeName == 'title'){
        const compId = parent.firstChild.textContent
        if(compId !== null && compId !== ""){
          if(parent.id.startsWith("node")){
            this.updateOptions(compId, "node")
          } else if(element.id.startsWith("edge")){
            this.updateOptions(compId, "edge")
          }
        }
      }
    }
  }

  updateOptions(id:string, compType:string){
    this.currID = id
    let list = this.nodeOptionsList.filter((val) => {return val.id == id && val.compType == compType})
    if(list.length != 1){
      console.log(`Something went wrong: There is more than one node/edge with id ${id} in the options list!`)
    } else {
      this.optionsList = list.map(((val) => {return val.options})).flat()
      let group: Record<string, any> = {};
      this.optionsList.forEach((val) => {
        // TODO: Make a differentiation between different initial types (bool, num etc.) if necessary.
        group[val.name] = [''] 
    })
    this.optionsForm = this.fb.group(group)
  }
}

  submitForm(){
    let asp: string[] = []
    let form = this.optionsForm.value
    this.optionsList.forEach((val) => {
      const formval = form[val.name]
      asp.push(this.aspService.toUserInputASP(this.type,this.currID.toString(),val.type,val.name,formval))
    })
    let aspString:string = asp.join("\n")
    this.fetchSvg({"user_input":aspString} as GraphRequest)
  }

  fetchSvg(request:GraphRequest){
    this.svgService.put(request).subscribe({next: (data) => {
      this.svgString = data.data;
      this.nodeOptionsList = data.option_data; 
    }, error: (err) => {
      console.log("An error has occured: " + err)

    }})
  }


  
}
