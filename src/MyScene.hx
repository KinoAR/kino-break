import Types.Block;
import Types.Rect;
import Types.Point;

// Screen Size is 128 x 128
class MyScene implements Scene {
	public var paddle:Rect = {
		x: 64,
		y: 120,
		width: 10,
		height: 1
	};

	public var blocks:Array<Block> = [];

	public var ball:Rect = {
		x: 64,
		y: 64,
		width: 2,
		height: 2
	}

	public function new() {
		createBlocks();
	}

	public function createBlocks() {
		var screenWidth = 128;
		var screenHeight = 128;
		var blockSize = 4;
		var blockRowX = (screenWidth / blockSize).floor();
		var numBlockRows = 3;
		var rowColor = 'red';
		for (y in 0...numBlockRows) {
			switch (y) {
				case 0:
					rowColor = 'red';
				case 1:
					rowColor = 'blue';
				case 2:
					rowColor = 'purple';
				case _:
					// Do nothing
			}
			for (x in 0...blockRowX) {
				blocks.push({
					x: blockSize * x,
					y: blockSize * y,
					width: blockSize,
					height: blockSize,
					color: rowColor
				});
			}
		}
	}

	public function update() {
		if (Controls.p(Keys.LEFT)) {
			paddle.x -= 1;
		}

		if (Controls.p(Keys.RIGHT)) {
			paddle.x += 1;
		}
	}

	public function updateBallMovement() {}

	public function draw() {
		clr();
		drawBlocks();
		drawBall();
		drawPaddle();
	}

	public function drawBlocks() {
		for (block in blocks) {
			frect(block.color, block.x, block.y, block.width, block.height);
		}
	}

	public function drawBall() {
		frect('lightBlue', ball.x, ball.y, ball.width, ball.height);
	}

	public function drawPaddle() {
		frect('red', paddle.x, paddle.y, paddle.width, paddle.height);
	}
}
