$(document).ready(function() {
	window.isMobile = (window.innerWidth <= 768 )? true : false;
	initPage();
});
function initPage(){
	initTopLinkButton();
	initTabs();
	initScrollController();
	initPopup();
	fixedHeader();
	mobileMenu();
	//ロールオーバー：透明度で処理
	$('.allbtn_ro a img, a img.btn_ro, .allbtn_ro input:image, input.btn_ro:image, .allbtn_txt a, .btn_txt').hover(function(){
		$(this).stop().fadeTo(200, 0.6);
	},function(){
		$(this).stop().fadeTo(200, 1.00);
	});
	
	getUserAgent('iphone','iphone',document.body);
}



function getUserAgent(need,className,element){
  
 var userAgent = window.navigator.userAgent.toLowerCase();
 
 var result = userAgent.indexOf(need) !== -1;
 
 if(result){
  if(className != undefined && element != undefined && element instanceof Element){
   element.classList.add(className);
   return true;
  }else{
   return need;
  }
 }else{
  return false;
 }
  
}



// Fixed Header
function fixedHeader(){
	jQuery(document).on("scroll",function(){
		if (jQuery(window).scrollTop() > 10){
		    jQuery('body').addClass('small-header');
		}else{
		    jQuery('body').removeClass('small-header');
		}
	});
	
}


/* Mobile Menu */
function mobileMenu(){
	$('a.mobile-opener').click(function(e){
		e.preventDefault();
		$('body').toggleClass('nav-visible');
	});
	//add 2017/03/17
	$('a[href="#red-tabs"]').on("click",function(){
		$('body').removeClass('nav-visible');
	});
}

/* Fixed menu and scroll to top link */
function ScrollController_render(_x){
	
	0 == isMobile && (function(){ 
	
		_x.headMenu = document.querySelector('.main-nav'), 
		_x.mainHead = document.getElementById('header'), 
		_x.needToScroll = (_x.headMenu.offsetTop - _x.mainHead.clientHeight - 2); 
		
	}()) || !!isMobile && (function(){ 
		_x.mobileButtonOffTop = document.querySelector('.tab:not(.js-tab-hidden) .button-holder');
		_x.mobileButtonsFix = document.querySelector('.mobile-buttons');
	}());
	
}


function initScrollController(){
	
	var _x = { headMenu:false, mainHead:false, needToScroll:false, mobileButtonOffTop:false, mobileButtonsFix:false };
	
	
	window.onscroll = function(){
		
		 var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
		 		
		ScrollController_render(_x);
	
		0 == isMobile && (function(){ 
		
			(scrollPosition >= _x.needToScroll && (function(){
				document.body.classList.add('nav-fixed');
				document.querySelector('.link-to-top').classList.add('visible');
				
			}())) || (scrollPosition < _x.needToScroll && (function(){
				document.body.classList.remove('nav-fixed');
				document.querySelector('.link-to-top').classList.remove('visible');
			}()))
			
		}()) || !!isMobile && (function(){
			
			scrollPosition && scrollPosition > 0 && 
				(document.querySelector('.link-to-top').classList.add('visible')) || 
			!scrollPosition && 
				(document.querySelector('.link-to-top').classList.remove('visible'))
				
			if(scrollPosition > _x.mobileButtonOffTop.offsetTop - window.innerHeight + _x.mobileButtonsFix.clientHeight)
				_x.mobileButtonsFix.style.display = 'none';
			else
				_x.mobileButtonsFix.style.display = 'block';
				
			if( scrollPosition > _x.mobileButtonOffTop.offsetTop + 50)
				_x.mobileButtonsFix.style.display = 'block';
			
		}())
	}
	
}

/* Link To Top */
function initTopLinkButton(){
	$('.link-to-top').click(function(e){
		e.preventDefault();
		$('html,body').animate({scrollTop:0},'slow');
	})
}

// tabs init
function initTabs() {
	jQuery('ul.tabset').contentTabs({
		autoHeight:true,
		animSpeed:300,
		effect: 'fade'
	});
}

/*
 * jQuery Tabs plugin
 */
