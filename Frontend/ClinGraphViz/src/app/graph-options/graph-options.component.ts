import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-graph-options',
  templateUrl: './graph-options.component.html',
  styleUrls: ['./graph-options.component.scss']
})
export class GraphOptionsComponent {
  @Input() inputType = ''
  @Input() inputName = ''


  

}
