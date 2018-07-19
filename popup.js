var nbaSymbols = 
{
	"ATL": "Atlanta Hawks",
	"BOS": "Boston Celtics",
	"BKN": "Brooklyn Nets",
	"CHA": "Charlotte Hornets",
	"CHI": "Chicago Bulls", 
	"CLE": "Cleveland Cavaliers",
	"DAL": "Dallas Mavericks",
	"DEN": "Denver Nuggets",
	"DET": "Detroit Pistons",
	"GSW": "Golden State Warriors",
	"HOU": "Houston Rockets",
	"IND": "Indiana Pacers",
	"LAC": "LA Clippers",
	"LAL": "LA Lakers",
	"MEM": "Memphis Grizzlies",
	"MIA": "Miami Heat",
	"MIL": "Milwaukee Bucks",
	"MIN": "Minnesota Timberwolves",
	"NOP": "New Orleans Pelicans",
	"NYK": "New York Knicks",
	"OKC": "Oklahoma City Thunder",
	"ORL": "Orlando Magic",
	"PHI": "Philadelphia 76ers",
	"PHX": "Phoenix Suns",
	"POR": "Portland Trailblazers",
	"SAC": "Sacramento Kings",
	"SAS": "San Antonio Spurs",
	"TOR": "Toronto Raptors",
	"UTA": "Utah Jazz",
	"WAS": "Washington Wizards",

}

var listNBA = 
		"<select id = 'nbaTeams'>" +
			"<option> Select NBA Team </option>" +
			"<option> Atlanta Hawks </option>" +
			"<option> Boston Celtics </option>" +
			"<option> Brooklyn Nets </option>" +
			"<option> Charlotte Hornets </option>" +
			"<option> Chicago Bulls </option>" +
			"<option> Cleveland Cavaliers </option>" +
			"<option> Dallas Mavericks </option>" +
			"<option> Denver Nuggets </option>" +
			"<option> Detroit Pistons </option>" +
			"<option> Golden State Warriors </option>" +
			"<option> Houston Rockets </option>" +
			"<option> Indiana Pacers </option>" +
			"<option> Los Angeles Clippers </option>" +
			"<option> Los Angeles Lakers </option>" +
			"<option> Memphis Grizzlies</option>" +
			"<option> Miami Heat </option>" + 
			"<option> Milwaukee Bucks </option>" + 
			"<option> Minnesota Timberwolves </option>" + 
			"<option> New Orleans Pelicans </option>" + 
			"<option> New York Knicks </option>" +
			"<option> Oklahoma City Thunder </option>" +
			"<option> Orlando Magic </option>" + 
			"<option> Philadelphia 76ers </option>" +
			"<option> Phoenix Suns </option>" +
			"<option> Portland Trailblazers </option>" +
			"<option> Sacramento Kings </option>" +
			"<option> San Antonio Spurs </option>" + 
			"<option> Toronto Raptors </option>" +
			"<option> Utah Jazz </option>" +
			"<option> Washington Wizards </option>" +
		"</select>" + 
		"<button style = 'margin-top:5px;' id = 'nbaTeam'>Show Players</button><br>" +
		"<p class = 'players' id = 'nbaPlayers'></p>";

var box = '<button class = "box popup" style = "border: 1px solid grey;width: 90%;"><span class="popuptext show">Test</span>';
var img = '<img style = "width:20px;height:20px;" src = "';
var close = '">';

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

function changeEvent(f) 
{
	var old = window.onchange;
	if (typeof window.onchange != "function") 
	{
		window.onchange = f;
	}
	else
	{
		old();
		f();
	}
}

function convertCurrentDate()
{
	var date = new Date();
	if (date.getHours() < 12)
	{
		var mill = date.getTime();
		date = new Date(mill-(1000*86400));
	}
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (month < 10)
	{
		month = "0" + month;
	}
	if (day < 10)
	{
		day = "0" + day;
	}
	return date.getFullYear() + "-" + month + "-" + day;
}

