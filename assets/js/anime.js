$(document).ready(function () 
{
	//anime.js
	function erSignIn() {
		//google sign in button with anime.js effects
		$('#btn-googleSignIn').mouseenter(function(){
			$('.textER1').each(function(){
				$(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='textER1'>$&</span>"));
			});
			anime.timeline()
			.add({
				targets: "#btn-googleSignIn",
				easing: 'easeInOutQuad',
				scale: 1.5,
				borderRadius: ['0%', '45%']
				})
				.add({
					targets: '.textER1',
					color: '#FFF',
					opacity: [1],
					translateZ: 0,
					easing: "linear",
					duration: 2000,
					delay: function(el, i) {
						return 70 * (i+1)
					}
			 }).add({
					targets: '.textER1',
					color: 'rgb(153,255,187)',
				  opacity: [0,1],
				  duration: 1000,
				  easing: "linear",
				  delay: 500
				 });
				
				$('#btn-googleSignIn').mouseleave(function(){
						anime({
							targets: '#btn-googleSignIn',
							easing: 'easeInOutQuad',
							color: '#6c757d',
							scale: 1,
							borderRadius: ['0%']
					});
				});
			});
			// Guest sign in button with anime.js effects
		$('#btn-noSignIn').mouseenter(function(){
		$('.textER2').each(function(){
		  $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='textER2'>$&</span>"));
		});
		anime.timeline()
			.add({
				targets:'#btn-noSignIn',
				easing: 'easeInOutQuad',
				scale: 1.5,
				borderRadius: ['0%', '45%']
			})
		  .add({
			targets: '.textER2',
				scale: [0.3,1],
				color: '#FFF',
			opacity: [1],
			translateZ: 0,
				easing: "easeOutExpo",
				direction: 'alternate',
			duration: 600,
			delay: function(el, i) {
			  return 70 * (i+1)
			}
		 }).add({
				targets: '.textER2',
				color: 'rgb(153, 221, 255)',
			opacity: [0,1],
			duration: 1000,
			easing: "linear",
				delay: 500,
			})
		});
		$('#btn-noSignIn').mouseleave(function(){
			anime.timeline()
				.add({
					targets: '#btn-noSignIn',
					easing: 'easeInOutQuad',
					color: '#6c757d',
					scale: 1,
					borderRadius: ['0%']
			});
		});	
	}
erSignIn();
anime({
	targets: '.paw',
	easing: 'steps(10)',
	direction: 'alternate',
	translateY: -1000,
	scale:[2, 3, 1, 3],
	loop: true,
	duration: 3000
});
anime({
	targets: '.paw1',
	easing: 'steps(9)',
	direction: 'alternate',
	translateY: -1000,
	scale:[2, 1, 3, 2],
	loop: true,
	duration: 3000
});
anime({
	targets: '.paw2',
	easing: 'steps(10)',
	direction: 'alternate',
	translateY: -1000,
	scale:[2, 1, 3, 2],
	loop: true,
	duration: 3000
});
anime({
	targets: '.paw3',
	easing: 'steps(9)',
	direction: 'alternate',
	translateY: -1000,
	scale:[2, 3, 1, 3],
	loop: true,
	duration: 3000
 });
$("#mapid").on("click", function(){
anime({
  targets: '#mapid',
	translateX: 250,
	translateZ: 1,
	borderRadius: ['10%'],
  scale: 2,
	rotate: '1turn'	
});
$("#mapid").mouseleave(function(){
	anime({
		targets: "#mapid",
		translateX: 0,
		scale: 1,
		rotate: "1turn",
		borderRadius: ['0%']
	});
});
});
//////////// anime.js
});