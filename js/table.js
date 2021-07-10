$(function(){

    $.each($(".print-tab .print-tab-menu > li"), function(index, value){
        var menu = $(value).data('tab-menu');
        var tabID = $(value).parent().parent().data('tab-id');
        var hash = window.location.hash.split("#").join('');
        
        if(hash.length > 0){
                
            if(menu == hash){
                $('.print-tab[data-tab-id="' + tabID + '"] .print-tab-menu > li[data-tab-menu="' + menu + '"]').addClass('active');
                $('.print-tab[data-tab-id="' + tabID + '"] .print-tab-content > div[data-tab-content="' + menu + '"]').addClass('view');
            }
            
        }else{
            $('.print-tab[data-tab-id="' + tabID + '"] .print-tab-menu > li:eq(0)').addClass('active');
            $('.print-tab[data-tab-id="' + tabID + '"] .print-tab-content > div:eq(0)').addClass('view');
        }
    });
    


    $(".print-tab .print-tab-menu > li").click(function(event){
        var $this = $(this),
            $data = $this.data('tab-menu'),
            $tabID = $this.parent().parent().data('tab-id');
        if(!$(this).hasClass("active")){

            window.location.hash = $data;
            
            $('.print-tab[data-tab-id="' + $tabID + '"] .print-tab-menu > li').removeClass('active');
            $(this).addClass('active');
            
            $('.print-tab[data-tab-id="' + $tabID + '"] .print-tab-content > div.view').removeClass('view');
            $('.print-tab[data-tab-id="' + $tabID + '"] .print-tab-content > div[data-tab-content="' + $data + '"]').addClass('view');
        }
    });
});