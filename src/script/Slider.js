class Slider {
  static bootstrap () {
    const sliderNodes = document.querySelectorAll('.slider-module')
    for (const sliderModule of sliderNodes) {
      addEventListener(sliderModule)
    }
  }
}
export {Slider as default}

function addEventListener (sliderModule) {
  const buttonNodes = sliderModule.getElementsByTagName('button')
  for (const button of buttonNodes) {
    button.addEventListener('click', event => {
      document.activeElement.blur()
      const slidableNode = sliderModule.getElementsByClassName('slidable')[0]
      const forward = event.currentTarget.classList.contains('next')
      slide(slidableNode, forward, sliderModule)
    })
  }
}

function slide (slidableNode, forward, sliderModule) {
  const step = 100 / sliderModule.getAttribute('data-step')
  const position = getTranslateX(slidableNode)
  let translateX = forward ? position - step : position + step
  const prevButtonNode = sliderModule.getElementsByClassName('prev')[0]
  const nextButtonNode = sliderModule.getElementsByClassName('next')[0]
  const maxSlide = (sliderModule.getElementsByClassName('item').length - (100 / step)) * step
  prevButtonNode.classList.remove('inactive')
  nextButtonNode.classList.remove('inactive')
  if (translateX >= 0) {
    translateX = 0
    prevButtonNode.classList.add('inactive')
  } else if (translateX <= -maxSlide) {
    translateX = -maxSlide
    nextButtonNode.classList.add('inactive')
  }
  addTransfromStylesToElement(slidableNode, translateX)
}

function addTransfromStylesToElement (element, translateX) {
  element.style.transform = `translateX(${translateX}%)`
  element.style.webkitTransform = `translateX(${translateX}%)`
  element.style.msTransform = `translateX(${translateX}%)`
  element.setAttribute('data-translate-x', translateX)
}

function getTranslateX (element) {
  const translateX = element.getAttribute('data-translate-x')
  if (translateX) {
    return parseFloat(translateX)
  } else {
    return 0
  }
}
