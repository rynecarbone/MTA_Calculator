(function() {
	var singleFare    = 2.75;
	var cardFee       = 1.00;
	var bonusMin      = 5.50;
	var bonus         = 0.11;
	var inputRounding = 0.05;

	var calc_bonus = function(remaining, nRides){
		var to_pay = Math.ceil((nRides*singleFare - remaining)/inputRounding)*inputRounding;
		var i_bonus = to_pay >= bonusMin ? bonus : 0.0;
		return i_bonus;
	};
	
	var calc_pay = function(remaining, nRides, i_bonus){
		var load    = ( (nRides*singleFare - remaining) / i_bonus ).toFixed(2);
		if(load < bonusMin && i_bonus > 1.0 ){
			load = (nRides*singleFare - remaining).toFixed(2);
		}
		return Math.ceil(load / inputRounding)*inputRounding;
	};
	
	var calc_remainder = function(remaining, nRides, amount_new, i_bonus){
		var remainder = nRides*singleFare - remaining - i_bonus*amount_new;
		return remainder;
	};

	$('body').on('submit', 'form', function(e) {
		e.preventDefault();
		var form = $(this).serialize().split("&");
		var isNewCard = $('input[name="hasCard"]:checked').val() === 'new';
		var remaining = $('#amountLeft:not([disabled])').val() || 0;
		remaining = isNaN(remaining) ? 0 : parseFloat(remaining);
		var tbody = $(document.getElementById('suggestion-table')).empty();
		var total = 0.00;
		var nRides = 0;
		while(total < 100.00){
			nRides++;
			var i_bonus    = calc_bonus(remaining, nRides);
			var amount_new = calc_pay(remaining, nRides, (1+i_bonus));
			var remainder  = calc_remainder(remaining, nRides, amount_new, (1+i_bonus));
			total = isNewCard ? amount_new + cardFee: amount_new;
			//var contents = ['$' + amount.toFixed(2), '$' + card.bonus.toFixed(2), '$' + card.balance.toFixed(2), trips, amount_new].join('</td><td>');
			var contents = ['$' + total.toFixed(2), 
											'$' + (amount_new*i_bonus).toFixed(2), 
											'$' + (amount_new*(1.+i_bonus)+remaining).toFixed(2), 
											nRides, 
											'$' + remainder.toFixed(2)].join('</td><td>');
			tbody.append(['<tr><td>', contents, '</td></tr>'].join(''));
		}
	});

	$('body').on('change', 'input[name="hasCard"]', function() {
		var old = this.value ==='old';
		if (old && $(this).is(':checked')) {
			$('#amountLeft').removeAttr('disabled').focus();
		} else {
			$('#amountLeft').attr('disabled', true);
		}

	});

})();
