var nbaAbbr =
{
	"hawks": "ATL", 
	"celtics": "BOS",
	"nets": "BKN",
	"hornets": "CHA",
	"bulls": "CHI",
	"cavaliers": "CLE",
	"mavericks": "DAL",
	"nuggets": "DEN",
	"pistons": "DET",
	"warriors": "GS",
	"rockets": "HOU",
	"pacers": "IND",
	"clippers": "LAC",
	"lakers": "LAL",
	"grizzlies": "MEM",
	"heat": "MIA",
	"bucks": "MIL",
	"timberwolves": "MIN",
	"pelicans": "NO",
	"knicks": "NY",
	"thunder": "OKC",
	"magic": "ORL",
	"76ers": "PHI",
	"suns": "PHX",
	"trail blazers": "POR",
	"kings": "SAC",
	"spurs": "SA",
	"raptors": "TOR",
	"jazz": "UTA",
	"wizards": "WSH",
};

var border1 = "<label id = 'nbaBox' style = 'border: 1px solid black;margin:20px;padding:10px;margin-top:-25px;'>";

var number = -1;
var lst = [];

function loadEvent(f)
{
	var old = window.onload;
	if (typeof window.onload != "function")
	{
		window.onload = f;
	}
	else
	{
		old();
		f();
	}
}

function updateScores()
{
	if (localStorage.checked === "nba")
	{
		displayNBAScores();
	}
}

function getHttpResponse(url)
{
	return new Promise(function(resolve,reject)
	{
		var request = new XMLHttpRequest(); 
		request.open('GET',url);
		request.onload = function()
		{
			if (request.status == 200)
			{
				resolve(request.responseText);
			}
			else
			{
				reject(Error(request.statusText));
			}
		};
		request.onerror = function()
		{
			reject(Error("Network Error"));
		};
		request.send();
	});
}

function createDate()
{
	var dateList = new Date().toLocaleDateString().split("/");
	if (dateList[0] < 10)
	{
		dateList[0] = "0" + dateList[0];
	}
	if (dateList[1] < 10)
	{
		dateList[1] = "0" + dateList[1];
	}
	return [dateList[2],dateList[0],dateList[1]];
}

function displayNBAScores()
{
	var date = createDate();
	var link = "<a id = 'nba' href='" + "http://espn.go.com/nba/scoreboard?date=" + date[0] + date[1] + date[2] + "'>";
	localStorage.nbaMarquee = link;
	var baseURL = "http://data.nba.net/10s/prod/v1/";
	var endURL = "/scoreboard.json";
	var info;
	var sortedGames;
	getHttpResponse(baseURL + date[0] + date[1] + date[2] + endURL).then(
	function(text)
	{
		info = JSON.parse(text);
		function compareGames(game1,game2)
		{
			if (game1.isGameActivated && game2.isGameActivated)
			{
				return -1;
			}
			else if (!game1.isGameActivated && game2.isGameActivated)
			{
				return 1;
			}
			else
			{
				if (game1.startTimeUTC < game2.startTimeUTC)
				{
					return -1;
				}
				if (game1.startTimeUTC > game2.startTimeUTC)
				{
					return 1;
				}
				return 0;
			}
		}
		sortedGames = info.games.sort(compareGames);
		for (var g = 0; g < sortedGames.length; g++)
		{
			var game = sortedGames[g];
			console.log(game.vTeam.triCode + " - " + game.vTeam.score);
			console.log(game.hTeam.triCode + " - " + game.hTeam.score);
			console.log("\n");
			var homeScore = parseInt(game.hTeam.score);
			var awayScore = parseInt(game.vTeam.score);
			var quarter = game.period.current;
			var label = "";
			if (quarter == 0)
			{
				label = formatTime(new Date(game.startTimeUTC));
				homeScore = "";
				awayScore = "";
			}
			else if (game.period.isHalftime)
			{
				label = "Halftime";
			}
			else if (game.isGameActivated)
			{
				if (quarter >= 1 && quarter <= 4)
				{
					label = "Q" + quarter + " " + game.clock;
				}
				else if (quarter == 5)
				{
					label = "OT" + " " + game.clock;
				}
				else if (quarter > 5)
				{
					label = (quarter-4)+"OT" + " " + game.clock;
				}
			}
			else
			{				
				if (quarter == 4)
				{
					label = "Final";
				}
				else if (quarter == 5)
				{
					label = "Final/OT";
				}
				else if (quarter > 5)
				{
					label = "Final/"+(game.period.current-4)+"OT";
				}
			}
			localStorage.nbaMarquee += border1 + game.vTeam.triCode + " " + awayScore + " " + 
			game.hTeam.triCode + " " + homeScore + " " + label + "</label> ";
		}
		if (localStorage.nbaMarquee === link)
		{
			localStorage.nbaMarquee = "NBA";
		}
		else
		{
			localStorage.nbaMarquee += "</a>";
		}
	},
	function(error)
	{
		console.log(error);
		localStorage.nbaMarquee = "NBA";
	});
}

