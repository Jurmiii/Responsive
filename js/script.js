        // 대상을 지정하는 방법은 자바스크립트에서 변수
        // jQuery $("")
        $(".hide-btn").click(function(){
            $(".text1").hide(1000);
        })
        $(".show-btn").click(function(){
            $(".text1").show(1000);
            $(".text1").css("color","red");
        })
        $(".toggle-btn").click(function(){
            $(".text1").toggle(1000);
        })

        // fadeIn / out
        $(".fade-in").click(function(){
            $(".text2").fadeIn();
        })
        $(".fade-out").click(function(){
            $(".text2").fadeOut();
        })
        $(".fade-toggle").click(function(){
            $(".text2").fadeToggle();
        })

        // slide
        $(".slide-up").click(function(){
            $(".text3").slideUp();
        })
        $(".slide-down").click(function(){
            $(".text3").slideDown();
        })
        $(".slide-toggle").click(function(){
            $(".text3").slideToggle();
        });
// animation
$(".ani-btn").click(function(){
    $(".box-1").stop().animate({
        left: '+=250px',
        opacity: '0.5',
        height: '150px',
        width: '150px'
    })
})

let mot = $(".mot-btn");
let aniBox = $(".box-2");

mot.click(function(){
    aniBox.animate({
        height: '300px',
        opacity: '0.4',
    },1000);
    aniBox.animate({
        width: '300px',
        opacity: '0.8',
        fontSize: '3em'
    },2000);
    aniBox.animate({
        height: '100px',
        opacity: '1'
    },1000);
    aniBox.animate({
        width: '100px'
    });
})