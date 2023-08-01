import { Component, Input } from '@angular/core';
import { ASPtranslateService } from '../asptranslate.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-graph-options',
  templateUrl: './graph-options.component.html',
  styleUrls: ['./graph-options.component.scss']
})
export class GraphOptionsComponent {
  @Input() inputType = ''
  @Input() inputName = ''
  @Input() fc: FormControl = new FormControl('') 

  constructor(){}
  


}