function checkStorage()
{
	if (!localStorage.checked)
	{
		localStorage.checked = "nba";	
	}
	if (!localStorage.nbaDate)
	{
		localStorage.nbaDate = convertCurrentDate();
	}
	if (!localStorage.nbaScores)
	{
		displayNBAScores();
	}
	document.getElementById("nbaScores").innerHTML = localStorage.nbaScores;
	document.getElementById("nbaDate").value = convertCurrentDate();
	displayChecked();
	if (localStorage.nbaCheck === "false")
	{
		document.getElementById("bask").className = "hidden";
		document.getElementById("nbaLabel").className = "hidden";
	}
	else
	{
		updateNBAScores();
	}
}

function displayChecked()
{
	var leagues = document.getElementsByName("league");
	var numLeagues = leagues.length;
	for (var i = 0; i < numLeagues; i++)
	{
		if (leagues[i].checked)
		{
			localStorage.checked = leagues[i].value;
			document.getElementById(leagues[i].value).className = "";
		}
		else
		{
			document.getElementById(leagues[i].value).className = "hidden";
		}
	}
}

function getHttpResponse(url,callback,errorCallback)
{
	var request = new XMLHttpRequest(); 
	if (callback)
	{
		request.onreadystatechange = function()
		{
			if (request.readyState === 4)
			{
				if (request.status === 200)
				{
					callback(request);
				}
				else
				{
					if (errorCallback)
					{
						errorCallback(request.status);
					}
				}
			}
		}
	}
	request.open("GET",url,!!callback);
	try
	{
		if (request.status === 0 || request.status === 200)
		{
			request.send();
		}
	}
	catch (err)
	{
		if (errorCallback)
		{
			errorCallback(err);
		}
		else
		{
			throw err;
		}
	}
	if (!callback)
	{
		return request.responseText;
	}
}

function moreInfoButton(baseURL,date,element)
{
	var label = document.createElement("label");
	label.onclick = function(url)
	{
		return function(){window.open(url);};
	}(baseURL + date[0] + date[1] + date[2]);
	label.setAttribute("style","text-decoration:underline");
	label.setAttribute("class","label");
	label.appendChild(document.createTextNode("More Info"));
	document.getElementById(element).appendChild(label);
}

function createLabel(text,element)
{
	var label = document.createElement("label");
	label.setAttribute("style","background-color:#E6E6E6;width:50px;height:2px;");
	label.appendChild(document.createTextNode(text));
	document.getElementById(element).appendChild(label);
}

function createDateLabel(scheduledDate,element)
{
	var date = new Date(scheduledDate);
	var time = date.toLocaleTimeString();
	if (element === "notToday")
	{
		time = date.toLocaleString();
		element = "nflScores"
	}
	var pieces = time.split(":");
	createLabel(pieces[0]+":"+pieces[1]+pieces[2].slice(2),element);
}

function boldText(text)
{
	return "<strong>" + text + "</strong>";
}

function greyText(text)
{
	return "<strong><font color = 'grey'>" + text + "</font></strong>";
}

