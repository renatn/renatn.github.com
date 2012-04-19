var i=0;
$('.skill-list-item-level span').each(function() 
{
    $(this).delay(((i++)*50)).animate({opacity:1},500);
});