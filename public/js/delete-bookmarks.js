// Get friends data
//var data = require('../json/friends.json');

$(document).ready(function() {
    $('#friendsTable').DataTable({
    	"paging": false,
    	"info": false/*,
    	"dom": '<"search">lt'*/
    });

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
    $('#my1Modal').data('id', id).modal('show');
});

$('#btnDelteYes').click(function () {
	console.log("yes clicked");
    var id = $('#my1Modal').data('id');
    $('[data-id=' + id + ']').remove();
    $('#my1Modal').modal('hide');
});

//adding friends
$('a.btnAddIcon').on('click', function (e) {
    e.preventDefault();
    var id = $(this).closest('tr').data('id');
    $('#myModal').data('id', id).modal('show');
});

$('#search').click(function (e){
    e.preventDefault();
    function displayFriendName(json){
        var displayName = json.name;
        var friendUsername = json.username;
        var html = "<ul class=\"text-left list-inline\"> <li>Name: " + displayName +"</li><li>Username: " + friendUsername + "</li><li><a href=\"#\" class=\"btnAdd btn\" >Add</a></li></ul>";
        $('.friendsName').html(html);

        //adding friend
        $('a.btnAdd').click(function(){
            $('#myModal').modal('toggle');
            //get the user details and add it to friends db
            var url = '/user/' +displayName + '/' + friendUsername;
            $.get(url, function() {
                    console.log("finished");
                });
        });
    }

    $.get('/search', displayFriendName);
    
});

/*$('#search').click(function () {
	console.log("search clicked");
	var usrn = $('username').val();
	if(usrn = "test"){
		var html = "<p style=\"text-align:left\">Name: Tester Username: test <a href=\"#\" class=\"btnAdd btn\">Add</a></p>";
		$('.friendsName').html(html);

		$('a.btnAdd').click(function(){
			console.log("add clicked");
			var row = $("<tr class=\"btnDelete\" data-id=\"5\"><td><h5>Tester<br/><small></small></h5></td><td><h5>test</h5></td><td><h5><br/><small></small></h5></td><td><h5></h5></td><td><a href=\"#\" class=\"btnDelete btn\" data-target=\"#my1Modal\">Delete</a></td></tr>");
			row.appendTo($('#friendsTable'));
			$('#myModal').modal('toggle');
		});
	}
});*/
