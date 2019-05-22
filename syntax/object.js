var members = ['egoing', 'k8805', 'hoya'];
console.log(members[1]); // k8805

for(var i in members){
	console.log(members[i])
	i += 1;
} 
var roles = {
  'programmer':'egoing',
  'designer' : 'k8805',
  'manager' : 'hoya'
}
console.log(roles.designer); //k8805