var prev = document.getElementById('btn-prev'),
    next = document.getElementById('btn-next');

var slides = document.querySelectorAll('.slide'),
    dots = document.querySelectorAll('.dot');

var slidesWrap = document.querySelectorAll('.slider-wrapper');

var index = 0;
var current = 0;


function addActiveToCurrentSlide(n) {
    for(slide of slides){
        slide.classList.remove('active');
    }
    slides[n].classList.add('active');
};
function addActiveToCurrentDot(n) {
    for(dot of dots){
        dot.classList.remove('active');
    }
    dots[n].classList.add('active');
};


function swipeLastSlideToFirst(){
    for(slide of slides){
        addActiveToCurrentSlide;
    }
    if(slides[index] == slides.length - 1){
        slides[index] == 0;
    }else{
        slides[index]++;
    };
};
function swipeFirstSlideToPrev(){
    for(slide of slides){
        addActiveToCurrentSlide;
    }
    if(slides[index] == 0){
        slides[index] = slides.length - 1;
        slides[index]--;
    }else{
        slides[index]--;
    };
};


function nextDot(){
    for(dot of dots){
        addActiveToCurrentDot;
    }
    if(dots[index] == dots.length - 1){
        dots[index] = 0;
    }else{
        dots[index]++;
    };
};
function prevDot(){
    for(dot of dots){
        addActiveToCurrentDot;
    }
    if(dots[index] == 0){
        dots[index] = dots.length - 1;
        dots[index]--;
    }else{
        dots[index]--;
    };
};

function nextSlide(){
    if(index == slides.length - 1){
        index = 0;
    }else{
        index++;
        addActiveToCurrentSlide(index);
        addActiveToCurrentDot(index);
    }
    swipeLastSlideToFirst(index);
    nextDot(index);
};
function prevSlide(){
    if(index == 0){
        index = slides.length;
    }else{
        index--;
        addActiveToCurrentSlide(index);
        addActiveToCurrentDot(index);
    }
    swipeFirstSlideToPrev(index);
    prevDot(index);
};

next.addEventListener('click', nextSlide);
prev.addEventListener('click', prevSlide);

next.addEventListener('click', nextDot);
prev.addEventListener('click', prevDot);
