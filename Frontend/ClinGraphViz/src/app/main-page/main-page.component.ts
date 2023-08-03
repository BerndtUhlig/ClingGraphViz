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

  optionsForm: FormGroup = new FormGroup({})
  svgString = ""
  type = ""
  nodeOptionsList:NodeOptions[] = []
  currID: string = ""
  optionsList: Option[] = []

  constructor(private svgService: SvgServiceService, private fb:FormBuilder, private aspService:ASPtranslateService){
  }
  ngAfterViewInit(): void {
    let emptyRequest = {"user_input":""} as GraphRequest
    this.svgService.mock(emptyRequest).subscribe({next: (data) => {
      this.svgString = data.data;
      this.svgContainer.nativeElement.innerHTML = this.svgString
      this.nodeOptionsList = data.option_data; 
    }, error: (err) => {
      console.log("An error has occured: " + err)

    }})
  }

  handleNodeClick(event:Event){
    console.log("clicked")
    let element = event.target as HTMLElement
    let parent = element.parentNode as HTMLElement
    console.log(element)
    console.log(parent)
    if(parent !== null && parent.nodeName == 'g'){
      console.log("past first")
      let title = parent.getElementsByTagName("title")[0]
      console.log(title)
      if(title !== null){
        console.log("past second")
        const compId = title.textContent
        if(compId !== null && compId !== ""){
          if(parent.id.startsWith("node")){
            console.log("clicked")
            this.type = "node"
            this.updateOptions(compId, "node")
          } else if(element.id.startsWith("edge")){
            console.log("clicked")
            this.type = "edge"
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
      console.log(`Something went wrong: There is more than one or no node/edge with id ${id} in the options list!`)
    } else {
      this.optionsList = list.map(((val) => {return val.options})).flat()
      let group: Record<string, any> = {};
      this.optionsList.forEach((val) => {
        // TODO: Make a differentiation between different initial types (bool, num etc.) if necessary.
        if (val.type == "checkbox"){
          group[val.name] = [true]
        } else {
          group[val.name] = ['']
        }
        console.log("NAME VALUE ", val.name)
    })
    this.optionsForm = this.fb.group(group)
  }
}

  submitForm(){
    console.log("submitted!")
    let asp: string[] = []
    let form = this.optionsForm.value
    console.log(form)
    this.optionsList.forEach((val) => {
      let formval = form[val.name]
      console.log("FORM VAL: ",formval)
      asp.push(this.aspService.toUserInputASP(this.type,this.currID.toString(),val.type,val.name,formval))
    })
    let aspString:string = asp.join("\n")
    this.svgService.mock({"user_input":aspString} as GraphRequest).subscribe({next: (data) => {
      console.log(data)
      this.svgString = data.data;
      console.log("svg string ", this.svgString)
      this.svgContainer.nativeElement.innerHTML = this.svgString
      this.nodeOptionsList = data.option_data; 
    }, error: (err) => {
      console.log("An error has occured: " + err)

    }})
  }



  
}
