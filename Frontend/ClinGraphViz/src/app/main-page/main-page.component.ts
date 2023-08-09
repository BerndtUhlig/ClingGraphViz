import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SvgServiceService } from '../svg-service.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GraphRequest, GraphResponse } from '../types/messageTypes';
import { NodeOptions, Input_Option, Select_Option } from '../types/options';
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
  optionsList: (Input_Option|Select_Option)[] = []
  errStr: string = ""

  constructor(private svgService: SvgServiceService, private fb:FormBuilder, private aspService:ASPtranslateService){
  }
  ngAfterViewInit(): void {
    let emptyRequest = {"user_input":""} as GraphRequest
    this.svgService.put(emptyRequest).subscribe({next: (data) => {
      this.svgString = data.data;
      this.svgContainer.nativeElement.innerHTML = this.svgString
      this.nodeOptionsList = data.option_data; 
    }, error: (err) => {
      console.log("An error has occured: " + err)

    }})
  }

  retrieveSelectOptions(opt:(Input_Option|Select_Option)){
    if("options" in opt){
      return opt.options
    } else {
      return []
    }
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

  checkClick(event:Event){
    console.log("clicked box")
    let target = (event.target as HTMLElement)
    console.log(target.getAttribute("value"))
    console.log(target.getAttribute("checked"))
  }



  updateOptions(id:string, compType:string){
    this.optionsList.forEach((val) => {
      val.state = this.optionsForm.value[val.name]
    })
    this.currID = id
    let list = this.nodeOptionsList.filter((val) => {return val.id == id && val.compType == compType})
    if(list.length != 1){
      console.log(`Something went wrong: There is more than one or no node/edge with id ${id} in the options list!`)
    } else {
      this.optionsList = list.map(((val) => {return val.options})).flat()
      let group = new FormGroup({})
      this.optionsList.forEach((val) => {
        group.addControl(val.name,new FormControl(val.state))
      })
      /* 
      let group: Record<string, any> = {};
      this.optionsList.forEach((val) => {
        // TODO: Make a differentiation between different initial types (bool, num etc.) if necessary.
        console.log("val: ", val.state, val.name, val.type)
        group[val.name] = new FormControl(val.state)
        console.log("NAME VALUE ", val.name)
    })
    */
    this.optionsForm = group
    console.log(this.nodeOptionsList)
    //console.log(this.optionsForm)
    //console.log(this.testFG)
  }
}

  submitForm(){
    console.log("submitted!")
    this.errStr = ""
    let asp: string[] = []
    let form = this.optionsForm.value
    console.log(form)
    this.optionsList.forEach((val) => {
        val.state = form[val.name]
      })
    this.nodeOptionsList.forEach((val) => {val.options.forEach((opt) => {
      asp.push(this.aspService.toUserInputASP(val.compType,val.id,opt.type,opt.name,opt.state))
    })})
    let aspString:string = asp.join("\n")
    this.svgService.put({"user_input":aspString} as GraphRequest).subscribe({next: (data) => {
      console.log(data)
      this.svgString = data.data;
      this.svgContainer.nativeElement.innerHTML = this.svgString
      this.nodeOptionsList = data.option_data; 
      console.log(this.nodeOptionsList)
      this.optionsList = []
      this.updateOptions(this.currID,this.type)
    }, error: (err) => {
      this.errStr = err.message

    }})
  }



  
}
