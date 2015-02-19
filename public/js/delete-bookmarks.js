// Get friends data
//var data = require('../json/friends.json');

//delete friends
$('a.btnDelete').on('click', function (e) {
    e.preventDefault();
    var id = $(this).closest('tr').data('id');
    $('#my1Modal').data('id', id).modal('show');
});

$('#btnDelteYes').click(function () {
	console.log("yes clicked");
    var id = $('#my1Modal').data('id');
    $('[data-id=' + id + ']').remove();
    $('#my1Modal').modal('hide');
});

//adding friends
$('a.btnAdd').on('click', function (e) {
    e.preventDefault();
    var id = $(this).closest('tr').data('id');
    $('#myModal').data('id', id).modal('show');
});

/*$('#search').click(function () {
	for(var i =0; i < data.length; i++){
		//get username
		if(data[i].username == blah){
			//display
		}
	}
});*/
