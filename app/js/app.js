function gameover() {
	$(".ingame").remove();
	$(".page").append("<h1>게임 오버!</h1>");
	$(".page").append("<br/><br/><br/><br/><br/><h3 id='ask-name'>이름을 입력해 주세요</h3>");
	$(".page").append("<input type='text' id='player-name' name='player-name'></input>");

	return false;
}





function reset() {
	$(".dealer-cards").html("<div class='card card1'></div><div class='card card2 flipped'></div><div class='new-cards'></div><div class='clear'></div><div id='dealerTotal' class='dealer-total'></div>");
	$(".player-cards").html("<div class='card card1'></div><div class='card card2'></div><div class='new-cards'></div><div class='clear'></div><div id='playerTotal' class='player-total'></div>");
	$(".buttons").html("<div class='btn button-secondary pure-button' id='hit'>힛</div>&nbsp;<div class='btn button-secondary pure-button' id='stand'>스탠드</div>");

	$(".dealer-cards").css("width","");
	$(".player-cards").css("width","");
	$(".player-cards").css("visibility", "visible");

	$("#playerTotal").html('');
	$("#dealerTotal").html('');
	$("#message").html('');

	/*
	$("#all").attr("disabled", "true");
	$("#more10").attr("disabled", "true");
	$("#more100").attr("disabled", "true");
	$("#less10").attr("disabled", "true");
	$("#less100").attr("disabled", "true");
	*/

	$(".pure-form").css("visibility", "hidden");
}

function deal() {
	var currentBet = $("#bet").html();
	var money = $("#money").html();
	if (money < 0 || (currentBet == 0 && money == 0)) {
		alert("자산이 다 떨어졌습니다!");
		gameover();
	} else if (currentBet <= 0) {
		alert("베팅할 금액을 선택해 주세요!");
		return false;
	}

	reset();

	// Store cards in array
	var cards = ["ace-of-clubs","two-of-clubs","three-of-clubs","four-of-clubs",
	"five-of-clubs","six-of-clubs","seven-of-clubs","eight-of-clubs",
	"nine-of-clubs","ten-of-clubs","jack-of-clubs","queen-of-clubs",
	"king-of-clubs","ace-of-spades","two-of-spades","three-of-spades",
	"four-of-spades","five-of-spades","six-of-spades","seven-of-spades",
	"eight-of-spades","nine-of-spades","ten-of-spades","jack-of-spades",
	"queen-of-spades","king-of-spades","ace-of-hearts","two-of-hearts",
	"three-of-hearts","four-of-hearts","five-of-hearts","six-of-hearts",
	"seven-of-hearts","eight-of-hearts","nine-of-hearts","ten-of-hearts",
	"jack-of-hearts","queen-of-hearts","king-of-hearts","ace-of-diamonds",
	"two-of-diamonds","three-of-diamonds","four-of-diamonds","five-of-diamonds",
	"six-of-diamonds","seven-of-diamonds","eight-of-diamonds","nine-of-diamonds",
	"ten-of-diamonds","jack-of-diamonds","queen-of-diamonds","king-of-diamonds"];

	var values = [11,2,3,4,
								5,6,7,8,
								9,10,10,10,
								10,11,2,3,
								4,5,6,7,
								8,9,10,10,
								10,10,11,2,
								3,4,5,6,
								7,8,9,10,
								10,10,10,11,
								2,3,4,5,
								6,7,8,9,
								10,10,10,10];

	// Zero out dealer total
	var dealerTotal = 0;
	$(".dealer-cards .card").each(function(){
		var num = Math.floor(Math.random() * cards.length);
		var cardClass = cards[num];

		$(this).addClass(cardClass);
		$(this).attr("data-value",values[num]);

		dealerTotal = parseInt(dealerTotal) + parseInt(values[num]);

		if(dealerTotal>21){
			$(".dealer-cards .card").each(function(){
				if($(this).attr("data-value") == 11){
					dealerTotal = parseInt(dealerTotal) - 10;
					$(this).attr("data-value",1);
				}
			});
		}

		$("#dealerTotal").html(dealerTotal);

		cards.splice(num, 1);
		values.splice(num, 1);
	});

	// Zero out player total
	var playerTotal = 0;
	$(".player-cards .card").each(function(){
		var num = Math.floor(Math.random() * cards.length);
		var cardClass = cards[num];

		$(this).addClass(cardClass);

		$(this).attr("data-value",values[num]);

		playerTotal = parseInt(playerTotal) + parseInt(values[num]);

		if(playerTotal>21){
			$(".player-cards .card").each(function(){
				if($(this).attr("data-value") == 11){
					playerTotal = parseInt(playerTotal) - 10;
					$(this).attr("data-value",1);
				}
			});
		}
		$("#playerTotal").html(playerTotal);

		cards.splice(num, 1);
		values.splice(num, 1);
	});

	// If player hits
	$("#hit").click(function(){
		var num = Math.floor(Math.random() * cards.length);
		var cardClass = cards[num];

		var newCard = "<div class='card " +  cardClass + "' data-value='" + values[num] + "'></div>";
		$(".player-cards .new-cards").append(newCard);

		playerTotal = parseInt(playerTotal) + parseInt(values[num]);

		if(playerTotal>21){
			$(".player-cards .card").each(function(){
				if($(this).attr("data-value")==11){
					playerTotal = parseInt(playerTotal) - 10;
					$(this).attr("data-value",1);
				}
			});
		}

		cards.splice(num, 1);
		values.splice(num, 1);

		$("#playerTotal").html(playerTotal);
		$(".player-cards").width($(".player-cards").width()+84);


		if(playerTotal>21){
			$("#message").html('버스트!');
			var reloadGame = "<br/><div class='btn button-secondary pure-button' id='deal'>딜</div>";
			$(".buttons").html(reloadGame);
			/// Pay up
			$("#bet").html('0');
			$(".pure-form").css("visibility", "visible");
			return false;
		}
	});

	// If player stands
	$("#stand").click(function(){
		$("#dealerTotal").css("visibility","visible");
		$(".card2").removeClass("flipped");

		// Keep adding a card until over 17 or dealer busts
		var keepDealing = setInterval(function(){

			var dealerTotal = $("#dealerTotal").html();
			var playerTotal = $("#playerTotal").html();

			// If there are aces
			if(dealerTotal>21){
				$(".dealer-cards .card").each(function(){

					// and check if still over 21 in the loop
					if($(this).attr("data-value")==11 && dealerTotal>21){
						dealerTotal = parseInt(dealerTotal) - 10;
						$(this).attr("data-value",1);
					}
				});
			}

			if(dealerTotal>21){
				$("#message").html('딜러 버스트!');
				var reloadGame = "<br/><div class='btn button-secondary pure-button' id='deal'>딜</div>";
				$(".buttons").html(reloadGame);
				clearInterval(keepDealing);
				/// Pay up
				var bet = $("#bet").html();
				var money = $("#money").html();
				var winnings = bet * 2;
				$("#bet").html('0');
				$("#money").html(parseInt(winnings) + parseInt(money));
				$(".pure-form").css("visibility", "visible");
				return false;
			}


			if(dealerTotal>=17){
				/// You Win
				if(playerTotal>dealerTotal){

					$("#message").html('이겼습니다!');

					/// Pay up
					var bet = $("#bet").html();
					var money = $("#money").html();
					var winnings = bet * 2;
					$("#bet").html('0');
					$("#money").html(parseInt(winnings) + parseInt(money));
				}

				/// You Lose
				if(playerTotal<dealerTotal){

					$("#message").html('졌습니다!');
					/// Pay up
					var bet = $("#bet").html();
					var money = $("#money").html();
					$("#bet").html('0');
					$("#money").html(parseInt(money) - parseInt(bet));
				}
				if(playerTotal==dealerTotal){
					$("#message").html('푸시!');
					var bet = $("#bet").html();
					var money = $("#money").html();
					$("#money").html(parseInt(bet) + parseInt(money));
					$("#bet").html('0');
				}
				var reloadGame = "<br/><div class='btn button-secondary pure-button' id='deal'>딜</div>";
				$(".buttons").html(reloadGame);
				clearInterval(keepDealing);
				$(".pure-form").css("visibility", "visible");
				return false;
			}

			var num = Math.floor(Math.random()*cards.length);
			var cardClass = cards[num];

			var newCard = "<div class='card " +  cardClass + "' data-value='" + values[num] + "'></div>";
			$(".dealer-cards .new-cards").append(newCard);

			dealerTotal = parseInt(dealerTotal) + parseInt(values[num]);

			$("#dealerTotal").html(dealerTotal);
			$(".dealer-cards").width($(".dealer-cards").width()+84)


			cards.splice(num, 1);
			values.splice(num, 1);

			}, 300);
	});
}

