window.onload = function(e){

    var canvas = document.getElementById("main");
    var context = canvas.getContext('2d');
    if (!context) {
        alert("HTML canvas 2d context is not supported in your environment...")
        return;
    }

    var std15 = newStd15(context,64*2*9,64*2*3,9,3);


    var delay_formula = window.sessionStorage.getItem("sansu_speed");
    var delay_answer = 500;
    if (delay_formula == null) {
	delay_formula = 2000;
    }
    document.getElementById("speed_range").value = delay_formula;
    document.getElementById("speed").innerHTML = secString(delay_formula);
    document.getElementById("speed_range").addEventListener("change",function(e) {
	delay_formula = e.target.value;
	document.getElementById("speed").innerHTML = secString(delay_formula);
	window.sessionStorage.setItem("sansu_speed",delay_formula);
    });

    function secString(ms) {
	return (ms / 1000).toString() + " sec";
    }

    var query = parseUrlQuery(window.location.search.substring(1));

    function parseUrlQuery(query) {
	if (query == "") return {};
	var r = {};
	query.split("&").map(function(p) {
	    var kv = p.split("=");
	    r[kv[0]] = kv[1];
	});
	return r;
    }

    var qs;
    switch(query.op) {
    case "add": {
	var x = parseInt(query.x);
	if(isNaN(x) || x < 1) {
	    qs = createAdditions2(1,9); // all
	} else {
	    qs = createAdditions(x,1,9);
	}
	break;
    }
    case "mul": {
	var x = parseInt(query.x);
	if(isNaN(x) || x < 1) {
	    qs = createMultiplications2(1,9); // all
	} else {
	    qs = createMultiplications(x,1,9);
	}
	break;
    }
    case "sub": {
	var x = parseInt(query.x);
	if(isNaN(x) || x < 2) {
	    qs = createSubtractions2(1,12) // all
	} else {
	    qs = createSubtractions(x);
	}
	break;
    }
    default: {
	qs = createMultiplications2(1,9);
	break;
    }
    }

    if (query.s == "1") {
	qs = shuffle(qs);
    }
    
    run (qs);
    
    function run (questions) {
	if (questions.length == 0) return;
	var i = 0;
	var f = function () {
	    var q = questions [i];
	    showFormula(q.op,q.x,q.y);
	    setTimeout(function() {
		showAnswer(q.op,q.x,q.y);
		if(++i < questions.length) {
		    setTimeout(function() {
			f();
		    },delay_answer);
		}
	    },delay_formula);
	};
	f();
    }
    
    function showFormula(op, x, y) {
	var formula = x + " " + op + " " + y;
	std15.cls();
	std15.locate(1,1);
	std15.putstr(formula);
	std15.drawScreen();
    }
    
    function showAnswer(op, x, y) {
	var answer;
	switch(op) {
	case "+" : answer = x + y; break;
	case "x" : answer = x * y; break;
	case "-" : answer = x - y; break;
	default  : answer = 0; break;
	}
	std15.cls();
	std15.locate(3,1);
	std15.putstr(answer.toString());
	std15.drawScreen();
    }



    function createAdditions(x,y_min,y_max) {
	var r = [];
	for(var y = y_min; y <= y_max; ++y) {
	    r.push({"x":x,"y":y,"op":"+"});
	}
	return r;
    }

    function createMultiplications(x,y_min,y_max) {
	var r = [];
	for(var y = y_min; y <= y_max; ++y) {
	    r.push({"x":x,"y":y,"op":"x"});
	}
	return r;
    }
    
    function createSubtractions(x) {
	var r = [];
	for(var y = 1; y <= (x-1); ++y) {
	    r.push({"x":x,"y":y,"op":"-"});
	}
	return r;
    }

    function createAdditions2(x_min,x_max) {
	var r = [];
	for (var x = x_min; x <= x_max; ++x) {
	    r = r.concat(createAdditions(x,1,9));
	}
	return r;
    }

    function createMultiplications2(x_min,x_max) {
	var r = [];
	for (var x = x_min; x <= x_max; ++x) {
	    r = r.concat(createMultiplications(x,1,9));
	}
	return r;
    }

    function createSubtractions2(x_min,x_max) {
	var r = [];
	for (var x = x_min; x <= x_max; ++x) {
	    r = r.concat(createSubtractions(x));
	}
	return r;
    }

    function shuffle (arr) {
	var oarr = arr.concat();
	var ub = oarr.length-1;
	var rarr = [];
	while (ub >= 0) {
	    var g = Math.floor(Math.random() * (ub+1));
	    var arrp = arr.splice(g,1);
	    rarr = rarr.concat(arrp);
	    ub --;
	}
	return rarr;
    }

}
