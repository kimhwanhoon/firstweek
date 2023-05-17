//요소 등록
const nav = document.querySelector('nav'); //nav 요소 등록
const modal = document.querySelector('modal1'); // 모달1 요소 등록
const backdrop = document.querySelector('.backdrop'); // 백드롭 요소 선택
const write = document.getElementById('write'); //작성하기 버튼 등록
const modal2 = document.querySelector('modal2'); //모달2 요소 등록
const modal2Send = document.getElementById('modal2Send'); //모달2 보내기 요소 등록
const modal2Close = document.getElementById('modal2Close'); //모달2 닫기 요소 등록
const footer = document.querySelector('footer'); //footer 요소 등록
//

// smooth scroll
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}
// nav창 및 로고 드래그 불가능하게 하기
nav.addEventListener('mousedown', function (event) {
    event.preventDefault();
});
footer.addEventListener('mousedown', function (event) {
    event.preventDefault();
});
// 로딩 화면 표시 함수
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}
// 로딩 화면 숨김 함수
// 로딩화면 일부러 1초 보이기
function hideLoading() {
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 300);
    modal.classList.toggle('hide');
    modal2.classList.toggle('hide');
}
// 페이지 로딩이 완료되면 로딩 화면 숨김
window.addEventListener('load', hideLoading);

//모달1 열기 함수
function modal1open() {
    modal.classList.toggle('hide'); //모달1 창 보이게하기
    backdrop.classList.toggle('hide'); //어두운 배경화면 보이게 하기
    modal.style.position = 'relative'; //모달1 창을 backdrop위에 위치시키기
    modal.classList.add('lightbox-fade-in'); //fade in 효과 주기
}
// 모달1 닫기 버튼 클릭 이벤트 등에 closeModal 함수를 연결하여 모달 창을 닫을 수 있도록 설정
const peopleModalClose = document.getElementById('people-modal-close');
peopleModalClose.addEventListener('click', () => {
    modal.classList.toggle('hide'); //모달1 숨김
    backdrop.classList.toggle('hide'); // 백드롭 숨김
});

//people에서 카드에 마우스 호버할 때, 커지게하고 마우스가 빠져나가면 원래대로 돌아가는 효과
const peopleCards = document.querySelectorAll('.card');
peopleCards.forEach((card) => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'scale(1.05)';
        card.style.transition = 'ease-out 0.4s';
    });
    card.addEventListener('mouseout', () => {
        card.style.transform = 'scale(1)';
        card.style.transition = 'ease-out 0.25s';
    });
});
// 모달 닫기 버튼 클릭 이벤트 등에 closeModal2 함수를 연결하여 모달 창을 닫을 수 있도록 설정
modal2Close.addEventListener('click', () => {
    modal2.classList.toggle('hide');
    backdrop.classList.toggle('hide'); // 백드롭 숨김
});

//작성하기 이벤트 함수
write.addEventListener('click', () => {
    modal2.classList.toggle('hide'); //모달2 창 보이게하기
    backdrop.classList.toggle('hide'); //어두운 배경화면 보이게 하기
    modal2.style.position = 'relative'; //모달2 창을 backdrop위에 위치시키기
    modal2.classList.add('lightbox-fade-in'); //fade in 효과 주기
});

// 여기부터는 app.py 배운거 몽고 DB와 연결

$(document).ready(function () {
    listing();
});
modal2Send.addEventListener('click', posting);

function listing() {
    fetch('/userinfo')
        .then((res) => res.json())
        .then((data) => {
            let userData = data.users;
            let dropdown1 = document.getElementById('dropdown1').value;
            let dropdown2 = document.getElementById('dropdown2').value;
            let messageTextArea =
                document.getElementById('messageTextArea').textContent;
            // userData의 첫번째 요소는 건너뛰기 (admin password)
            userData.forEach((element) => {
                dropdown1 = element.to;
                dropdown2 = element.from;
                messageTextArea = element.content;
                $('#message-card-container').append(`
                <div class="card message-card">
                <div class="message-card-first-div">
                    <p class="message-card-p1">To. ${dropdown1}</p>
                    <div>
                        <input class="modal2Edit" type="button" value="수정">
                        <input class="modal2Delete" type="button" value="삭제">
                    </div>
                </div>
                <textarea rows="5" cols="50" placeholder="example sentences, Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex similique nihil laudantium, quod ea cupiditate" readonly >${messageTextArea}</textarea>
                <div class="message-card-second-div">
                    <p class="message-card-p1">From.</p>
                    <p class="message-card-p1">${dropdown2}</p>
                </div>
            </div>
                `);
            });
        });
}

function posting() {
    let dropdown1 = document.getElementById('dropdown1').value;
    let dropdown2 = document.getElementById('dropdown2').value;
    let messageTextArea = document.getElementById('messageTextArea').value;

    let formData = new FormData();
    formData.append('to', dropdown1);
    formData.append('from', dropdown2);
    formData.append('content', messageTextArea);

    if (dropdown1 === '' || dropdown2 === '') {
        alert('수신자와 발신자를 확인하세요.');
        return undefined;
    }
    if (messageTextArea === '') {
        alert('내용을 입력해주세요.');
        return undefined;
    }
    fetch('/userinfo', { method: 'POST', body: formData })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            alert('전송 완료!');
            location.reload();
        })
        .catch((err) => {
            alert('오류가 발생하였습니다.\n\n다시 시도해주세요.)');
            messageTextArea = '';
        });
}

