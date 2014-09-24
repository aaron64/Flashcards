function createQuiz(cards)
{
	$(".fc").fadeOut();
	$("#quiz-content").fadeIn();
	var pId = 0;

	var problems = new Array();

	for(var i = 0; i < cards.length; i++)
	{
		cards[i].save();
	}

	for(var i = 0; i < cards.length; i++)
	{
		var problem = {
			question: cards[i].str[0],
			answers: getAnswers(cards, i),
			toStr: function()
			{
				return this.question;
			}
		}
		problems.push(problem);
	}
	shuffleArray(problems);

	displayProblem(pId, problems, 0);
}

function displayProblem(pId, problems, right)
{
	var p = problems[pId];

	if(pId > 0)
	{
		var percentage = Math.floor((right/pId) * 100);
		$("#quiz-percentage").text(percentage + "%");
	}

	$("#quiz-question").text(p.question);
	for(var i = 0; i < 4; i++)
	{
		$("#quiz-answer" + i).text(p.answers[i].str);
	}

	$("#quiz-answer0").click(function() {
		if(p.answers[0].correct)
		{
			right = correct(right);
		}
		else
		{
			wrong();
		}
		nextProblem(pId, problems, right);
	});
	$("#quiz-answer1").click(function() {
		if(p.answers[1].correct)
		{
			right = correct(right);
		}
		else
		{
			wrong();
		}
		nextProblem(pId, problems, right);
	});
	$("#quiz-answer2").click(function() {
		if(p.answers[2].correct)
		{
			right = correct(right);
		}
		else
		{
			wrong();
		}
		nextProblem(pId, problems, right);
	});
	$("#quiz-answer3").click(function() {
		if(p.answers[3].correct)
		{
			right = correct(right);
		}
		else
		{
			wrong();
		}
		nextProblem(pId, problems, right);
	});
}

function correct(right)
{
	$("#quiz-content").animate({backgroundColor: "#47DC56"}, {
		complete: function()
		{
			$("#quiz-content").animate({backgroundColor: "#1E1E20"});
		}
	});
	return right + 1;
}
function wrong()
{
	$("#quiz-content").animate({backgroundColor: "#DC3522"}, {
		complete: function()
		{
			$("#quiz-content").animate({backgroundColor: "#1E1E20"});
		}
	});
}

function nextProblem(pId, problems, right)
{
	pId++;
	if(pId > problems.length - 1)
	{
		endQuiz();
	}
	else
	{
		displayProblem(pId, problems, right);
	}
}

function endQuiz()
{
	$("#quiz-content").fadeOut();
	$(".fc").fadeIn();
}

function getAnswers(cards, c)
{
	var a = new Array();

	var answer = {
		str: cards[c].str[1],
		correct: true
	}
	a.push(answer);
	for(var i = 0; i < 3; i++)
	{
		var r;
		do {
			r = Math.floor(Math.random() * cards.length);
		} while(r == c);

		var otherAnswers = {
			str: cards[r].str[1],
			correct: false
		}

		a.push(otherAnswers);
	}

	shuffleArray(a);

	return a;
}