export type Difficulty = "easy" | "medium" | "hard" | "random";
export type Board = number[][];

export type BoardResponse = {
  board: Board;
};

export type SudokuRequest = {
  board: Board;
};

export type SolveResponse = {
  difficulty: Difficulty;
  solution: Board;
  status: "solved" | "broken" | "unsolvable";
};

export type ValidateResponse = {
  status: "solved" | "unsolved";
};