function displayNBAScores()
{
	document.getElementById("nbaScores").style.overflowY = "scroll";
	var date = localStorage.nbaDate.split("-");
	var baseURL = "http://data.nba.net/10s/prod/v1/";
	var endURL = "/scoreboard.json";
	var info;
	getHttpResponse(baseURL + date[0] + date[1] + date[2] + endURL,
	function(request)
	{
		if (request.readyState === 4 && request.status === 200)
		{
			var text = request.responseText;
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
			var sortedGames = info.games.sort(compareGames); 
			document.getElementById("nbaScores").innerHTML = "";
			for (var g = 0; g < sortedGames.length; g++)
			{
				var game = sortedGames[g];
				console.log(game.vTeam.triCode + " - " + game.vTeam.score);
				console.log(game.hTeam.triCode + " - " + game.hTeam.score);
				console.log("\n");
				var homeName = nbaSymbols[game.hTeam.triCode];
				var homeScore = parseInt(game.hTeam.score);
				var awayName = nbaSymbols[game.vTeam.triCode];
				var awayScore = parseInt(game.vTeam.score);
				var quarter = game.period.current;
				if (quarter == 0)
				{
					createLabel(formatTime(new Date(game.startTimeUTC)),"nbaScores");
					homeScore = "";
					awayScore = "";
				}
				else if (game.period.isHalftime)
				{
					createLabel("Halftime","nbaScores");
				}
				else if (game.isGameActivated)
				{
					if (quarter >= 1 && quarter <= 4)
					{
						createLabel("Q" + quarter + " " + game.clock,"nbaScores");
					}
					else if (quarter == 5)
					{
						createLabel("OT" + " " + game.clock,"nbaScores");
					}
					else if (quarter > 5)
					{
						createLabel((quarter-4)+"OT" + " " + game.clock,"nbaScores");
					}
				}
				else
				{
					if (homeScore > awayScore)
					{
						homeName = boldText(homeName);
						homeScore = boldText(homeScore);
						awayName = greyText(awayName);
						awayScore = greyText(awayScore);
					}
					else if (homeScore < awayScore)
					{
						awayName = boldText(awayName);
						awayScore = boldText(awayScore);
						homeName = greyText(homeName);
						homeScore = greyText(homeScore);
					}
					
					if (quarter == 4)
					{
						createLabel("Final","nbaScores");
					}
					else if (quarter == 5)
					{
						createLabel("Final/OT","nbaScores");
					}
					else if (quarter > 5)
					{
						createLabel("Final/"+(game.period.current-4)+"OT","nbaScores");
					}
				}
				var awayImagePath = "NBA_Logos/" + game.vTeam.triCode + ".png";
				var homeImagePath = "NBA_Logos/" + game.hTeam.triCode + ".png";
				var baseId = game.vTeam.triCode + '_' + game.hTeam.triCode;
				var buttonId = baseId + '_button';
				var spanId = baseId + '_span'; 
				var button = '<div id="' + buttonId + '" class="box popup"';
				button += 'style = "border: 1px solid grey; width: 90%;">';
				button += '<span id="' + spanId + '" class="popuptext"></span>';
				document.getElementById("nbaScores").innerHTML += "<br>" + button + img + awayImagePath + 
				close + ' ' + awayName + ' ' + awayScore + "<br>" + img + 
				homeImagePath + close + ' ' + homeName + ' ' + 
				homeScore + "</div><br><br>";

				if (game.nugget.text == undefined || game.nugget.text == "")
				{
					document.getElementById(spanId).innerHTML = "Summary information is unavailable."
				}
				else
				{
					document.getElementById(spanId).innerHTML = game.nugget.text + ".";
				}
			}
			sortedGames.forEach(function(game) {
				var baseId = game.vTeam.triCode + '_' + game.hTeam.triCode;
				var buttonId = baseId + '_button';
				var spanId = baseId + '_span'; 
				var buttonElement = document.getElementById(buttonId);
				buttonElement.addEventListener("click", function() {
					document.getElementById(spanId).classList.toggle("show");
				});
			});
			moreInfoButton("http://espn.go.com/nba/scoreboard?date=",date,"nbaScores");
		}
	},
	function(err)
	{
		document.getElementById("nbaScores").innerHTML = "";
		if (date[0] !== "")
		{
			moreInfoButton("http://espn.go.com/nba/scoreboard?date=",date,"nbaScores");
		}
		localStorage.nbaScores = document.getElementById("nbaScores").innerHTML;
	});
}

function formatTime(date)
{
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
}

function updateNBAScores()
{
	localStorage.nbaDate = document.getElementById("nbaDate").value;
	displayNBAScores();
}

function listNBATeam()
{
	document.getElementById("nbaScores").style.overflowY = "hidden";
	document.getElementById("nbaScores").innerHTML = listNBA;
	document.getElementById("nbaTeam").addEventListener("click",displayNBATeam);
}

