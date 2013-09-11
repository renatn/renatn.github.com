/**************************************************************************/

$('.fancybox-image').fancybox({});

/**************************************************************************/

$('.fancybox-video-youtube').bind('click',function() 
{
    $.fancybox(
    {
        'padding'		: 0,
        'autoScale'		: false,
        'transitionIn'	: 'none',
        'transitionOut'	: 'none',
        'width'			: 680,
        'height'		: 495,
        'href'			: this.href.replace(new RegExp("watch\\?v=", "i"), 'v/'),
        'type':'swf',
        'swf':
        {
            'wmode'				: 'transparent',
            'allowfullscreen'	: 'true'
        }
    });

    return false;
});

$('.fancybox-video-vimeo').bind('click',function() 
{
	$.fancybox(
	{
		'padding'		: 0,
		'autoScale'		: false,
		'transitionIn'	: 'none',
		'transitionOut'	: 'none',
		'title'			: this.title,
		'width'			: 600,
		'height'		: 338,
		'href'			: this.href.replace(new RegExp("([0-9])","i"),'moogaloop.swf?clip_id=$1'),
		'type'			: 'swf',
        'swf':
        {
            'wmode'				: 'transparent',
            'allowfullscreen'	: 'true'
        }
	});
	
	return false;
});

/**************************************************************************/

$('.gallery-list img').captify();

/**************************************************************************/

$('.gallery-list').hover(

    function() {},
    function()
    {
        $(this).find('li img').animate({opacity:1},250);
    }	

);

/**************************************************************************/

$('.gallery-list li').hover(

    function() 
    {
        $(this).siblings('li').find('img').css('opacity',0.5);
        $(this).find('img').animate({opacity:1},250);
    },

    function()
    {
        $(this).find('img').css('opacity',1);	
    }

);

/**************************************************************************/