import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { SudokuBoardComponent } from './sudoku-board.component';

describe('SudokuBoardComponent', () => {
  let component: SudokuBoardComponent;
  let httpMock: HttpTestingController;  

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SudokuBoardComponent,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    component = TestBed.inject(SudokuBoardComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /** Ensure startGame() fetches the board */
  it('should fetch and update the board when startGame() is called', () => {
    const mockBoardResponse = {
      board: [
        [0, 1, 0, 4, 0, 0, 7, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 8],
        [0, 5, 0, 0, 7, 8, 0, 0, 0],
        [6, 0, 0, 0, 1, 0, 5, 0, 0],
        [0, 0, 3, 0, 0, 0, 8, 0, 0],
        [0, 0, 7, 0, 2, 0, 0, 0, 6],
        [0, 0, 0, 3, 6, 0, 0, 1, 0],
        [9, 0, 0, 0, 0, 0, 0, 0, 2],
        [0, 0, 5, 0, 0, 4, 0, 3, 0],
      ],
    };

    component.startGame();
    const req = httpMock.expectOne(
      `https://sugoku.onrender.com/board?difficulty=${component.difficulty}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockBoardResponse);

    expect(component.board).toEqual(mockBoardResponse.board);
    expect(component.initialBoard).toEqual(mockBoardResponse.board);
  });

  /** Ensure validateGame() calls API and updates gameWon */
  it('should call validate API and update gameWon if solved', () => {
    const mockValidationResponse = { status: 'solved' };

    component.validateGame();
    const req = httpMock.expectOne('https://sugoku.onrender.com/validate');
    expect(req.request.method).toBe('POST');
    req.flush(mockValidationResponse);

    expect(component.gameWon).toBeTrue();
  });
});
