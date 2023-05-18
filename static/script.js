//요소 등록
const nav = document.querySelector('nav'); //nav 요소 등록
const modal = document.querySelector('modal1'); // 모달1 요소 등록
const backdrop = document.querySelector('.backdrop'); // 백드롭 요소 선택
const write = document.getElementById('write'); //작성하기 버튼 등록
const modal2 = document.querySelector('modal2'); //모달2 요소 등록
const modal2Send = document.getElementById('modal2Send'); //모달2 보내기 요소 등록
const modal2Close = document.getElementById('modal2Close'); //모달2 닫기 요소 등록
const moreBtn = document.querySelectorAll('.moreBtn'); //people에 more버튼들 요소 등록
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
    }, 1000);
    modal.classList.toggle('hide');
    modal2.classList.toggle('hide');
}
// 페이지 로딩이 완료되면 로딩 화면 숨김
window.addEventListener('load', hideLoading);

//people에서 more 클릭 하면 모달1 버튼나오게 하기 함수
moreBtn.forEach((btns) => {
    btns.addEventListener('click', modal1open);
});

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

// 버튼 추가<div class="card message-card">
function listing() {
    fetch('/userinfo')
        .then((res) => res.json())
        .then((data) => {
            let userData = data.users;
            let dropdown1 = document.getElementById('dropdown1').value;
            let dropdown2 = document.getElementById('dropdown2').value;
            let messageTextArea = document.getElementById('messageTextArea').textContent;
            console.log(userData);
            userData.forEach((element) => {
                let id = element.id;
                dropdown1 = element.dropdown1;
                dropdown2 = element.dropdown2;
                messageTextArea = element.messageTextArea;
                $('#message-card-container').append(`
                <div class="card message-card">
                    <div class="message-card-buttons"> 
                        <div class="delete-button">
                            <button onclick="delete_post_by_id('${element.id}')" type="button" class="btn btn-sm btn_delete">del</button>
                        </div>
                        <div class="edit-button">
                            <button onclick="edit_post_by_id('${element.id}')" type="button" class="btn btn-sm btn_edit">edit</button>
                        </div>
                </div>
                <div class="message-card-first-div">
                    <p class="message-card-p1">To.</p>
                    <p class="message-card-p1">${dropdown1}</p>
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

//패스워드 입력 추가
function posting() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;
    let dropdown1 = document.getElementById('dropdown1').value;
    let dropdown2 = document.getElementById('dropdown2').value;
    let messageTextArea = document.getElementById('messageTextArea').value;

    let formData = new FormData();
    formData.append('password', password);
    formData.append('dropdown1', dropdown1);
    formData.append('dropdown2', dropdown2);
    formData.append('messageTextArea', messageTextArea);
    if (dropdown1 === '' || dropdown2 === '') {
        alert('수신자와 발신자를 확인하세요.');
        return undefined;
    }
    if (messageTextArea === '') {
        alert('내용을 입력해주세요.');
        return undefined;
    }
    if (password === '') {
        alert('비밀번호를 입력해주세요.')
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

//id값을 매개변수로 하고 비밀번호를 입력해야하는 삭제함수
function delete_post_by_id(id) {
    if (confirm('삭제하시겠습니까?')) {
        const password = prompt('비밀번호를 입력하세요:');
        if (password === null) {
            return; // 입력을 취소한 경우 함수 종료
        }

        const formData = new FormData();
        formData.append('id', id);
        formData.append('password', password);

        fetch('/userinfo', { method: 'DELETE', body: formData })
            .then((res) => res.json())
            .then((data) => {
                alert(data['msg']);
                window.location.reload();
            });
    }
}

//업데이트 함수 비밀번호를 입력받고 일치할 때만 수정 폼 디스플레이하게 변경 
function edit_post_by_id(id) {
    if (confirm('수정하시겠습니까?')) {
        const password = prompt('비밀번호를 입력하세요:');
        if (password === null) {
            return; // 입력을 취소한 경우 함수 종료
        }

        // 비밀번호 확인 요청을 서버에 보내기
        fetch('/check_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                password: password
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.msg === '일치') {
                    // 비밀번호가 일치하는 경우 수정 폼 표시
                    display_edit_form(id, password);
                } else {
                    alert('비밀번호가 일치하지 않습니다.');
                }
            });
    }
}

//수정 기능 부분
function display_edit_form(id, password) {
    fetch('/userinfo')
        .then((res) => res.json())
        .then((data) => {
            let userData = data.users;
            let dropdown1 = document.getElementById('dropdown1').value;
            let dropdown2 = document.getElementById('dropdown2').value;
            let messageTextArea = document.getElementById('messageTextArea').textContent;
             
            const modalContainer = document.createElement('div');
            modalContainer.className = 'modal-container1';
            modalContainer.innerHTML = `
            <div id="modal2-div1">
                <div>
                    <label for="editDropdown1">누구에게 보낼까요?</label>
                    <select id="editDropdown1">
                        <option value="" disabled selected hidden>${dropdown1}</option>
                        <option value="김환훈">김환훈</option>
                        <option value="이진솔">이진솔</option>
                        <option value="원유길">원유길</option>
                        <option value="이수진">이수진</option>
                    </select>
                </div>
                <div>
                    <label for="editDropdown2">나는 누구?</label>
                    <select id="editDropdown2">
                        <option value="" disabled selected hidden>${dropdown2}</option>
                        <option value="김환훈">김환훈</option>
                        <option value="이진솔">이진솔</option>
                        <option value="원유길">원유길</option>
                        <option value="이수진">이수진</option>
                    </select>
                </div>
            </div>
            <div id="modal2-div2">
                <h2>Content</h2>
                <textarea id="editMessageTextArea" rows="5" cols="50" placeholder="example sentences, Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex similique nihil laudantium, quod ea cupiditate">
                ${messageTextArea}</textarea>
            </div>
            <div id="modal2-div3">
                <input id="modal2Send" type="button" value="보내기">
                <input id="modal2Close" type="button" value="닫기">
            </div>
        `;

            modalContainer.querySelector('#modal2Close').onclick = function () {
                document.body.removeChild(modalContainer);
            };

            modalContainer.querySelector('#modal2Send').onclick = function () {
                const editDropdown1 = document.getElementById('editDropdown1').value;
                const editDropdown2 = document.getElementById('editDropdown2').value;
                const editMessageTextArea = document.getElementById('editMessageTextArea').value;

                let formData = new FormData();
                formData.append('id_give', id);
                formData.append('password', password);
                formData.append('edit_dropdown1_give', editDropdown1);
                formData.append('edit_dropdown2_give', editDropdown2);
                formData.append('edit_messageTextArea_give', editMessageTextArea);

                fetch('/userinfo', { method: 'UPDATE', body: formData })
                    .then((res) => res.json())
                    .then((data) => {
                        alert(data['msg']);
                        window.location.reload();
                    });
                document.body.removeChild(modalContainer);
            };

            document.body.appendChild(modalContainer);
        });
}