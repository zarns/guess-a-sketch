// server/FlipBook.ts

class FlipBook {
  private pages: Array<{ type: 'drawing' | 'guess', content: string }>;

  constructor(firstWord: string) {
    this.pages = [];
    this.pages.push({ type: 'guess', content: firstWord });
  }

  addGuess(guess: string) {
    this.pages.push({ type: 'guess', content: guess });
  }

  addDrawing(drawingDataUrl: string) {
    this.pages.push({ type: 'drawing', content: drawingDataUrl });
  }

  getPages() {
    return this.pages;
  }
}

export default FlipBook;
