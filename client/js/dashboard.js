var Users = function(){
	this.apiUrl = 'http://localhost:3000/api/users';
	this.cant = 30;
	this.tableID = $('#user-table');
	this.filter = '';
}

Users.prototype.get = function(){
	$.ajax({
	  url: this.apiUrl,
	  data: {},
	  success: function(data){
	  	$('#loading').fadeOut();
	  	$('#table-conatiner-users').fadeIn();
	  	$.each(data, function(i, item) {
	  	//Si tengo un filtro lo agrego
		  	if(this.filter != ''){

		  	}else{
		  		 $('#user-table').append('<tr><td class="mdl-data-table__cell--non-numeric">'+data[i].firstname+' '+data[i].lastname+'</td><td>'+data[i].email+'</td><td>'+data[i].access+'</td><td><i class="material-icons">create</i><i class="material-icons">delete</i></td></tr>');
		  	}
		  	
		 
		})
	  	
	  },
	  dataType: 'json'
	});
}

Users.prototype.addFilter = function(filter){
	this.filter = filter
}

var users = new Users;
users.get();