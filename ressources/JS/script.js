function redirectGame() {
	var id_game = this.id;
	console.log(id_game);
	window.location = "element.php" + id_game;
}

function redirectSearch(searchValue) {
	window.location = "recherche.php" + searchValue;
}

function isSearchFilled() {
	if ($('#search').val() != '') {
		return true;
	}
	return false;
}

function isEnterPressed() {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if (keycode == '13') {
		return true;
	}
	return false;
}

function catchLink(param) {
	var vars = {};
	window.location.href.replace(location.hash, '').replace(
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function (m, key, value) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if (param) {
		return vars[param] ? vars[param] : null;
	}
	return vars;
}

function search() {
	var searchValue = $(this).val();
	$.ajax({
		url: 'API/indexAPI.php?param=searchbar',
		method: 'POST',
		data: {search: searchValue},
		dataType: "json",
		success: (data) => {
			$('#search_results').html('');
			for (let i = 0; (i < data.length) && (i < 5); i++) {
				$('#search_results').append('<button class="game_input clickable" id="?jeuid=' + data[i].id + '">' + data[i].name + '</button>').css('border', '1px solid #FF5500');
			}
			if (data.length == 0) {
				$('#search_results').css('border', 'none');
			}
			if (data.length == 0 && searchValue != '') {
				$('#search_results').append('<p class="grey-text game_no_result">Pas de résultat pour cette recherche</p>').css('border', '1px solid #FF5500');
			}
		}
	})
}

$(function () {
	$('#recherche-games').on('click', '.game-search', redirectGame);
	$('#search_results').on('click', '.game_input', redirectGame);
	$('#search').keyup(search).focus(search).focusout(function (event) {
		if (event.relatedTarget != null && event.relatedTarget.id.match(/(\?jeuid=)/)) {
		} else {
			$('#search_results').html('').css('border', 'none');
		}
	});
	$('#button_index').click(function () {
		if (isSearchFilled()) {
			let searchValue = '?search=' + $('#search').val();
			redirectSearch(searchValue);
		}
	});
	$(document).keypress(function () {
		if (isEnterPressed() && isSearchFilled()) {
			let searchValue = '?search=' + $('#search').val();
			window.location = "recherche.php" + searchValue;
		}
	});
	var searchValue = catchLink('search');
	$.ajax({
		url: 'API/indexAPI.php?param=search',
		method: 'POST',
		data: {search: searchValue},
		dataType: "json",
		success: (data) => {
			$('#recherche-games').html('');
			if(data.length>0){
				for (let i = 0; (i < data.length) && (i < 5); i++) {
					let gameResult = "<article id=\"?jeuid=" + data[i].id + "\" class=\"flex-row my-05 py-1 clickable game-search\">\n" +
						"                <img class='image-search-result ml-1' src=\"images/" + data[i].path + "\" width=\"97\" class=\"mx-1\">\n" +
						"                <div class=\"flex-1 px-1 flex-column justify-content-between\">\n" +
						"                    <h2 class='orange-text'>" + data[i].name + "</h2>\n" +
						"                    <p class='text-justify grey-text'>" + data[i].description.substr(0, 250) + "(...)</p>\n" +
						"                    <hr class=' w-100 separated-line-game'>\n" +
						"                </div>\n" +
						"            </article>";
					$('#recherche-games').append(gameResult);
				}
			}else{
				$('#recherche-games').append('<p class="mx-auto my-1">Aucun résultat ne correspond à cette recherche</p>');

			}
		}
	})
	$('#logo-gamesearch').click(function () {
		window.location = "index.php";
	})
});