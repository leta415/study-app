// Get friends data
//var data = require('../json/friends.json');

$(document).ready(function() {
    $('#bookmarksTable').DataTable({
    	"paging": false,
    	"info": false
    });
} );

//delete friends
$('a.btnDelete').on('click', function (e) {
    console.log("delete clicked");
    e.preventDefault();
    var id = $(this).closest('tr').data('id');
    $('#location').html(id);
    $('#my1Modal').data('id', id).modal('show');
});

$('#btnDelteYes').click(function (e) {
    e.preventDefault();
	console.log("yes clicked");
    var id = $('#my1Modal').data('id');
    var url ='/deleteBookmark/'+ id;

    function refresh(json){
        location.reload(true);
    }
    $.get(url, refresh);

    $('#my1Modal').modal('hide');
});
