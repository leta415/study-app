exports.view = function(req, res) {
  res.render('checkin', {
  	"nearby": [
  		{
  			"name": "Geisel Library"
  		},
  		{
  			"name": "Biomedical Library"
  		}, 
  		{
  			"name": "Computer Science Basement"
  		}, 
  		{
  			"name": "Richard Atkinson Hall"
  		}, 
  		{
  			"name": "Applied Physics and Mathematics Building"
  		}
  	]
  });
};