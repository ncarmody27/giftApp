let uri = 'api/bears';
let testV;

function getAllBears(form){
	$.ajax({
		type: 'GET',
		url: uri,
		success: function(data){
			console.log(data);
			$('#bears').html(Object.entries(data).map(x=> `<p>name: ${x[1].name} id: ${x[1]._id}</p>`));
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
			testV = data;
			$('#bears').html(`<p>name: ${data[0].name} id: ${data[0]._id}</p>`);
		},
		error: function(jqXHR, textStatus, err){
			console.log(err);
		}
	})
}

function postBear(form){
	let name = form.name.value;
	console.log(name);
	$.ajax({
		type: 'POST',
		url: uri +'?'+ 'name='+name,
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
	//console.log(info);
	console.log(uri + '/'+id + '?'+"name="+info);
	$.ajax({
		type: 'POST',
		url: uri + '/'+id + '?'+"name="+info,
		success: function(data){
			//console.log(data);
		},
		error: function(jqXHR, textStatus, err){
			console.log(err);
		}
	})
}

function deleteBear(form){
	let id = form.id.value;
	console.log(id);
	$.ajax({
		type: 'DELETE',
		url: uri + '/' +id,
		success: function(data){
			$('#bears').html(`<p>BEAR DELETED, id: ${id}</p>`);
		},
		error: function(jqXHR, textStatus, err){
			console.log(err);
		}
	})
}
