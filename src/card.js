var CARD_SPACING = 6;

var defSide = 0;

function Card(id, cards, str1, str2)
{
	this.id = id;
	this.name = "card" + id;

	for(var i = 0; i < cards.length; i++)
	{
		cards[i].save();
	}

	this.side = 0;
	this.str = new Array();
	this.str.push(str1);
	this.str.push(str2);
	
	this.c = $("#card").clone().show().addClass("fc");
	this.text = this.c.find(".card-text");
	this.text.val(str1);

	//x offset
	var xOffset = Math.random() * 6 - 3;
	this.c.offset({left: xOffset});

	//css change
	var colorOffset = (Math.random() * 20) - 10;
	var col = $("#card").css("background-color");
	col = col.substring(col.indexOf('(') + 1);
	var red = Math.floor(parseInt(col.substring(0, col.indexOf(','))) + colorOffset);
	col = col.substring(col.indexOf(',') + 1);
	var green = Math.floor(parseInt(col.substring(0, col.indexOf(','))) + colorOffset);
	col = col.substring(col.indexOf(',') + 1);
	var blue = Math.floor(parseInt(col.substring(0, col.indexOf(')'))) + colorOffset);

	this.c.css("background-color", "rgb(" + red + "," + green + "," + blue + ")");
	/*var chMinHeight = parseInt($("#card-holder").css("min-height"));
	if(this.c.height() + this.c.offset.top > parseInt(chMinHeight.substring(0, chMinHeight.length() - 2)))
	{
		alert("'sdoifah")
	}*/

	this.c.attr("id", this.name).appendTo("#card-holder");

	this.c.offset({top: CARD_SPACING * (cards.length - 1)}).animate({top: CARD_SPACING * cards.length})

	for(var i = 0; i < cards.length - 1; i++)
	{
		cards[i].c.css("z-index", cards[i].getPos());
	}
	this.c.css("z-index", cards.length);

	this.toFront = function()
	{
		var pos = this.getPos();
		cards[pos] = cards[cards.length - 1];
		cards[cards.length -1] = this;

		this.reset(pos);
	}

	this.next = function() {
		var start = cards[cards.length - 1];
		var temp = cards[0];
		for(var i = 0; i < cards.length - 1; i++)
		{
			var newTemp = cards[i + 1];
			cards[i + 1] = temp;
			temp = newTemp;
		}
		cards[0] = start;

		this.reset(0);
	}

	this.prev = function() {
		var start = cards[0];
		var temp = cards[cards.length - 1];
		for(var i = cards.length - 1; i > 0; i--)
		{
			var newTemp = cards[i - 1];
			cards[i - 1] = temp;
			temp = newTemp;
		}
		cards[cards.length - 1] = start;

		this.reset(0);
	}

	this.flip = function(rand)
	{
		var d = 400;
		if(rand)
			d = ((Math.random() * 100) - 50) + d;

		this.save();

		var w = this.c.width();
		this.c.animate({width: 0}, {queue: false, duration: d});
		this.c.animate({marginLeft: w/2}, {queue: false, duration: d});

		$(this.c).promise().done($.proxy(function(){
			this.side = Math.abs(this.side - 1);

			$(this.text).val(this.str[this.side]);

			this.c.animate({width: 400}, {queue: false, duration: d});
			this.c.animate({marginLeft: 0}, {queue: false, duration: d});
		}, this));
	}

	this.save = function()
	{
		this.str[this.side] = this.text.val();
	}

	$(this.c).dblclick($.proxy(function(e){
		this.flip(false);
	}, this));

	$(this.c).click($.proxy(function() {
		if(this !== cards[cards.length - 1])
			this.toFront();
	}, this));

	this.reset = function(pos) 
	{
		for(var i = pos; i < cards.length; i++)
		{
			if(cards[i].side != defSide)
				cards[i].flip(false);

			var p = cards[i].getPos();

			cards[i].c.css("z-index", p);
			cards[i].c.animate({top: CARD_SPACING * p});
		}

		cards[cards.length - 1].text.focus();
	}


	this.getPos = function()
	{
		for(var i = 0; i < cards.length; i++)
		{
			if(cards[i] === this)
				return i;
		}
		return -1;
	}


	this.delete = function() {
		var card = cards[cards.length - 1].c;
		$(card).animate({left: -card.width() - card.offset().left});
		cards.splice(cards.length - 1, 1);
		$(card).promise().done($.proxy(function(){
			card.remove();
		}, this));
	}
}