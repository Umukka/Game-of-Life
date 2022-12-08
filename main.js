const CELL_SIZE = 18;
const CELL_GAP = 1;
const MATRIX_WIDTH = 70;
const MATRIX_HEIGHT = 35;

function createEmptyMatrix() {
  const matrix = [];
  for (let y = 0; y < MATRIX_HEIGHT; y++) {
    matrix.push([]);
    for (let x = 0; x < MATRIX_WIDTH; x++) {
      matrix[y].push(0);
    }
  }

  return matrix;
}

function drawCellMatrix(ctx, matrix) {
  ctx.fillStyle = "white";
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      if (matrix[y][x]) {
        ctx.fillRect(
          (CELL_SIZE + CELL_GAP)*x, (CELL_SIZE + CELL_GAP)*y,
          CELL_SIZE, CELL_SIZE
        );
      }
    }
  }
}

function calculateNextMatrix(currentMatrix) {
	const nextMatrix = createEmptyMatrix();
	for(let y=0; y < MATRIX_HEIGHT; y++) {
		for(let x=0; x < MATRIX_WIDTH; x++) {
			const neighbourCount = countCellNeighbours(y, x, currentMatrix);

			if(currentMatrix[y][x]) {
				if(neighbourCount == 2 || neighbourCount == 3) {
					nextMatrix[y][x] = 1
				}
			} else {
				if(neighbourCount == 3) {
					nextMatrix[y][x] = 1;
				}
			}
		}
	}

  return nextMatrix;

  function countCellNeighbours(cellY, cellX, matrix) {
    const left = Math.max(0, cellX-1); 
		const right = Math.min(cellX+1, matrix[0].length-1);
		const top = Math.max(0, cellY-1); 
		const bottom =  Math.min(cellY+1, matrix.length-1);

		let count = 0;
		for(let y=top; y<=bottom; y++) {
			for(let x=left; x<=right; x++) {
				count+=matrix[y][x]
			}
		}

		return count-matrix[cellY][cellX];
	}
}

// SETUP CANVAS
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

canvas.width = MATRIX_WIDTH * (CELL_SIZE + CELL_GAP);
canvas.height = MATRIX_HEIGHT * (CELL_SIZE + CELL_GAP);


// STATE
let gameMatrix = createEmptyMatrix();
let gameInterval = null;
let isPlaying = false;

// EVENT LISTENERS
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();

  const [cellY, cellX] = getClickedCell(
    e.clientX - rect.left,
    e.clientY - rect.top
  );

  gameMatrix[cellY][cellX] = !gameMatrix[cellY][cellX];

  function getClickedCell(mouseX, mouseY) {
    const cellX = Math.floor(mouseX / (CELL_SIZE + CELL_GAP));
    const cellY = Math.floor(mouseY / (CELL_SIZE + CELL_GAP));

    return [cellY, cellX];
  }
});

const btnStartStop = document.querySelector('#btn-gameToggle');
btnStartStop.onclick = e => {
	if(isPlaying) {
		clearInterval(gameInterval);
		btnStartStop.textContent = 'Start';
	} else {
		gameInterval = setInterval(() => {
			gameMatrix = calculateNextMatrix(gameMatrix);
		}, 50);
		btnStartStop.textContent = 'Stop';
	}

	isPlaying = !isPlaying;
}

const clearMatrixBtn = document.querySelector('#btn-matrixClear');
clearMatrixBtn.onclick = e => {
	gameMatrix = createEmptyMatrix();
}

// RENDER LOOP
requestAnimationFrame(function frame() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawCellMatrix(ctx, gameMatrix);
  requestAnimationFrame(frame);
});
