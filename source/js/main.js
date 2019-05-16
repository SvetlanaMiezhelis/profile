$(function () {
     $("input.slider__range").slider({
        step: 1,
        min: 0,
        max: 1000,
        tooltip: 'hide',
        selection:'none'
    });

    autoGrowTextArea(document.querySelector('.description__textarea'));
});

function autoGrowTextArea(element) {
    element.style.height = (element.scrollHeight) + "px";
}