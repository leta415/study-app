'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$('a.btnDelete').on('click', function (e) {
	    e.preventDefault();
	    var id = $(this).closest('tr').data('id');
	    $('#myModal').data('id', id).modal('show');
	});

	$('#btnDelteYes').click(function () {
	    var id = $('#myModal').data('id');
	    $('[data-id=' + id + ']').remove();
	    $('#myModal').modal('hide');
	});
}

