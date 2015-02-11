/*'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
//function initializePage() {
/*	$('#myModal').on('show', function() {
		console.log("in show function");
	    var tit = $('.confirm-delete').data('title');

	    $('#myModal .modal-body p').html("You are about to delete bookmark " + '<b>' + tit +'</b>' + ' ?');
	})*/

/*	$('.confirm-delete').on('click', function(e) {
	    e.preventDefault();
	    console.log("delete button clicked");

	    var id = $(this).data('id');
	    console.log("id = " + id);
	    $('#myModal').modal('show');
	    //$('#myModal').data('id', id).modal('show');
	}); 

/*	$('#btnYes').click(function() {
	    // handle deletion here
	    var id = $('#myModal').data('id');
	    $('[data-id='+id+']').parents('tr').remove();
	    $('#myModal').modal('hide');
    });*/
//}

$('button.btnDelete').on('click', function (e) {
    e.preventDefault();
    var id = $(this).closest('tr').data('id');
    $('#myModal').data('id', id).modal('show');
});

$('#btnDelteYes').click(function () {
    var id = $('#myModal').data('id');
    $('[data-id=' + id + ']').remove();
    $('#myModal').modal('hide');
});