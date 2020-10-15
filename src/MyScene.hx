import Types.Block;
import Types.Rect;
import Types.Point;

using NumExtensions;

// Screen Size is 128 x 128
class MyScene implements Scene {
	public var score:Int = 0;
	public var paddle:Rect = {
		x: 64,
		y: 120,
		width: 10,
		height: 1
	};

	public var blocks:Array<Block> = [];

	public var ball = {
		rect: {
			x: 64,
			y: 64,
			width: 2,
			height: 2
		},
		body: {
			velocity: {x: 0, y: 0},
			speed: 3
		}
	}

	public function new() {
		createBlocks();
		// Setup Ball
		var ballGravity = 1;
		ball.body.velocity.y = ballGravity;
	}

	public function createBlocks() {
		var screenWidth = 128;
		var screenHeight = 128;
		var blockSize = 2;
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
					color: rowColor,
					alive: true
				});
			}
		}
	}

	public function incrementScore() {
		score += 100;
	}

	public function resetGame() {
		Game.s = new MyScene();
	}

	public function update() {
		updateProcessGameState();
		updateControls();
		updateBallMovement();
		updateCollisionDetection();
	}

	public function updateProcessGameState() {
		if (ball.rect.y > 128) {
			resetGame();
		}
	}

	public function updateControls() {
		if (Controls.p(Keys.LEFT)) {
			paddle.x -= 1;
		}

		if (Controls.p(Keys.RIGHT)) {
			paddle.x += 1;
		}
	}

	public function updateBallMovement() {
		// Clamp Velocity to prevent ball from going outside zone
		ball.body.velocity.y = cast ball.body.velocity.y.clamp(-50, 50);
		ball.rect.y += ball.body.velocity.y;
		ball.rect.x += ball.body.velocity.x;
	}

	public function updateCollisionDetection() {
		// Handle ball collision with paddle
		if (isCollided(ball.rect, paddle)) {
			trace('Collided with paddle');
			// ball.rect.y = paddle.y - ball.rect.height;
			var centerPaddleX = (paddle.x + paddle.width / 2);
			if (ball.rect.x < centerPaddleX) {
				ball.body.velocity.x = 1;
			}

			if (ball.rect.x > centerPaddleX) {
				ball.body.velocity.x = -1;
			}
			ball.body.velocity.y *= -1;
			ball.body.velocity.x *= -1;
		}

		handleWallCollisions();

		// Handle Block Collision
		for (block in blocks) {
			if (isCollided(ball.rect, block) && block.alive) {
				trace('Collided with block');
				// ball.rect.y = paddle.y - ball.rect.height;
				incrementScore();
				block.alive = false;
				trace(block.x, block.y);
				trace(ball.body.velocity.y);
				ball.body.velocity.y *= -1;
				trace(ball.body.velocity.y);
				ball.body.velocity.x *= -1;
			}
		}
	}

	public function handleWallCollisions() {
		// Handle Wall Collision
		if (ball.rect.x < 0) {
			ball.body.velocity.x *= -1;
		}
		if (ball.rect.x > 128) {
			ball.body.velocity.x *= -1;
		}
		if (ball.rect.y < 0) {
			ball.body.velocity.y *= -1;
		}
	}

	public function isCollided(body:Rect, otherBody:Rect) {
		var topRightCorner = {
			x: body.x + body.width,
			y: body.y,
		};
		var bottomRightCorner = {
			x: body.x + body.width,
			y: body.y + body.height
		}
		var bottomLeftCorner = {
			x: body.x,
			y: body.y + body.height
		}
		return (body.x.withinRangef(otherBody.x, otherBody.x + otherBody.width)
			&& body.y.withinRangef(otherBody.y, otherBody.y + otherBody.height))
			|| (bottomRightCorner.x.withinRangef(otherBody.x, otherBody.x + otherBody.width)
				&& bottomRightCorner.y.withinRangef(otherBody.y, otherBody.y + otherBody.height))
			|| (bottomLeftCorner.x.withinRangef(otherBody.x, otherBody.x + otherBody.width)
				&& bottomLeftCorner.y.withinRangef(otherBody.y, otherBody.y + otherBody.height))
			|| (bottomRightCorner.x.withinRangef(otherBody.x, otherBody.x + otherBody.width)
				&& topRightCorner.y.withinRangef(otherBody.y, otherBody.y + otherBody.height));
	}

	public function draw() {
		clr();
		drawBlocks();
		drawBall();
		drawPaddle();
		drawScore();
	}

	public function drawScore() {
		txt('white', 'Score: ${score}', 58, 30);
	}

	public function drawBlocks() {
		for (block in blocks) {
			if (block.alive) {
				frect(block.color, block.x, block.y, block.width, block.height);
				// rect('white', block.x, block.y, block.width, block.height);
			}
		}
	}

	public function drawBall() {
		var ballRect = ball.rect;
		frect('lightBlue', ballRect.x, ballRect.y, ballRect.width, ballRect.height);
	}

	public function drawPaddle() {
		frect('red', paddle.x, paddle.y, paddle.width, paddle.height);
	}
}
