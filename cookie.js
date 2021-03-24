

function display() {

	if (document.cookie.indexOf("tpbr") >= 0) {
	document.getElementById('tbds').checked = 'checked';
	$(".bar").css('position','absolute');
	$("#appmenu").css('position','absolute');
	$("#accountinfo").css('position','absolute');
	$("#settingsmenu").css('position','absolute');
	$(".notif1").css('position','absolute');
	}

	if (document.cookie.indexOf("sdbr") <= 0) {
	$(".sidebar").fadeIn(500);
	$("#homebody").css('margin-left','250px');
	}
	else { document.getElementById('sbds').checked = 'checked'; }
}

function tpbrcck() {
	if (document.cookie.indexOf("tpbr") >= 0) {
	document.cookie="tpbr=cck; expires=Thu, 18 Dec 1970 12:00:00 GMT";
	}
	else {
	document.cookie="tpbr=cck; expires=Thu, 18 Dec 2070 12:00:00 GMT";
	}
}

function sdbrcck() {
	if (document.cookie.indexOf("sdbr") >= 0) {
	document.cookie="sdbr=cck; expires=Thu, 18 Dec 1970 12:00:00 GMT";
	}
	else {
	document.cookie="sdbr=cck; expires=Thu, 18 Dec 2070 12:00:00 GMT";
	}
}


$(document).mouseup(function (e)
{
    var container = $(".menus");

    if (!container.is(e.target)
        && container.has(e.target).length === 0)
    {
        container.hide();
    }
});