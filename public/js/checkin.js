$('#submitBtn').click(function() {
     /* when the button in the form, display the entered values in the modal */
     $('#location').html($('input[name=location]:checked').val());
});

$('#submit').click(function(){
     /* when the submit button in the modal is clicked, submit the form */
     // $('#confirm-submit').modal('hide');
});

$('#confirm-submit').on('hidden', function () {
  // Load up a new modal...
  alert("loading up new modal");
  $('#confirm-choice').modal('show');
})
