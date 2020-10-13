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

	public function new() {}

	public function update() {
		if (Controls.p(Keys.LEFT)) {
			paddle.x -= 1;
		}

		if (Controls.p(Keys.RIGHT)) {
			paddle.x += 1;
		}
	}

	public function draw() {
		clr();

		drawPaddle();
	}

	public function drawPaddle() {
		frect('red', paddle.x, paddle.y, paddle.width, paddle.height);
	}
}