function getSearchSuggest(term)
{
	if (term === "" || term.split(" ").join("") === "" || term.length > 100)
	{
		document.getElementById("suggest").innerHTML = "";
		number = -1;
		return;
	}
	var ids = [];
	getHttpResponse("http://suggestqueries.google.com/complete/search?output=firefox&q=" + term).then(
	function(text)
	{
		var info = JSON.parse(text);
		var result = "";
		var length = info[1].length;
		for (var i = 0; i < length; i++)
		{
			ids.push(info[1][i]);
			result += '<label class="ss" id="' + info[1][i] + '">' + info[1][i] + "</label>" + "<br>";
		}
		if (result !== document.getElementById("suggest").innerHTML)
		{
			number = -1;
			document.getElementById("suggest").innerHTML = "";
			for (var i = 0; i < length; i++)
			{
				var label = document.createElement("LABEL");
				label.appendChild(document.createTextNode(info[1][i]));
				label.setAttribute("id","ss "+info[1][i]);
				label.setAttribute("class","ss");
				label.onclick = function(id)
				{
					return function()
					{
						document.getElementById("input").value = id.slice(3);
						window.open("https://www.google.com/search?q=" + id.slice(3),"_self");
					}
				}(label.id);
				document.getElementById("suggest").appendChild(label);
				document.getElementById("suggest").appendChild(document.createElement("br"));
			}
		}
	},
	function(error)
	{
		console.log(error);
		document.getElementById("suggest").innerHTML = "";
		number = -1;
	});
	return ids;
}

function keySelect()
{
	var oldNumber = number;
	if (event.keyCode == 40)
	{
		if (number > -1 && number < lst.length)
		{
			document.getElementById("ss " + lst[oldNumber]).setAttribute("style","background-color:transparent");	
		}
		if (number > -2 && number < lst.length)
		{
			number += 1;
		}
		if (number === lst.length)
		{
			number = 0;
		}
		document.getElementById("ss " + lst[number]).setAttribute("style","background-color:grey");
		document.getElementById("input").value = lst[number];
	}
	else if (event.keyCode == 38)
	{
		if (number > -1 && number < lst.length)
		{
			document.getElementById("ss " + lst[oldNumber]).setAttribute("style","background-color:transparent");
			number -= 1;
		}
		if (number === -1)
		{
			number = lst.length - 1;
		}
		document.getElementById("ss " + lst[number]).setAttribute("style","background-color:grey");
		document.getElementById("input").value = lst[number];
	}
}

loadEvent(updateScores);

document.getElementById("ticker").setAttribute("style","width:"+(1.1*screen.width)+"px;");
document.getElementById("input").setAttribute("style","align:center;width:"+(0.8*screen.width)+"px;"+"height:50px;font:40px Calibri,sans-serif;");
document.getElementById("suggest").setAttribute("style","width:"+(0.8*screen.width)+"px;"+"height:50px;font:20px Calibri,sans-serif;color:white;");
document.getElementById("submit").setAttribute("style","font-size:20px;height:50px;width:"+(0.075*screen.width)+"px;height:55px;");

var marquee = "";
if (localStorage.nbaMarquee !== "NBA" && localStorage.checked === "nba")
{ 
	marquee += localStorage.nbaMarquee;
}

setTimeout(function()
{
	var speed = String((marquee.split("</label>").length-1) * 5);
	var string = "marquee " + speed + "s linear infinite";
	document.getElementById("speed").style.animation = string;
	document.getElementById("speed").style.WebkitAnimation = string;
	document.getElementById("speed").innerHTML = localStorage.marquee;
	document.getElementById("speed").onmouseover = function()
	{
		document.getElementById("speed").style.animationPlayState = "paused";
		document.getElementById("speed").style.WebkitAnimationPlayState = "paused";
	};
	document.getElementById("speed").onmouseout = function()
	{
		document.getElementById("speed").style.animationPlayState = "running";
		document.getElementById("speed").style.WebkitAnimationPlayState = "running";
	};		
	document.getElementById("speed").innerHTML = marquee;
},1000);

document.getElementById("input").addEventListener("keyup",function()
{
	if (event.keyCode === 8 || event.keyCode === 32 || event.keyCode >= 48)
	{
		lst = getSearchSuggest(document.getElementById("input").value);
	}
});
document.getElementById(":").addEventListener("keydown",function(){keySelect(lst);});