//people에서 more 클릭 하면 모달1 버튼나오게 하기 함수
const moreBtn0 = document.getElementById('more-btn0');
const moreBtn1 = document.getElementById('more-btn1');
const moreBtn2 = document.getElementById('more-btn2');
const moreBtn3 = document.getElementById('more-btn3');

// 모달1 GET 함수
function modal1Get0() {
    document.getElementById('loading').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 500);
    modal.classList.toggle('hide'); // 모달1 창 보이게하기
    backdrop.classList.toggle('hide'); // 어두운 배경화면 보이게 하기
    modal.style.position = 'relative'; // 모달1 창을 backdrop 위에 위치시키기
    modal.classList.add('lightbox-fade-in'); // fade in 효과 주기
    fetch('/intro')
        .then((res) => res.json())
        .then((data) => {
            console.log(data.intro[0]);
            const userIntro = data.intro[0];
            document.getElementById('modal1-img').src = userIntro.photo;
            document.getElementById('modal1-name').value = userIntro.name;
            document.getElementById('modal1-age').value = userIntro.age;
            document.getElementById('modal1-address').value = userIntro.address;
            document.getElementById('modal1-MBTI').value = userIntro.MBTI;
            document.getElementById('modal1-hobby').value = userIntro.hobby;
            document.getElementById('modal1-blog').value = userIntro.blog;
            document.getElementById('modal1-s&w').value = userIntro['s&w'];
            document.getElementById('modal1-resolve').value = userIntro.resolve;
        });
}

function modal1Get1() {
    document.getElementById('loading').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 500);
    modal.classList.toggle('hide'); // 모달1 창 보이게하기
    backdrop.classList.toggle('hide'); // 어두운 배경화면 보이게 하기
    modal.style.position = 'relative'; // 모달1 창을 backdrop 위에 위치시키기
    modal.classList.add('lightbox-fade-in'); // fade in 효과 주기
    fetch('/intro')
        .then((res) => res.json())
        .then((data) => {
            console.log(data.intro[1]);
            const userIntro = data.intro[1];
            document.getElementById('modal1-img').src = userIntro.photo;
            document.getElementById('modal1-name').value = userIntro.name;
            document.getElementById('modal1-age').value = userIntro.age;
            document.getElementById('modal1-address').value = userIntro.address;
            document.getElementById('modal1-MBTI').value = userIntro.MBTI;
            document.getElementById('modal1-hobby').value = userIntro.hobby;
            document.getElementById('modal1-blog').value = userIntro.blog;
            document.getElementById('modal1-s&w').value = userIntro['s&w'];
            document.getElementById('modal1-resolve').value = userIntro.resolve;
        });
}

function modal1Get2() {
    document.getElementById('loading').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 500);
    modal.classList.toggle('hide'); // 모달1 창 보이게하기
    backdrop.classList.toggle('hide'); // 어두운 배경화면 보이게 하기
    modal.style.position = 'relative'; // 모달1 창을 backdrop 위에 위치시키기
    modal.classList.add('lightbox-fade-in'); // fade in 효과 주기
    fetch('/intro')
        .then((res) => res.json())
        .then((data) => {
            console.log(data.intro[2]);
            const userIntro = data.intro[2];
            document.getElementById('modal1-img').src = userIntro.photo;
            document.getElementById('modal1-name').value = userIntro.name;
            document.getElementById('modal1-age').value = userIntro.age;
            document.getElementById('modal1-address').value = userIntro.address;
            document.getElementById('modal1-MBTI').value = userIntro.MBTI;
            document.getElementById('modal1-hobby').value = userIntro.hobby;
            document.getElementById('modal1-blog').value = userIntro.blog;
            document.getElementById('modal1-s&w').value = userIntro['s&w'];
            document.getElementById('modal1-resolve').value = userIntro.resolve;
        });
}

function modal1Get3() {
    document.getElementById('loading').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 500);
    modal.classList.toggle('hide'); // 모달1 창 보이게하기
    backdrop.classList.toggle('hide'); // 어두운 배경화면 보이게 하기
    modal.style.position = 'relative'; // 모달1 창을 backdrop 위에 위치시키기
    modal.classList.add('lightbox-fade-in'); // fade in 효과 주기
    fetch('/intro')
        .then((res) => res.json())
        .then((data) => {
            console.log(data.intro[3]);
            const userIntro = data.intro[3];
            document.getElementById('modal1-img').src = userIntro.photo;
            document.getElementById('modal1-name').value = userIntro.name;
            document.getElementById('modal1-age').value = userIntro.age;
            document.getElementById('modal1-address').value = userIntro.address;
            document.getElementById('modal1-MBTI').value = userIntro.MBTI;
            document.getElementById('modal1-hobby').value = userIntro.hobby;
            document.getElementById('modal1-blog').value = userIntro.blog;
            document.getElementById('modal1-s&w').value = userIntro['s&w'];
            document.getElementById('modal1-resolve').value = userIntro.resolve;
        });
}

moreBtn0.addEventListener('click', modal1Get0);
moreBtn1.addEventListener('click', modal1Get1);
moreBtn2.addEventListener('click', modal1Get2);
moreBtn3.addEventListener('click', modal1Get3);
