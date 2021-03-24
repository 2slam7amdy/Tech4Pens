function showaccountinfo() {

	if (document.getElementById('settingsmenu').style.display == 'block') { $('#settingsmenu').addClass('animated fadeOutDown');$('#settingsmenu').fadeOut(200) }
	if (document.getElementById('accountinfo').style.display == 'block') { $('#accountinfo').addClass('animated fadeOutDown');$('#accountinfo').fadeOut(200) }
	else if (document.getElementById('accountinfo').style.display == 'none') { $('#accountinfo').addClass('animated pulse');$('#accountinfo').fadeIn(200) }


}

function showsettings() {

	if (document.getElementById('accountinfo').style.display == 'block') { $('#accountinfo').fadeOut(200) }
	if (document.getElementById('settingsmenu').style.display == 'block') { $('#settingsmenu').fadeOut(200) }
	else if (document.getElementById('settingsmenu').style.display == 'none') { $('#settingsmenu').addClass('animated fadeInLeft');$('#settingsmenu').fadeIn(200) }
}


function showapages() {

	if (document.getElementById('settingsmenu').style.display == 'block') { $('#settingsmenu').addClass('animated fadeOutDown');$('#settingsmenu').fadeOut(200) }
	if (document.getElementById('accountinfo').style.display == 'block') { $('#accountinfo').addClass('animated fadeOutDown');$('#accountinfo').fadeOut(200) }
	else if (document.getElementById('pages-contents').style.display == 'none') { $('#pages-contents').addClass('animated pulse');$('#pages-contents').fadeIn(200) }
}


function dropdown(element) {
$(element).addClass('animated flipInX');$(element).fadeIn(500);
}

$(document).mouseup(function (e)
{
    var container = $(".dropdown");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.fadeOut(200);
    }
});