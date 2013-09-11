$(document).ready(function() 
{
    var page=
    {
        'about'         :   {tab:'tab-1',html:'page-1.html',js:'page-1.js',main:1,openStart:0},
        'portfolio'     :   {tab:'tab-2',html:'page-2.html',js:'page-2.js',main:1,openStart:0},
        'resume'        :   {tab:'tab-3',html:'page-3.html',js:'page-3.js',main:1,openStart:0},
        'contact'       :   {tab:'tab-4',html:'page-4.php',js:'page-4.js',main:1,openStart:0}
    };

    $('.cascade').cascade(page);

    $.getJSON('http://twitter.com/statuses/user_timeline.json?screen_name=renatn&count=5&callback=?', function(data) 
    {
        if(data.length)
        {
            var list=$('<ul>');
            $(data).each(function(index,value)
            {
                list.append($('<li>').append($('<p>').html(linkify(value.text))));
            });

            $('#latest-tweets').append(list);

            list.bxSlider(
            {
                auto: true,
                mode:'vertical',
                nextText:null,
                prevText:null,
                displaySlideQty:1,
                pause:5000
            });  

            $('#latest-tweets a').attr('target','_blank');
        }
    });
});