# Draughts

One of my first projects made in React (and generally in programming).

This is an implementation of draughts as a web application built with React and Node.js.

The game features three modes:

1. **Local** – play with a friend (or yourself) on the same computer.  
2. **Bot** – play against a custom-made bot.  
3. **Online** – play against another player via the internet.  

The game also includes a chat with icons.

---

## Stack

### Front-end

- React  
- TypeScript  
- Socket.IO  

### Back-end

- Express  
- TypeScript  
- Socket.IO  

---

## About the Bot

Playing draughts with friends inspired me to create this application. After many games, I noticed a few strategies that gave me an advantage. These heuristics helped me make better decisions with less effort, and I wanted to turn them into an algorithm.

Some of the principles:
- Move your front pawns more than the rear ones – this reduces the chance of getting blocked or forced into bad moves.
- Prefer central positions over edge ones – they offer more control over the board.
- Focus on getting a King early – it opens more possibilities.

Of course, predicting the outcomes of your moves is still essential. These heuristics inspired me to encode a simple algorithm and build a basic bot.

Here’s how the bot works:

1. A model of the board is created, assigning value to every tile.  
2. Tiles closer to the opponent’s side are worth more, to encourage forward movement and kinging.  
3. Edge tiles are worth slightly less than central ones, encouraging control over the center.

Example board with tile values:

| 31  | 32  | 32  | 32  | 32  | 32  | 32  | 31  |
|-----|-----|-----|-----|-----|-----|-----|-----|
| 27  | 28  | 28  | 28  | 28  | 28  | 28  | 27  |
| 24  | 25  | 25  | 25  | 25  | 25  | 25  | 24  |
| 21  | 22  | 22  | 22  | 22  | 22  | 22  | 21  |
| 17  | 18  | 18  | 18  | 18  | 18  | 18  | 17  |
| 14  | 15  | 15  | 15  | 15  | 15  | 15  | 14  |
| 11  | 12  | 12  | 12  | 12  | 12  | 12  | 11  |
| 10  | 10  | 10  | 10  | 10  | 10  | 10  | 10  |

Then the bot simulates every possible move and evaluates the resulting board:
1. Simulate all legal moves and their resulting boards.
2. Multiply the number of friendly pawns by the value of their positions.
3. Do the same for the opponent and subtract their score.
4. The move with the highest score wins.
5. In case of a tie – a random move is chosen.

Additionally, the bot simulates short move chains:  
(bot move → opponent response → bot move)  
If any sequence leads to a significantly bad outcome, the bot discards it, assuming the opponent won't make the worst possible move.

---

## Motivation

The bot could definitely be better – at that time, my programming skills were quite limited.  
It doesn’t play kings very well, since the heuristics mostly apply to the early/mid-game.  

Still, I was proud when some of my friends lost games against it.

The main goal of this project was not to create the best bot possible, but to have fun turning strategy into code and improving my development skills.

I rewrote the entire application about three times, improving the code quality and architecture with each iteration.  
For reference, I kept the old bot logic in `oldEngine.ts` to remind myself how far I’ve come – my first attempt was in pure JavaScript (and yes, it was a mess 😄).
