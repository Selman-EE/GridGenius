import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuBoardComponent } from './sudoku-board/sudoku-board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SudokuBoardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Grid Genius';
}
