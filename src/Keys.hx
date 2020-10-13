// Refactor Later to use event.key for modern browsers
enum abstract Keys(Int) from Int to Int {
	// Stand Movement Buttons
	public var LEFT = 37;
	public var UP = 38;
	public var RIGHT = 39;
	public var DOWN = 40;
	public var W = 87;
	public var A = 65;
	public var S = 83;
	public var D = 68;
	// Confirm  & Cancel Buttons
	public var Z = 90;
	public var X = 88;
	public var C = 67;
	public var ESC = 27;
	public var SPACE = 32;
	public var ENTER = 13;
}