function displayNBATeam()
{
	if (document.getElementById("nbaTeams").value === "Select NBA Team")
	{
		document.getElementById("nbaPlayers").innerHTML = "";
		return;
	}
	var fullName = document.getElementById("nbaTeams").value.toLowerCase();
	var teamName = fullName.split(" ");
	var baseURL = "http://data.nba.net/10s/prod/v1/" + localStorage.nbaDate.split('-')[0] + "/teams/";
	var endURL = "/roster.json";
	getHttpResponse(baseURL + teamName[teamName.length-1] + endURL,
	function(request)
	{
		if (request.readyState == 4 && request.status == 200)
		{
			var response = request.responseText;
			var text = JSON.parse(response);
			var result = text.league.standard.players;
			var players = result.map(x => x.personId);
			document.getElementById("nbaPlayers").innerHTML = "";
			getHttpResponse("http://data.nba.net/10s/prod/v1/2018/players.json",
			function(secondRequest)
			{
				if (secondRequest.readyState == 4 && secondRequest.status == 200)
				{
					var jsonObject = JSON.parse(secondRequest.responseText);
					for (var i = 0; i < jsonObject.league.standard.length; i++)
					{
						var player = jsonObject.league.standard[i];
						if (players.includes(player.personId))
						{
							var fullName = player.firstName + " " + player.lastName;
							document.getElementById("nbaPlayers").innerHTML += "#" + player.jersey + " " + fullName + " " + player.pos.split("-").join(", ") + "<br>";
						}
					}
				}
			});
		}
	});
}

function displayNBAStandings()
{
	document.getElementById("nbaScores").style.overflowY = "scroll";
	var date = localStorage.nbaDate.split('-');
	var baseURL = "http://data.nba.net/10s/prod/v1/";
	var endURL = "/standings_all.json";
	getHttpResponse(baseURL + date[0] + date[1] + date[2] + endURL,
	function(request)
	{
		if (request.readyState == 4 && request.status == 200)
		{
			try 
			{
				document.getElementById("nbaScores").innerHTML = "";
				var response = request.responseText;
				var text = JSON.parse(response);
				var teams = text.league.standard.teams;
				getHttpResponse("http://data.nba.net/10s/prod/v1/2018/teams.json",
				function(anotherRequest)
				{
					if (anotherRequest.readyState == 4 && anotherRequest.status == 200)
					{
						var json = JSON.parse(anotherRequest.responseText);
						for (var i = 0; i < teams.length; i++)
						{
							var team = teams[i];
							var fullName = "";
							var codeName = "";
							for (var j = 0; j < json.league.standard.length; j++)
							{
								var teamInfo = json.league.standard[j];
								if (teamInfo.teamId === team.teamId)
								{
									fullName = teamInfo.fullName;
									codeName = teamInfo.tricode;
									break;
								}
							}
							var imagePath = "NBA_Logos/" + codeName + ".png";
							var image = img + imagePath + close;
							document.getElementById("nbaScores").innerHTML += image + " " + fullName + " " + team.win + "-" + team.loss + "<br>";
						}
						document.getElementById("nbaScores").innerHTML += "<br><br>";
						moreInfoButton("http://espn.go.com/nba/standings/_/season/"+date[0],["","",""],"nbaScores");
						document.getElementById("nbaScores").innerHTML += "<br><br>";
					}
				});
			}
			catch (err)
			{
				document.getElementById("nbaScores").innerHTML = "";
				moreInfoButton("http://espn.go.com/nba/standings/_/season/"+date[0],["","",""],"nbaScores");
			}
		}
	},
	function(err)
	{
		document.getElementById("nbaScores").innerHTML = "";
		season = String(Number(season)+1);
		moreInfoButton("http://espn.go.com/nba/standings/_/season/"+season,["","",""],"nbaScores");
	});
}

loadEvent(checkStorage);

document.getElementById("nbaButton").addEventListener("click", updateNBAScores);
document.getElementById("refreshNBA").addEventListener("click", displayNBAScores);
document.getElementById("rosterNBA").addEventListener("click", listNBATeam);
document.getElementById("standingsNBA").addEventListener("click", displayNBAStandings);