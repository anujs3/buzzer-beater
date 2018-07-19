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

function checkStorage()
{
	if (!localStorage.nbaCheck)
	{
		localStorage.nbaCheck = "true";
	}
	if (!localStorage.nflCheck)
	{
		localStorage.nflCheck = "true";
	}
	if (!localStorage.mlbCheck)
	{
		localStorage.mlbCheck = "true";
	}
	if (!localStorage.nhlCheck)
	{
		localStorage.nhlCheck = "true";
	}
	document.getElementById("nba").checked = (localStorage.nbaCheck === "true");
	document.getElementById("nfl").checked = (localStorage.nflCheck === "true");
	document.getElementById("mlb").checked = (localStorage.mlbCheck === "true");
	document.getElementById("nhl").checked = (localStorage.nhlCheck === "true");
	var list = ["nba","nfl","mlb","nhl"];
	var listLength = list.length;
	for (var i = 0; i < listLength; i++)
	{
		if (list[i] === localStorage.checked)
		{
			if (document.getElementById(localStorage.checked).checked === true)
			{
				document.getElementById(localStorage.checked).disabled = true;
			}
		}
		else
		{
			document.getElementById(list[i]).disabled = false;
		}
	}
}

function displayChecked()
{
	var leagues = document.getElementsByName("sport");
	var numLeagues = leagues.length;
	for (var i = 0; i < numLeagues; i++)
	{
		if (leagues[i].checked)
		{
			if (i == 0)
			{
				localStorage.nbaCheck = "true";
			}
			else if (i == 1)
			{
				localStorage.nflCheck = "true";
			}
			else if (i == 2)
			{
				localStorage.mlbCheck = "true";
			}
			else if (i == 3)
			{
				localStorage.nhlCheck = "true";
			}
		}
		else
		{
			if (i == 0)
			{
				localStorage.nbaCheck = "false";
			}
			else if (i == 1)
			{
				localStorage.nflCheck = "false";
			}
			else if (i == 2)
			{
				localStorage.mlbCheck = "false";
			}
			else if (i == 3)
			{
				localStorage.nhlCheck = "false";
			}
		}
	}
}

loadEvent(checkStorage);
setInterval(checkStorage,0);
document.getElementById("sports").addEventListener("onchange", changeEvent(displayChecked));