//This function will run automatically after the page is loaded
$(document).ready(function() 
{
	$('div.htmltabs div.tabsContent').hide();//tabsContent class is used to hide all the tabs content in the start
	$('div.tab1').show(); // It will show the first tab content when page load, you can set any tab content you want - just put the tab content class e.g. tab4
	$('div.htmltabs ul.tabs li.tab1 a').addClass('tab-current');// We will add the class to the current open tab to style the active state
	//It will add the click event on all the anchor tag under the htmltabs class to show the tab content when clicking to the tab
	$('div.htmltabs ul li a').click(function()
	{
		var thisClass = this.className.slice(0,4);//"this" is the current anchor where user click and it will get the className from the current anchor and slice the first part as we have two class on the anchor 
		$('div.htmltabs div.tabsContent').hide();// It will hide all the tab content
		$('div.' + thisClass).show(); // It will show the current content of the user selected tab
		$('div.htmltabs ul.tabs li a').removeClass('tab-current');// It will remove the tab-current class from the previous tab to remove the active style
		$(this).addClass('tab-current'); //It will add the tab-current class to the user selected tab
	});
});