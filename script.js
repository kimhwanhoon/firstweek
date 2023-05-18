//요소 등록
const nav = document.querySelector("nav"); //nav 요소 등록
const modal = document.querySelector("modal1"); // 모달1 요소 등록
const backdrop = document.querySelector(".backdrop"); // 백드롭 요소 선택
const write = document.getElementById("write"); //작성하기 버튼 등록
const modal2 = document.querySelector("modal2"); //모달2 요소 등록
const modal2Send = document.getElementById("modal2Send"); //모달2 보내기 요소 등록
const modal2Close = document.getElementById("modal2Close"); //모달2 닫기 요소 등록
const moreBtn = document.querySelectorAll(".moreBtn"); //people에 more버튼들 요소 등록
const footer = document.querySelector("footer"); //footer 요소 등록
//
// smooth scroll
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.scrollIntoView({ behavior: "smooth" });
}
// nav창 및 로고 드래그 불가능하게 하기
nav.addEventListener("mousedown", function (event) {
  event.preventDefault();
});
footer.addEventListener("mousedown", function (event) {
  event.preventDefault();
});

//스크롤 위치 감지하여 내비탭 효과
window.addEventListener("scroll", function () {
  const posY = this.window.pageYOffset;
  const team = this.document
    .querySelector("#sect1")
    .getBoundingClientRect().top;
  const people = this.document
    .querySelector("#sect2")
    .getBoundingClientRect().top;
  const message = this.document
    .querySelector("#sect3")
    .getBoundingClientRect().top;

  const teamTop = posY + team;
  const peopleTop = posY + people;
  const messageTop = posY + message;

  let NavTeam = document.querySelector(".n-team");
  let NavPeople = document.querySelector(".n-people");
  let NavMessage = document.querySelector(".n-message");

  let totalHeight = document.body.scrollHeight - this.window.innerHeight - 1;

  if (posY > teamTop && posY < peopleTop) {
    NavTeam.classList.add("focus");
    NavPeople.classList.remove("focus");
  } else if (posY >= peopleTop && posY < messageTop) {
    NavTeam.classList.remove("focus");
    NavPeople.classList.add("focus");
    NavMessage.classList.remove("focus");
  } else if (posY >= messageTop && posY <= totalHeight) {
    NavPeople.classList.remove("focus");
    NavMessage.classList.add("focus");
  } else {
  }
});

// 로딩 화면 표시 함수
function showLoading() {
  document.getElementById("loading").style.display = "flex";
}
// 로딩 화면 숨김 함수
// 로딩화면 일부러 1초 보이기
function hideLoading() {
  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
  }, 1000);
  modal.classList.toggle("hide");
  modal2.classList.toggle("hide");
}
// 페이지 로딩이 완료되면 로딩 화면 숨김
window.addEventListener("load", hideLoading);

//people에서 more 클릭 하면 모달1 버튼나오게 하기 함수
moreBtn.forEach((btns) => {
  btns.addEventListener("click", modal1open);
});

//모달1 열기 함수
function modal1open() {
  modal.classList.toggle("hide"); //모달1 창 보이게하기
  backdrop.classList.toggle("hide"); //어두운 배경화면 보이게 하기
  modal.style.position = "relative"; //모달1 창을 backdrop위에 위치시키기
  modal.classList.add("lightbox-fade-in"); //fade in 효과 주기
}
// 모달1 닫기 버튼 클릭 이벤트 등에 closeModal 함수를 연결하여 모달 창을 닫을 수 있도록 설정
const peopleModalClose = document.getElementById("people-modal-close");
peopleModalClose.addEventListener("click", () => {
  modal.classList.toggle("hide"); //모달1 숨김
  backdrop.classList.toggle("hide"); // 백드롭 숨김
});

//people에서 카드에 마우스 호버할 때, 커지게하고 마우스가 빠져나가면 원래대로 돌아가는 효과
const peopleCards = document.querySelectorAll(".card");
peopleCards.forEach((card) => {
  card.addEventListener("mouseover", () => {
    card.style.transform = "scale(1.05)";
    card.style.transition = "ease-out 0.4s";
  });
  card.addEventListener("mouseout", () => {
    card.style.transform = "scale(1)";
    card.style.transition = "ease-out 0.25s";
  });
});
// 모달 닫기 버튼 클릭 이벤트 등에 closeModal2 함수를 연결하여 모달 창을 닫을 수 있도록 설정
modal2Close.addEventListener("click", () => {
  modal2.classList.toggle("hide");
  backdrop.classList.toggle("hide"); // 백드롭 숨김
});

//작성하기 이벤트 함수
write.addEventListener("click", () => {
  modal2.classList.toggle("hide"); //모달2 창 보이게하기
  backdrop.classList.toggle("hide"); //어두운 배경화면 보이게 하기
  modal2.style.position = "relative"; //모달2 창을 backdrop위에 위치시키기
  modal2.classList.add("lightbox-fade-in"); //fade in 효과 주기
});
