$(document).ready(function(){
	var finalString = '';
	var text = $('#tabla td').html();
	var textSeparado = text.split(' ');
	
	textSeparado.pop();
	

	var newText = textSeparado[textSeparado.length -3]+'&nbsp;'+textSeparado[textSeparado.length -2]+'&nbsp;'+textSeparado[textSeparado.length -1];
	textSeparado.splice(textSeparado.length -3, 3);
	console.log(textSeparado);
	textSeparado.push(newText);
	console.log(textSeparado);
	for(var i = 0; i <= textSeparado.length - 1; i++){
		finalString+=textSeparado[i]+' ';
	}
	console.log(finalString);
	$('#tabla td').html(finalString)
});