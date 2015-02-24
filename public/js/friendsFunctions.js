// Get friends data
//var data = require('../json/friends.json');

$(document).ready(function() {
    $('#friendsTable').DataTable({
    	"paging": false,
    	"info": false/*,
    	"dom": '<"search">lt'*/
    });
} );

//delete friends
$('a.btnDelete').on('click', function (e) {
    console.log("delete clicked");
    e.preventDefault();
    var id = $(this).closest('tr').data('id');
    $('#my1Modal').data('id', id).modal('show');
});

$('#btnDelteYes').click(function (e) {
    e.preventDefault();
	console.log("yes clicked");
    var id = $('#my1Modal').data('id');
    var url ='/delete/'+ id;

    function refresh(json){
        location.reload(true);
    }
    $.get(url, refresh);

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
    console.log("search clicked");
    var usrname = $('.search').val();
    var url = '/search/' + usrname;
    console.log(url);
    function displayFriendName(json){
        var displayName = json.displayName;
        var friendUsername = json.username;
        var html = "<ul class=\"text-left list-inline\"> <li>Name: " + displayName +"</li><li>Username: " + friendUsername + "</li><li><a href=\"#\" class=\"btnAdd btn\" >Add</a></li></ul>";
        $('.friendsName').html(html);

        //adding friend
        $('a.btnAdd').click(function(){
            $('#myModal').modal('toggle');
            //get the user details and add it to friends db
            var url = '/user/' +displayName + '/' + friendUsername;
            function refresh(json){
                location.reload(true);
            }
            $.get(url, refresh);
        });
    }

    $.get(url, displayFriendName);

});

