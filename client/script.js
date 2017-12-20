let uri = 'api/bears';

function getAllBears(form){
	$.ajax({
		type: 'GET',
		url: uri,
		success: function(data){
			console.log(data);
		},
		error: function(jqXHR, textStatus, err){
			console.log(err);
		}
	})
}

function getBear(form){
	let id = form.id.value;
	console.log(id);
	$.ajax({
		type: 'GET',
		url: uri + '/' +id,
		success: function(data){
			console.log(data);
		},
		error: function(jqXHR, textStatus, err){
			console.log(err);
		}
	})
}

function postBear(form){
	let info = form.info.value;
	console.log(info);
	$.ajax({
		type: 'POST',
		url: uri +'?'+ info,
		success: function(data){
			console.log(data);
		},
		error: function(jqXHR, textStatus, err){
			console.log(err);
		}
	})
}

function updateBear(form){
	let id = form.id.value;
	let info = form.info.value;
	console.log(info);
	$.ajax({
		type: 'POST',
		url: uri + '/'+ id+ '?'+info,
		success: function(data){
			console.log(data);
		},
		error: function(jqXHR, textStatus, err){
			console.log(err);
		}
	})
}