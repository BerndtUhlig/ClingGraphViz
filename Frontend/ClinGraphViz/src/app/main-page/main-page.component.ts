import { Component } from '@angular/core';
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
export class MainPageComponent {

  optionsForm!: FormGroup
  svgString = ""
  type = ""
  nodeOptionsList:NodeOptions[] = []
  currID: number = -1
  optionsList: Option[] = []

  constructor(private svgService: SvgServiceService, private fb:FormBuilder, private aspService:ASPtranslateService){
  }

  updateOptions(id:number){
    this.currID = id
    let list = this.nodeOptionsList.filter((val) => {return val.id == id})
    if(list.length != 1){
      console.log(`Something went wrong: There is more than one node with id ${id} in the options list!`)
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

  ngOnInit(){
    let emptyRequest = {"user_input":""} as GraphRequest
    this.fetchSvg(emptyRequest)
  }

  
}
