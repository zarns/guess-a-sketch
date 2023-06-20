// server/FlipBook.ts

class FlipBook {
  private pages: Array<{ username: string, type: 'drawing' | 'guess', content: string }>;

  constructor(firstWord: string) {
    this.pages = [];
    this.pages.push({ username: '', type: 'guess', content: firstWord });
  }

  addGuess(guesserUsername: string, guess: string) {
    this.pages.push({ username: guesserUsername, type: 'guess', content: guess });
  }

  addDrawing(artistUsername: string, drawingDataUrl: string) {
    this.pages.push({ username: artistUsername, type: 'drawing', content: drawingDataUrl });
  }

  getPages() {
    return this.pages;
  }
}

export default FlipBook;