;(function($){
	$.fn.contentTabs = function(o){
		// default options
		var options = $.extend({
			activeClass:'active',
			addToParent:true,
			autoHeight:false,
			autoRotate:false,
			animSpeed:400,
			switchTime:3000,
			effect: 'none', // "fade", "slide"
			tabLinks:'a',
			event:'click'
		},o);

		return this.each(function(){
			var tabset = $(this);
			var tabLinks = tabset.find(options.tabLinks);
			var tabLinksParents = tabLinks.parent();
			var prevActiveLink = tabLinks.eq(0), currentTab, animating;
			var tabHolder;
			
			// init tabLinks
			tabLinks.each(function(){
				var link = $(this);
				var href = link.attr('href');
				var parent = link.parent();
				href = href.substr(href.lastIndexOf('#'));
				
				// get elements
				var tab = $(href);
				link.data('cparent', parent);
				link.data('ctab', tab);
				
				// find tab holder
				if(!tabHolder && tab.length) {
					tabHolder = tab.parent();
				}
				
				// show only active tab
				if((options.addToParent ? parent : link).hasClass(options.activeClass)) {
					prevActiveLink = link; currentTab = tab;
					tab.removeClass(tabHiddenClass).width('');
					contentTabsEffect[options.effect].show({tab:tab, fast:true});
				} else {
					contentTabsEffect[options.effect].hide({tab:tab, fast:true});
					tab.width(tab.width()).addClass(tabHiddenClass);
				}
				
				// event handler
				link.bind(options.event, function(e){
					if(link != prevActiveLink && !animating) {
						switchTab(prevActiveLink, link);
						prevActiveLink = link;
					}
					e.preventDefault();
				});
				if(options.event !== 'click') {
					link.bind('click', function(e){
						e.preventDefault();
					});
				}
			});
			
			// tab switch function
			function switchTab(oldLink, newLink) {
				animating = true;
				var oldTab = oldLink.data('ctab');
				var newTab = newLink.data('ctab');
				currentTab = newTab;
				
				// refresh pagination links
				(options.addToParent ? tabLinksParents : tabLinks).removeClass(options.activeClass);
				(options.addToParent ? newLink.data('cparent') : newLink).addClass(options.activeClass);
				
				// hide old tab
				resizeHolder(oldTab, true);
				contentTabsEffect[options.effect].hide({
					speed: options.animSpeed,
					tab:oldTab,
					complete: function() {
						// show current tab
						resizeHolder(newTab.removeClass(tabHiddenClass).width(''));
						contentTabsEffect[options.effect].show({
							speed: options.animSpeed,
							tab:newTab,
							complete: function() {
								if(!oldTab.is(newTab)) {
									oldTab.width(oldTab.width()).addClass(tabHiddenClass);
								}
								animating = false;
								resizeHolder(newTab, false);
								autoRotate();
							}
						});
					}
				});
			}
			
			// holder auto height
			function resizeHolder(block, state) {
				var curBlock = block && block.length ? block : currentTab;
				if(options.autoHeight && curBlock) {
					tabHolder.stop();
					if(state === false) {
						tabHolder.css({height:''});
					} else {
						var origStyles = curBlock.attr('style');
						curBlock.show().css({width:curBlock.width()});
						var tabHeight = curBlock.outerHeight(true);
						if(!origStyles) curBlock.removeAttr('style'); else curBlock.attr('style', origStyles);
						if(state === true) {
							tabHolder.css({height: tabHeight});
						} else {
							tabHolder.animate({height: tabHeight}, {duration: options.animSpeed});
						}
					}
				}
			}
			if(options.autoHeight) {
				$(window).bind('resize orientationchange', function(){
					resizeHolder(currentTab, false);
				});
			}
			
			// autorotation handling
			var rotationTimer;
			function nextTab() {
				var activeItem = (options.addToParent ? tabLinksParents : tabLinks).filter('.' + options.activeClass);
				var activeIndex = (options.addToParent ? tabLinksParents : tabLinks).index(activeItem);
				var newLink = tabLinks.eq(activeIndex < tabLinks.length - 1 ? activeIndex + 1 : 0);
				prevActiveLink = tabLinks.eq(activeIndex);
				switchTab(prevActiveLink, newLink);
			}
			function autoRotate() {
				if(options.autoRotate && tabLinks.length > 1) {
					clearTimeout(rotationTimer);
					rotationTimer = setTimeout(nextTab, options.switchTime);
				}
			}
			autoRotate();
		});
	}
	
	// add stylesheet for tabs on DOMReady
	var tabHiddenClass = 'js-tab-hidden';
	$(function() {
		var tabStyleSheet = $('<style type="text/css">')[0];
		var tabStyleRule = '.'+tabHiddenClass;
		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
		if (tabStyleSheet.styleSheet) {
			tabStyleSheet.styleSheet.cssText = tabStyleRule;
		} else {
			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
		}
		$('head').append(tabStyleSheet);
	});
	
	// tab switch effects
	var contentTabsEffect = {
		none: {
			show: function(o) {
				o.tab.css({display:'block'});
				if(o.complete) o.complete();
			},
			hide: function(o) {
				o.tab.css({display:'none'});
				if(o.complete) o.complete();
			}
		},
		fade: {
			show: function(o) {
				if(o.fast) o.speed = 1;
				o.tab.fadeIn(o.speed);
				if(o.complete) setTimeout(o.complete, o.speed);
			},
			hide: function(o) {
				if(o.fast) o.speed = 1;
				o.tab.fadeOut(o.speed);
				if(o.complete) setTimeout(o.complete, o.speed);
			}
		},
		slide: {
			show: function(o) {
				var tabHeight = o.tab.show().css({width:o.tab.width()}).outerHeight(true);
				var tmpWrap = $('<div class="effect-div">').insertBefore(o.tab).append(o.tab);
				tmpWrap.css({width:'100%', overflow:'hidden', position:'relative'}); o.tab.css({marginTop:-tabHeight,display:'block'});
				if(o.fast) o.speed = 1;
				o.tab.animate({marginTop: 0}, {duration: o.speed, complete: function(){
					o.tab.css({marginTop: '', width: ''}).insertBefore(tmpWrap);
					tmpWrap.remove();
					if(o.complete) o.complete();
				}});
			},
			hide: function(o) {
				var tabHeight = o.tab.show().css({width:o.tab.width()}).outerHeight(true);
				var tmpWrap = $('<div class="effect-div">').insertBefore(o.tab).append(o.tab);
				tmpWrap.css({width:'100%', overflow:'hidden', position:'relative'});
				
				if(o.fast) o.speed = 1;
				o.tab.animate({marginTop: -tabHeight}, {duration: o.speed, complete: function(){
					o.tab.css({display:'none', marginTop:'', width:''}).insertBefore(tmpWrap);
					tmpWrap.remove();
					if(o.complete) o.complete();
				}});
			}
		}
	}
}(jQuery));


/* Popup initiation */
function initPopup() {
	$('a[data-popup]').click(function(e) {
		$('.popup').hide();
		e.preventDefault();
		var id = $(this).attr('data-popup');
		var maskHeight = $(document).height();
		$('.fader').css({'height':maskHeight});
		$('.fader').show();
		//$('#wrapper').hide();
		positionPopup();
		if($('#' + id).height() >= $(window).height()){
			$('#' + id).css({
				top: $(window).scrollTop(),
			});
		} else {
			$('#' + id).css({
				top: $(window).scrollTop()+ $(window).height()/2,
				marginTop: -$('#' + id).height()/2
			});
		}
		$('#' + id).show();
	});
	$('.popup-close').click(function (e) {
		e.preventDefault();
		$('.fader').hide();
		$('.popup').hide();
		//$('#wrapper').show();
	});
	$('.fader').click(function () {
		$(this).hide();
		$('.popup').hide();
		//$('#wrapper').show();
	});
}
/* Popup position */
function positionPopup(){
	if($('.popup').width() < $(document).width()){
		$('.popup').css({
			'marginLeft': -($('.popup').width())/2,
			'left': '50%'
		});
	}
	else{
		$('.popup').css({
			'marginLeft': 0,
			'left': 0
		});
	}
}