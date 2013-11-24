// Usage : less2stylusDir('../src/css/');

var fs = require('fs');

// this less 2 stylus conversion script make a stylus easy to read syntax
// - let the braces
// - replace the @ for var as $
// - let semicolons

function less2stylus(less)
{
	return less
		// remove opening brackets
		//.replace(/^(\ *)(.+)\ +\{\ *\n?\ */mg, "$1$2\n$1  ")
		// remove opening brackets
		//.replace(/^(\ *)([^\ \n]+)\ +\{\ *\n?\ */mg, "$1$2\n$1  ")
		 // remove opening brackets again (some random cases I'm too lazy to think through)
		//.replace(/\ *\{\ *\n*/g, "\n")
		 // remove closing brackets
		//.replace(/\ *\}\ *\n*/g, "\n")

		// remove semicolons
		//.replace(/\;\ *?$/gm, "")

		// replace @variable: with $variable =
		.replace(/@(\w+):(\ *)\ /g, function(_, $1, $2) {
			return "$" + $1 + $2 + " = ";
		})
		// replace all other variable call, careful with native @{keyword}
		.replace(/\@(\w+)/g, function(_, $1) {
			if ($1 === "import" || $1 == "media") {
				return _;
			} else {
				return "$" + $1;
			}
		})

		// replace @{variable} with {$variable}
		.replace(/@\{(\w+)\}/g, function(_, $1) {
			return '{$' + $1 +'}';
		})

		// replace mixins from .border-radius(4px) to border-radius(4px)
		.replace(/\.([\w-]+) ?\(/g, "$1(")

		// switch this two lines if you want to disable @extend behavior
		//.replace(/(\.[a-zA-Z][\w-]+;)/g, "@extend $1") // replace mixins without args by @extend
		.replace(/\.([a-zA-Z][\w-]+);/g, "$1();") // replace mixins without args

		.replace(/(\ *)(.+)>\ *([\w-]+)\(/g, "$1$2>\n$1  $3(")

		// ms filter fix
		.replace(/filter: ([^'"\n;]+)/g, 'filter: unquote("$1")')

		// url data
		.replace(/: ?url\(([^'"\)]+)\)/g, ': url(unquote("$1"))')

		// rename (useless)
		.replace(/\.less/g, ".styl")

		// tinies optimizations

		// make all commas have 1 space after them
		.replace(/,\ */g, ", ")

		// replace 0.x by .x
		.replace(/(:\ )0\.([0-9])+/g, ".$2 ")

		// remove trailing whitespace
		.replace(/\ *$/g, "");
}

function less2stylusDir(dir)
{
	var names = fs.readdirSync(dir);

	for (var _j = 0, _len = names.length; _j < _len; _j++) {
		var name = names[_j];
		if (name.match(/\.less$/))
		{
			var stylus = less2stylus(fs.readFileSync(dir + "/" + name, "utf-8"));
			fs.writeFileSync(dir + "/" + (name.replace(/\.less$/, ".styl")), stylus);
		}
	}
}

less2stylusDir('.');
// if you have a folder tree, add each folder, or use glob()...