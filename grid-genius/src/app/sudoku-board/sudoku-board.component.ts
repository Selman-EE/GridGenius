import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  Board,
  BoardResponse,
  Difficulty,
  SolveResponse,
  ValidateResponse,
  SudokuRequest,
} from '../../app/models/sudoku.model';

@Component({
  selector: 'app-sudoku-board',
  templateUrl: './sudoku-board.component.html',
  styleUrls: ['./sudoku-board.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class SudokuBoardComponent implements OnInit {
  board: Board = []; // Current board
  initialBoard: Board = []; // Stores original board to track pre-filled cells
  isLoading: boolean = false;
  difficulty: Difficulty = 'random';
  gameWon: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.startGame();
  }

  // Fetch the initial Sudoku board from API
  startGame(): void {
    this.isLoading = true;
    const boardUrl = `https://sugoku.onrender.com/board?difficulty=${this.difficulty}`;

    this.http.get<BoardResponse>(boardUrl).subscribe({
      next: (response) => {
        this.board = response.board.map((row) => [...row]);
        this.initialBoard = response.board.map((row) => [...row]);
        this.isLoading = false;
      },
      error: (error) => {
        //console.error('startGame failed: ', error);
        alert('Failed to load Sudoku board. Please try again.');
        this.isLoading = false;
      },
    });
  }

  // check disabled cell (pre-filled)
  isCellDisabled(row: number, col: number): boolean {
    return this.initialBoard[row][col] !== 0;
  }

  onInput(event: Event, row: number, col: number): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);

    if (isNaN(value) || value < 1 || value > 9) {
      this.board[row][col] = 0;
      input.value = '';
    } else {
      this.board[row][col] = value;
    }
    //console.log("row:" + row , "col:" + col, "value:" + value);
  }

  // Validate the current Sudoku board
  validateGame(): void {
    this.isLoading = true;
    const validationUrl = 'https://sugoku.onrender.com/validate';
    const payload: SudokuRequest = { board: this.board };
    //console.log(payload);
    this.http.post<ValidateResponse>(validationUrl, payload).subscribe({
      next: (response) => {
        this.gameWon = response.status === 'solved';
        alert(this.gameWon ? 'Congratulations! You won!' : 'Keep trying!');
        this.isLoading = false;
      },
      error: (error) => {
        //console.error('validateGame failed: ', error);
        alert('Error validating Sudoku.');
        this.isLoading = false;
      },
    });
  }

  // Solve the Sudoku board
  solveGame(): void {
    this.isLoading = true;
    const solveUrl = 'https://sugoku.onrender.com/solve';
    const payload: SudokuRequest = { board: this.board };

    this.http.post<SolveResponse>(solveUrl, payload).subscribe({
      next: (response) => {
        if (response.status === 'solved') {
          this.board = response.solution.map((row) => [...row]);
          alert('Sudoku solved!');
        } else {
          alert('Could not solve Sudoku.');
        }
        this.isLoading = false;
      },
      error: (error) => {
        //console.error('solveGame failed:', error);
        alert('Error solving Sudoku.');
        this.isLoading = false;
      },
    });

    // TODO: When we get the solved sudoku result, mark them in the grid. The successful answer will match green and the wrong answers will be red. This way the player can see their correct guesses
  }
}

//TODO:
// 1. Remove alerts and implement better solution
// 2. Add log library
// 3. Implement enviorments
// 4. Loading gif must middle of the screen and it must be make trancperncy to all elements
// 5. Responsive design, and better error handling
