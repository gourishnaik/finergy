import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-section-comments',
  templateUrl: './section-comments.component.html',
  styleUrls: ['./section-comments.component.scss']
})
export class SectionCommentsComponent implements OnInit {
  @Input() comments: { label: string, text: string }[] = [];
  @Output() onReadMore: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onReadMoreClicked(ev) {
    this.onReadMore.emit(ev);
  }

}
