$(function () {
     $("input.slider__range").slider({
        step: 1,
        min: 0,
        max: 1000,
        tooltip: 'hide',
        selection:'none'
    });

   autosize($('.description__textarea'));
});