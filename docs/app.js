// Generated by Haxe 4.1.3
(function ($hx_exports, $global) { "use strict";
var Controls = function() { };
Controls.__name__ = true;
Controls.init = function() {
	window.document.onkeydown = function(e) {
		Controls.k.h[e.keyCode] = true;
	};
	window.document.onkeyup = function(e) {
		Controls.k.h[e.keyCode] = false;
	};
	Game.ctx.canvas.onpointerdown = function(e) {
		Controls.k.h[-1 - e.button] = true;
	};
	Game.ctx.canvas.onpointerup = function(e) {
		Controls.k.h[-1 - e.button] = false;
	};
	Game.ctx.canvas.onpointermove = function(e) {
		return Controls.M = { x : Math.floor(e.offsetX / Game.zx), y : Math.floor(e.offsetY / Game.zy)};
	};
	Game.ctx.canvas.ontouchstart = function(e) {
		Controls.k.h[-1] = true;
	};
	Game.ctx.canvas.ontouchend = function(e) {
		Controls.k.h[-1] = false;
	};
	Game.ctx.canvas.ontouchmove = function(e) {
		return Controls.M = { x : Math.floor(e.touches.item(0).clientX / Game.zx), y : Math.floor(e.touches.item(0).clientY / Game.zy)};
	};
};
Controls.p = function(n) {
	if(Controls.k.h.hasOwnProperty(n)) {
		return Controls.k.h[n];
	} else {
		return false;
	}
};
var DrawTools = function() { };
DrawTools.__name__ = true;
DrawTools.clr = function(col) {
	if(col != null) {
		DrawTools.frect(col,0,0,Game.w,Game.h);
	} else {
		Game.ctx.clearRect(0,0,Game.w,Game.h);
	}
};
DrawTools.frect = function(col,x,y,w,h) {
	Game.ctx.fillStyle = col;
	Game.ctx.fillRect(x,y,w,h);
};
DrawTools.txt = function(col,text,x,y,maxWidth) {
	Game.ctx.fillStyle = col;
	Game.ctx.font = "10px Verdana";
	Game.ctx.fillText(text,x,y,maxWidth);
};
var Game = $hx_exports["Game"] = function() { };
Game.__name__ = true;
Game.init = function(p,_w,_h) {
	window.document.oncontextmenu = function(e) {
		return e.preventDefault();
	};
	var c = window.document.createElement("canvas");
	var el = window.document.getElementById(p);
	el.appendChild(c);
	Game.w = c.width = _w;
	Game.h = c.height = _h;
	Game.ctx = c.getContext("2d",null);
	Controls.init();
	window.onresize = function(e) {
		Game.zx = el.offsetWidth / _w;
		return Game.zy = el.offsetHeight / _h;
	};
	window.onresize();
	window.requestAnimationFrame(Game.loop);
	Main.main();
};
Game.loop = function(e) {
	Game.t = e;
	Game.s.update();
	Game.s.draw();
	window.requestAnimationFrame(Game.loop);
};
var Main = function() { };
Main.__name__ = true;
Main.main = function() {
	Game.s = new MyScene();
};
Math.__name__ = true;
var MyScene = function() {
	this.ball = { rect : { x : 64, y : 64, width : 2, height : 2}, body : { velocity : { x : 0, y : 0}, speed : 3}};
	this.blocks = [];
	this.paddle = { x : 64, y : 120, width : 10, height : 1};
	this.score = 0;
	this.createBlocks();
	this.ball.body.velocity.y = 1;
};
MyScene.__name__ = true;
MyScene.prototype = {
	createBlocks: function() {
		var rowColor = "red";
		var _g = 0;
		while(_g < 3) {
			var y = _g++;
			switch(y) {
			case 0:
				rowColor = "red";
				break;
			case 1:
				rowColor = "blue";
				break;
			case 2:
				rowColor = "purple";
				break;
			default:
			}
			var _g1 = 0;
			while(_g1 < 64) this.blocks.push({ x : 2 * _g1++, y : 2 * y, width : 2, height : 2, color : rowColor, alive : true});
		}
	}
	,incrementScore: function() {
		this.score += 100;
	}
	,resetGame: function() {
		Game.s = new MyScene();
	}
	,update: function() {
		this.updateProcessGameState();
		this.updateControls();
		this.updateBallMovement();
		this.updateCollisionDetection();
	}
	,updateProcessGameState: function() {
		if(this.ball.rect.y > 128) {
			this.resetGame();
		}
	}
	,updateControls: function() {
		if(Controls.p(37)) {
			this.paddle.x -= 1;
		}
		if(Controls.p(39)) {
			this.paddle.x += 1;
		}
	}
	,updateBallMovement: function() {
		this.ball.body.velocity.y = Math.round(Math.min(Math.max(this.ball.body.velocity.y,-50),50));
		this.ball.rect.y += this.ball.body.velocity.y;
		this.ball.rect.x += this.ball.body.velocity.x;
	}
	,updateCollisionDetection: function() {
		if(this.isCollided(this.ball.rect,this.paddle)) {
			haxe_Log.trace("Collided with paddle",{ fileName : "src/MyScene.hx", lineNumber : 111, className : "MyScene", methodName : "updateCollisionDetection"});
			var centerPaddleX = this.paddle.x + this.paddle.width / 2;
			if(this.ball.rect.x < centerPaddleX) {
				this.ball.body.velocity.x = 1;
			}
			if(this.ball.rect.x > centerPaddleX) {
				this.ball.body.velocity.x = -1;
			}
			this.ball.body.velocity.y *= -1;
			this.ball.body.velocity.x *= -1;
		}
		this.handleWallCollisions();
		var _g = 0;
		var _g1 = this.blocks;
		while(_g < _g1.length) {
			var block = _g1[_g];
			++_g;
			if(this.isCollided(this.ball.rect,block) && block.alive) {
				haxe_Log.trace("Collided with block",{ fileName : "src/MyScene.hx", lineNumber : 130, className : "MyScene", methodName : "updateCollisionDetection"});
				this.incrementScore();
				block.alive = false;
				haxe_Log.trace(block.x,{ fileName : "src/MyScene.hx", lineNumber : 134, className : "MyScene", methodName : "updateCollisionDetection", customParams : [block.y]});
				haxe_Log.trace(this.ball.body.velocity.y,{ fileName : "src/MyScene.hx", lineNumber : 135, className : "MyScene", methodName : "updateCollisionDetection"});
				this.ball.body.velocity.y *= -1;
				haxe_Log.trace(this.ball.body.velocity.y,{ fileName : "src/MyScene.hx", lineNumber : 137, className : "MyScene", methodName : "updateCollisionDetection"});
				this.ball.body.velocity.x *= -1;
			}
		}
	}
	,handleWallCollisions: function() {
		if(this.ball.rect.x < 0) {
			this.ball.body.velocity.x *= -1;
		}
		if(this.ball.rect.x > 128) {
			this.ball.body.velocity.x *= -1;
		}
		if(this.ball.rect.y < 0) {
			this.ball.body.velocity.y *= -1;
		}
	}
	,isCollided: function(body,otherBody) {
		var bottomRightCorner_x = body.x + body.width;
		var tmp;
		var tmp1;
		var tmp2;
		var num = body.x;
		if(num >= otherBody.x && num <= otherBody.x + otherBody.width) {
			var num = body.y;
			tmp2 = num >= otherBody.y && num <= otherBody.y + otherBody.height;
		} else {
			tmp2 = false;
		}
		if(!tmp2) {
			var num = bottomRightCorner_x;
			if(num >= otherBody.x && num <= otherBody.x + otherBody.width) {
				var num = body.y + body.height;
				tmp1 = num >= otherBody.y && num <= otherBody.y + otherBody.height;
			} else {
				tmp1 = false;
			}
		} else {
			tmp1 = true;
		}
		if(!tmp1) {
			var num = body.x;
			if(num >= otherBody.x && num <= otherBody.x + otherBody.width) {
				var num = body.y + body.height;
				tmp = num >= otherBody.y && num <= otherBody.y + otherBody.height;
			} else {
				tmp = false;
			}
		} else {
			tmp = true;
		}
		if(!tmp) {
			var num = bottomRightCorner_x;
			if(num >= otherBody.x && num <= otherBody.x + otherBody.width) {
				var num = body.y;
				if(num >= otherBody.y) {
					return num <= otherBody.y + otherBody.height;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	,draw: function() {
		DrawTools.clr();
		this.drawBlocks();
		this.drawBall();
		this.drawPaddle();
		this.drawScore();
	}
	,drawScore: function() {
		DrawTools.txt("white","Score: " + this.score,58,30);
	}
	,drawBlocks: function() {
		var _g = 0;
		var _g1 = this.blocks;
		while(_g < _g1.length) {
			var block = _g1[_g];
			++_g;
			if(block.alive) {
				DrawTools.frect(block.color,block.x,block.y,block.width,block.height);
			}
		}
	}
	,drawBall: function() {
		var ballRect = this.ball.rect;
		DrawTools.frect("lightBlue",ballRect.x,ballRect.y,ballRect.width,ballRect.height);
	}
	,drawPaddle: function() {
		DrawTools.frect("red",this.paddle.x,this.paddle.y,this.paddle.width,this.paddle.height);
	}
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var haxe_Log = function() { };
haxe_Log.__name__ = true;
haxe_Log.formatOutput = function(v,infos) {
	var str = Std.string(v);
	if(infos == null) {
		return str;
	}
	var pstr = infos.fileName + ":" + infos.lineNumber;
	if(infos.customParams != null) {
		var _g = 0;
		var _g1 = infos.customParams;
		while(_g < _g1.length) str += ", " + Std.string(_g1[_g++]);
	}
	return pstr + ": " + str;
};
haxe_Log.trace = function(v,infos) {
	var str = haxe_Log.formatOutput(v,infos);
	if(typeof(console) != "undefined" && console.log != null) {
		console.log(str);
	}
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
haxe_ds_IntMap.__name__ = true;
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
String.__name__ = true;
Array.__name__ = true;
js_Boot.__toStr = ({ }).toString;
Controls.M = { x : 0, y : 0};
Controls.k = new haxe_ds_IntMap();
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, {});
