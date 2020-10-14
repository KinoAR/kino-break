typedef Point = {
	var x:Int;
	var y:Int;
}

typedef Rect = {
	> Point,
	var width:Int;
	var height:Int;
}

typedef Block = {
	> Rect,
	var color:String;
	var alive:Bool;
}

typedef Body2D = {
	var velocity:Point;
	var speed:Int;
}
