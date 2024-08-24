const pixelWrapper = document.querySelector('.pixel__wrapper')
const menu = document.querySelector('.menu')
const tog = document.querySelector('.toggle')

let menuActive = false 
let pixels = []

function getDimensions(){ // 초기설정 (화면크기가 변경될때마다 실행)
    pixelWrapper.innerHTML = ''
    // 윈도우 너비가 400보다 작으면 10개의 픽셀 컬럼, 400과 1000 사이면 30 컬럼, 1000보다 크면 50 컬럼
    let size = window.innerWidth < 400 ? 10 : window.innerWidth < 1000 ? 30: 50
    console.log(size)
    pixels = []

    // 픽셀너비 : 디바이스 너비 (px) / 컬럼수
    let pixelWidth = window.innerWidth / size  // 픽셀너비를 px 단위로 조회
    let height = window.innerHeight

    for (let i = 0; i < size; i++) {
        // console.log(i)
        let pixelColumn = document.createElement('div')
        pixelColumn.className = 'pixel_column'
        // 픽셀컬럼(픽셀)너비 : 디바이스 너비 (vw) / 컬럼수
        pixelColumn.style.width = `${100 / size}vw` // 픽셀너비를 vw 단위로 조회
        pixelWrapper.appendChild(pixelColumn)

        for (let j = 0; j < height; j += pixelWidth) { // 브라우저 높이를 pixelWidth 만큼씩 반복하면 한컬럼에 몇개의 픽셀이 들어가는지 계산됨
            let pixelDiv = document.createElement('div')
            pixelDiv.className = 'pixel'
            pixelDiv.style.height = `${pixelWidth}px` // 픽셀 하나의 높이는 픽셀너비와 같음
            pixels.push(pixelDiv) // 배열에 저장
            pixelColumn.appendChild(pixelDiv)
        }
    }
}
// setTimeout 이 없으면 예상대로 pixels 배열에 splice 를 하면 원본을 변경하므로 배열갯수가 줄어든다
// 
tog.addEventListener('click', (e) => {
    // console.log(pixels.length)
    menuActive = !menuActive

    if(!menuActive){
        menu.style.pointerEvents = 'none' 
        menu.style.opacity = '0' // nav 메뉴 보이기
    }

    // 결국 해당코드는 setTimeout 의 비동기 코드를 web api 쓰레드에 차례대로 푸쉬하고 마지막 이터레이션에서 마지막에 조건문의 코드를 푸쉬함
    // 즉, 픽셀이 하나씩 랜덤으로 보이거나 숨겨지고, 맨 마지막에는 pixelds.length 가 0이므로 조건문을 실행해서 다음 애니메이션을 위해 원본배열로 채워넣음
    for (let i = 0; i < pixels.length; i++) {
        // console.log(pixels.length)

        // for 문 끝나고 실행됨
        setTimeout(() => {
            
           let random = Math.floor(Math.random() * pixels.length)
           if(menuActive){
            pixels[random].classList.add('active') // 랜덤하게 픽셀이 하나씩 검정색으로 변함 (화면 가림)
           }else{
            pixels[random].classList.remove('active') // // 랜덤하게 픽셀이 하나씩 검정색으로 변함 (화면 보임)
           }
           pixels.splice(random, 1) // 이미 애니메이션 적용한 것은 더이상 적용하지 않기 위해 해당 픽셀은 제거함
           console.log(pixels.length) // setTimeout 내부에서는 원본배열이 계속 변하므로 해당값이 계속 줄어든다
        }, i); // 1ms 간격을 두고 픽셀이 랜덤으로 보이거나 숨겨짐

        // setTimeout 함수는 비동기라서 맨 나중에 전부 실행되고 반복문 돌때 아래 코드만 계속 체크함
        // setTimeout 함수는 나중에 전부 실행되므로 splice 가 아직 동작하지 않았기 때문에 pixels.length 는 반복문 도는 동안 계속 원본길이로 일정하다.
        if(i === pixels.length - 1){ // 마지막 이터레이션
            setTimeout(() => {
                console.log("맨 마지막에 실행!")
                pixels = [...document.querySelectorAll('.pixel')] // 다음 애니메이션을 위해 원본배열로 초기화
                if(menuActive){
                    menu.style.pointerEvents = 'all' 
                    menu.style.opacity = '1' // nav 메뉴 보이기
                }
            }, i + 10) // pixels.length 가 200이면 i 는 199이고, 209로 해서 픽셀을 보여주는 setTimeout 이 모두 실행된 이후 맨 마지막에 실행되도록 하기 위해서 이렇게 값을 정함
        }
        // 반복문 초기의 setTimeout 의 콜백함수가 순서대로 콜백큐에 푸쉬되고 마지막 이터레이션에서 조건문 안의 setTimeout 의 콜백이 푸쉬됨
        // 이렇게 되면 순서대로 실행되므로 조건문 안의 콜백함수인 초기화는 맨 나중에 실행됨
    }
})

function reset(){
    menuActive = false 
    pixels = [...document.querySelectorAll('.pixel')] // 다음 애니메이션을 위해 원본배열로 초기화
    for (let i = 0; i < pixels.length; i++) {
        pixels[i].classList.remove('active')
    }
    menu.style.pointerEvents = 'none' 
    menu.style.opacity = '0' // nav 메뉴 보이기
}

getDimensions()


window.addEventListener('resize', () => {
    getDimensions() // pixel 요소를 도큐먼트에 추가
    reset() // pixel 요소 조회, pixel 요소 active 초기화, menu 초기화
})