$(document).ready(function(){
	$(".player-cards").css("visibility", "hidden");
	var reloadGame = "<br/><div class='btn button-secondary pure-button' id='deal'>딜</div>";
	$(".buttons").html(reloadGame);
	$("#deal").click(function(){
		deal();
	});

	$("#all").click(function(){ // 오-링
		var currentBet = $("#bet").html();
		if(money==0) return false;
		var money = $("#money").html();
		var bet = parseInt(money);
		if(currentBet){
			$("#bet").html(parseInt(currentBet) + bet);
			} else {
			$("#bet").html(bet);
		}
		$("#money").html(money-bet);
	});
	$("#more10").click(function(){ // +10
		var bet = 10;
		var currentBet = $("#bet").html();
		var money = $("#money").html();
		if(money==0) return false;
		if(currentBet){
			$("#bet").html(parseInt(currentBet) + bet);
			} else {
			$("#bet").html(bet);
		}
		$("#money").html(money-bet);
	});
	$("#less10").click(function(){ // -10
		var bet = -10;
		var currentBet = $("#bet").html();
		if(currentBet==0) return false;
		var money = $("#money").html();
		if(currentBet){
			$("#bet").html(parseInt(currentBet) + bet);
			} else {
			$("#bet").html(bet);
		}
		$("#money").html(money-bet);
	});
	$("#more100").click(function(){ // +100
		var bet = 100;
		var currentBet = $("#bet").html();
		var money = $("#money").html();
		if(money==0) return false;
		if(currentBet){
			$("#bet").html(parseInt(currentBet) + bet);
			} else {
			$("#bet").html(bet);
		}
		$("#money").html(money-bet);
	});
	$("#less100").click(function(){ // -100
		var bet = -100;
		var currentBet = $("#bet").html();
		if(currentBet==0) return false
		var money = $("#money").html();
		if(currentBet){
			$("#bet").html(parseInt(currentBet) + bet);
			} else {
			$("#bet").html(bet);
		}
		$("#money").html(money-bet);
	});

	setInterval(function(){
		$("#deal").unbind('click');
		$("#deal").click(function(){
			deal();
		});
 	}, 200);
});
