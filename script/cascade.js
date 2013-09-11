
    (function($)
    {	
        /**********************************************************************/

        var Cascade=function(cascade,page)
        {
            /******************************************************************/
            
            var $this=this;

			$this.cascade=$(cascade);
            $this.cascadeWindow=cascade.find('.cascade-window');
            $this.cascadeElement=cascade.find('.cascade-menu li');
            $this.cascadeNavigation=cascade.find('.cascade-navigation');

            $this.enable=false;

            $this.currentHash='';
            $this.previousHash='#!/main';
            
            $this.page=page;

            $this.currentPage=-1;
            $this.previousPage=-1;
            
            $this.scrollbar='';
            
            $this.cascadeWindowWidth=640;
            $this.cascadeElementMargin=20;
            
            /******************************************************************/

            this.load=function()
            {
                var i=0,k=0,left=0;
                var width=parseInt($this.cascadeElement.first().css('width'));

                var image=$this.imageLoad($this.cascadeElement.first());
                image.bind('load',function() 
                {
                    $this.cascadeElement.each(function() 
                    {
                        var image=$this.imageLoad($(this).children('a').first());
                   
                        left=(width*k)+($this.cascadeElementMargin*k);
                        $(this).css('left',left);
                    
                        k++;

                        $(image).bind('load',function() 
                        {
                            if((++i)==$this.cascadeElement.length)
                            {
                                var j=0;

                                $this.cascade.removeClass('preloader');
                                $this.cascadeElement.css('display','block');

                                $this.cascadeElement.each(function() 
                                {
                                    $(this).animate({height:parseInt($this.cascade.css('height')),opacity:1},getRandom(100,1000),'easeInOutQuint',function()
                                    {
                                        if((++j)==$this.cascadeElement.length)
                                        {
                                            $this.enable=true;
                                            $this.handleHash();
                                        };
                                    });
                                });
                            };			
                        });
                    });
                });
            };
            
            /******************************************************************/
            
            this.imageLoad=function(object)
            {
                var image=$(document.createElement('img'));	
                var url=object.css('background-image').substring(4);
                    
                url=url.substring(0,url.length-1).replace(/"/ig,'');

                if($.browser.msie) image.attr('src',url+'?i='+getRandom(1,10000));
                else image.attr('src',url);
                
                return(image);
            };
            
            /******************************************************************/
            
            this.getFirstPage=function()
            {
                for(var key in $this.page) 
                {
                    if($this.page[key]['main']==1) return(key);
                };
                
                return(false);
            };
            
            /******************************************************************/
            
            this.getPrevPage=function()
            {
                var prev='';
                for(var key in $this.page)
                {
                    if(key==$this.currentPage && prev!='') return(prev);
                    else if($this.page[key]['main']==1) prev=key;
                };

                return(prev);
            };

            /******************************************************************/

            this.getNextPage=function()
            {
                var n=false;
                var next=$this.getFirstPage();

                for(var key in $this.page)
                {
                    if(n) 
                    {
                        if($this.page[key]['main']==1) return(key);
                    };
                    if(key==$this.currentPage) n=key;
                };

                return(next);
            };
            
            /******************************************************************/

            this.getPage=function(key,property)
            {
                return($this.page[key][property]);
            };
            
            /******************************************************************/
            
            this.getOpenStartPage=function()
            {
                for(var key in $this.page)
                {
                    if($this.page[key]['openStart']==1) return(key);
                };

                return(false);
            };          
            
            /******************************************************************/

            this.doHash=function()
            {
                if(!$this.enable) return(false);
                $this.enable=false;
                
                var open=$this.isOpen();
                
                var currentPage=$this.checkHash();
                if(currentPage==false) 
                {
                    $this.enable=true;
                    return(false);
                }
                
                $this.currentPage=currentPage;
                if($this.previousPage==-1) 
                    $this.previousPage=$this.currentPage;
                
                if($this.currentPage==-1) $this.close();
                else if(open) $this.close({'onComplete':function() { $this.open(); }});
                else $this.open();    
                
                return(true);
            };
            
            /******************************************************************/
            
            this.handleHash=function()
            {       
                $this.currentHash=window.location.hash;					
                if($this.currentHash!=$this.previousHash) $this.doHash();

                $(window).bind('hashchange',function(event) 
                {
                    event.preventDefault();

                    if($this.isEnable()==false) return;

                    $this.currentHash=window.location.hash;
                    $this.doHash();
                    $this.previousHash=$this.currentHash;
                }); 
                
                if(window.location.hash=='') 
                {
                    var start=$this.getOpenStartPage();
                    if(start==false) window.location.href='#!/main';
                    else window.location.href='#!/'+start;
                }
            };
            
            /******************************************************************/
            
            this.checkHash=function()
            {
                if($this.currentHash=='#!/main') return(-1);
                
                for(var id in $this.page)
                {
                    if('#!/'+id==$this.currentHash) return(id);
                };
                
                return(false);
            };

            /******************************************************************/

            this.open=function()
            {
                var i=0;
                var tab=$this.getPage($this.currentPage,'tab');
                var pagePath=$this.getPage($this.currentPage,'html');
                var scriptPath=$this.getPage($this.currentPage,'js');

                $('#'+tab).css('z-index',2);

                $this.cascadeElement.animate({left:0},500,'easeOutExpo',function() 
                {
                    i++;
                    if(i==$this.cascadeElement.length)
                    {
                        var className=$('#'+$this.getPage($this.currentPage,'tab')).attr('class').split(' ')[0].split('-')[0];
                        
                        $this.cascadeWindow.css('opacity','1').css('display','block').attr('class','cascade-window '+className);

                        $this.cascadeWindow.animate({width:$this.cascadeWindowWidth},500,'easeOutBounce',function()
                        {
                            $this.showPreloader(true);

                            $.get('page/'+pagePath,{},function(page) 
                            {			
                                $('.cascade-window-content').html(page);

                                $this.createScrollbar();
                                
                                $this.showPreloader(false);	
                                $this.showNavigation(true);

                                jQuery.getScript('page/script/main.js',function() 
                                {
                                    if(scriptPath!='')
                                        jQuery.getScript('page/script/'+scriptPath);
                                });
                                
                                $this.enable=true;

                                $this.previousPage=$this.currentPage;
                                $('#'+$this.getPage($this.currentPage,'tab')+' a').attr('href','#!/main');
                                
                                $this.createNavigation();
                            },
                            'html');
                        });
                    };
                });
            };
            
            /******************************************************************/
            
            this.close=function(data)
            {
                $(':input,a').qtip('destroy');
              
                $this.destroyScrollbar();
                $this.showNavigation(false);
                $('.cascade-window-content').html('');
                
                if($this.previousPage!='-1')
                    $('#'+$this.getPage($this.previousPage,'tab')+' a').attr('href','#!/'+$this.previousPage);
                
                $this.cascadeWindow.animate({width:'0px',opacity:0},500,'easeOutBounce',function() 	
                {
                    $this.cascadeWindow.css('display','none');
                    $this.expand(data);
                });	
            };
            
            /******************************************************************/

            this.expand=function(data)
            {
                var width=parseInt($this.cascadeElement.first().css('width'));
                var counter=0,done=0,left=-1*width;

                $this.cascadeElement.each(function() 
                {
                    $(this).css('z-index',1);
                    left+=width+((counter++)>0 ? $this.cascadeElementMargin : 0);

                    $(this).animate({left:left},500,'easeOutExpo',function()
                    {
                        done++;
                        if(done==$this.cascadeElement.length)
                        {
                            if(typeof(data)!='undefined')
                            {
                                if(typeof(data.onComplete)!='undefined') data.onComplete.apply();
                                else $this.enable=true;
                            }
                            else $this.enable=true;
                        };
                    });
                });
            };
            
            /******************************************************************/
            
            this.isOpen=function()
            {
                return($this.currentPage==-1 ? false : true);
            };
            
            /******************************************************************/
            
            this.isEnable=function()
            {
                if(!$this.enable)
                {
                    window.location.href=$this.previousHash;
                    return(false);
                }  
                
                return(true);
            };

            /***********************************************************/

            this.createNavigation=function()
            {
                var prev=$this.getPrevPage();				
                var next=$this.getNextPage();	
                
                $this.cascade.find('.cascade-navigation-prev').attr('href','#!/'+prev);
                $this.cascade.find('.cascade-navigation-next').attr('href','#!/'+next);
            };

            /******************************************************************/

            this.showNavigation=function(show)
            {
                if($this.cascadeElement.length>1)
                    $this.cascadeNavigation.css('display',show ? 'block' : 'none');
            };

            /******************************************************************/

            this.showPreloader=function(show)
            {
                if(show) $this.cascadeWindow.addClass('cascade-window-prealoder');
                else $this.cascadeWindow.removeClass('cascade-window-prealoder');
            };

            /******************************************************************/
            
            this.createScrollbar=function()
            {
                 $this.scrollbar=$('.cascade-window-content').jScrollPane({maintainPosition:false,autoReinitialise:true}).data('jsp');
            };
            
            /******************************************************************/

            this.destroyScrollbar=function()
            {
                if($this.scrollbar!='') 
                {
                    $this.scrollbar.destroy();
                    $this.scrollbar='';
                };              
            };

            /******************************************************************/
        };

        /**************************************************************/

        $.fn.cascade=function(page)
        {
            /***********************************************************/

            var cascade=new Cascade(this,page);
            cascade.load();

            /***********************************************************/
        };

        /**************************************************************/

    })(jQuery);