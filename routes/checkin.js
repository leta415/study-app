exports.view = function(req, res) {
  res.render('checkin', {
    pageName: 'Check-ins',
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