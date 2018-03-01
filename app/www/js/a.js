$('.ax').on('click', function() {
	$('.arquivo').trigger('click');
});

$('.arquivo').on('change', function() {
	var fileName = $(this)[0].files[0].name;
    $('#file').val(fileName);
});