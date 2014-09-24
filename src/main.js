$(function() {
	var cards = new Array();
	var cardID = 0;

	$("#card").hide();
	//$("#quiz-content").hide();

	$("#quiz-content").hide();

	$(".button").hide();
	$("#add").show();

	//buttons
	$("#add").click(function(){
		addCard();
	});

	$("#save").click(function() {
		save();
	});

	$("#flip").click(function() {
		flipAll();
	})

	$("#shuffle").click(function() {
		shuffle();
	});

	$("#next").click(function() {
		cards[0].next();
	});

	$("#prev").click(function() {
		cards[0].prev();
	});

	$("#quiz").click(function() {
		createQuiz(cards);
	});

	$(".button").hover(function()
	{
		$(this).css("background", "#374140");
		//$(this).css("background-position", $(this).width() * 2 + "px 0px");
	}, function() 
	{
		$(this).css("background", "#2A2C2B");
		//$(this).css("background-position", "0px 0px");
	}).mousedown(function() {
		$(this).css("background", "#DC3522");
		//$(this).css("background-position", $(this).width() + "px 0px");
	}).mouseup(function() {
		$(this).css("background", "#374140");
		//$(this).css("background-position", $(this).width() * 2 + "px 0px");
	});

	$(".answer").hover(function()
	{
		$(this).css("background", "#374140");
	}, function() 
	{
		$(this).css("background", "#1E1E20");
	}).mousedown(function() {
		$(this).css("background", "#DC3522");
	}).mouseup(function() {
		$(this).css("background", "#374140");
	});

	//downloadify
	/*$("#save").downloadify({
		filename: "hi.txt",
		data: "hello!",
		swf: "media/downloadify.swf",
		downloadImage: "res/button.png",
		width: 90,
		height: 45,
		onError: function(){alert('ashfdioashfdsa')}
	});*/

	//hotkeys
	$(document).keydown(function(e) {
		if(e.ctrlKey && e.keyCode == 32)
		{
			addCard();
			e.preventDefault();
		}
		else if(e.keyCode == 27 || e.keyCode == 46)
		{
			deleteCard();
			e.preventDefault();
		}
		else if(e.ctrlKey && e.keyCode == 40)
		{
			cards[0].next();
			e.preventDefault();
		}
		else if(e.ctrlKey && e.keyCode == 38)
		{
			cards[0].prev();
			e.preventDefault();
		}
		else if((e.ctrlKey && e.keyCode == 37) || (e.ctrlKey && e.keyCode == 39) || e.ctrlKey && e.keyCode == 70)
		{
			cards[cards.length - 1].flip();
			e.preventDefault();
		}
		else if(e.ctrlKey && e.keyCode == 83)
		{
			save();
			e.preventDefault();
		}
	});
	$(window).scroll(function(){
		console.log('asdf');
	});

	//title
	$("#title-text").val("Enter a title here");
	$('#title-text').focus( function(){
		var $this =$(this);
		if($this.val() == 'Enter a title here'){
			$this.val('');
			$(this).css("color", "#DC3522");
		}
	}).blur(function() {
		var $this = $(this);
		if ($this.val().match(/^\s*$/)) {
			$this.val('Enter a title here');
			$(this).css("color", "#374140");
		} else 
		{
			$(this).css("color", "#DC3522");
		}
	});



	function addCard()
	{
		addCard("","");
	}
	function addCard(str1, str2)
	{
		$(".button").fadeIn();

		cards.push(new Card(cardID, cards, str1, str2));
		cards[cards.length - 1].text.focus();
		cardID++;
	}

	function deleteCard(){
		cards[0].delete();
		if(cards.length < 1)
		{
			$(".button").fadeOut();
			$("#add").stop().show();
		}
	}

	function save()
	{	
		for(var i = 0; i < cards.length; i++)
			{
				cards[i].save()
			}

		if($("#title-text").val() == "Enter a title here")
		{
			alert("Add a title to save");
		}
		else if(cards.length == 0)
		{
			alert("Add a card to save");
		}
		else
		{
			//save
			var fileName = $("#title-text").val() + ".deck";

			var text = $("#title-text").val();
			text += '\r\n' + "-----" + '\r\n';
			for(var i = 0; i < cards.length; i++)
			{
				text += cards[i].str[0] + '𝔸' + cards[i].str[1] + '\r\n' + '𝔹';
			}
			
			var blob = new Blob([text], {type:"text/plain;charset=utf-8"});
			saveAs(blob, fileName);
		}
	}

	function flipAll()
	{
		defSide = Math.abs(defSide - 1);
		for(var i = 0; i < cards.length; i++)
		{
			if(cards[i].side != defSide)
				cards[i].flip(true);
		}
	}

	function shuffle()
	{
		for(var i = 0; i < cards.length; i++)
		{
			var c = cards[i];
			var r = Math.floor(Math.random() * cards.length);

			cards[i] = cards[r];
			cards[r] = c;
		}

		for(var i = 0; i < cards.length; i++)
		{
			if(cards[i].side != defSide)
				cards[i].flip();

			var p = cards[i].getPos();

			cards[i].c.css("z-index", p);
			cards[i].c.animate({top: CARD_SPACING * p});
		}
	}

	//dropzone
	var dropzone = $("body");
	dropzone.on("dragenter", function(e){
		e.stopPropagation();
		e.preventDefault();
		$(this).css("background-color", "#DC3522");
	});
	dropzone.on("dragover", function(e){
		e.stopPropagation();
		e.preventDefault();
	});
	dropzone.on("drop", function(e)
	{
		$(this).css("background-color", "#D9CB9E");
		e.preventDefault();

		var files = e.originalEvent.dataTransfer.files;

		handleFiles(files, dropzone);
	});

	function handleFiles(files, dropzone)
	{
		if(window.File && window.FileReader && window.FileList && window.Blob)
		{
			for(var i = 0; i < files.length; i++)
			{
				var name = files[i].name;
				if(name.substring(name.lastIndexOf("."), name.length) == ".deck")
					addFile(files[i]);
				else
					alert("Wrong file type, use '.deck'.");
			}
		}
		else 
		{
			alert('File dropping not supported in this browser.');
		}
	}

	function addFile(file)
	{
		var r = new FileReader();
		r.onload = function(e)
		{
			var t = e.target.result;
			if($("#title-text").val() == "Enter a title here" || $("#title-text").val() == "")
			{
				$("#title-text").val(t.substring(0,t.indexOf('\n')));
			}
			else
			{
				var tt = $("#title-text").val();
				$("#title-text").val(tt + " + " + t.substring(0,t.indexOf('\n')));
			}

			//process cards
			for(var i = 0; i < 2; i++)
			{
				t = t.substring(t.indexOf('\n') + 1);
			}
			while(t.indexOf('𝔸') != -1)
			{
				var str1 = t.substring(0,t.indexOf('𝔸'));
				var str2 = t.substring(t.indexOf('𝔸') + 2, t.indexOf('𝔹'));

				addCard(str1, str2);

				t = t.substring(t.indexOf('𝔹') + 2);
			}
		};
		r.readAsText(file);
	}
});

function shuffleArray(a)
{
	var c = a.length, temp, i;
	while(c > 0)
	{
		i = Math.floor(Math.random() * c);
		c--;

		temp = a[c];
		a[c] = a[i];
		a[i] = temp;
	}

	return a;
}