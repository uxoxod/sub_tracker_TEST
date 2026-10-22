// 구독 관리 페이지의 진입점: 데이터 저장/불러오기, 폼 처리, 화면 갱신을 담당한다.
// 계산 함수는 logic.js, 화면 그리기 함수는 ui.js(SubscriptionUI)에서 가져와 사용한다.
// 즉시 실행 함수(IIFE)로 감싸 내부 변수가 전역을 오염시키지 않도록 한다.
(function () {
  // localStorage에 구독 목록을 저장할 때 사용하는 키
  const STORAGE_KEY = "subscription-manager-data";
  // "결제 예정"으로 볼 기간(오늘부터 며칠 이내)
  const UPCOMING_DAYS = 7;

  // index.html의 주요 요소들을 미리 찾아 둔다.
  const form = document.getElementById("subscription-form");             // 구독 추가/수정 폼
  const list = document.getElementById("subscription-list");             // 구독 카드 목록 영역
  const categoryBreakdown = document.getElementById("category-breakdown"); // 카테고리별 비중 영역
  const monthlyTotal = document.getElementById("monthly-total");         // 월 구독료 합계
  const yearlyTotal = document.getElementById("yearly-total");           // 연간 구독료 합계
  const upcomingTotal = document.getElementById("upcoming-total");       // 7일 이내 결제 예정 금액
  const upcomingCaption = document.getElementById("upcoming-caption");   // 결제 예정 건수 안내 문구
  const subscriptionCount = document.getElementById("subscription-count"); // 구독 개수 표시
  const formHeading = document.getElementById("form-heading");           // 폼 제목("새 구독 추가"/"구독 수정")
  const submitButton = document.getElementById("submit-button");         // 제출 버튼
  const cancelEditButton = document.getElementById("cancel-edit");       // 수정 취소 버튼
  const formError = document.getElementById("form-error");               // 폼 오류 메시지
  const idInput = document.getElementById("subscription-id");            // 수정 중인 구독의 id(숨김 필드)
  // 페이지가 열릴 때 저장된 구독 목록을 불러온다.
  let subscriptions = loadSubscriptions();

  // localStorage에서 구독 목록을 읽어 배열로 돌려준다. 문제가 있으면 빈 배열을 돌려준다.
  function loadSubscriptions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // 저장된 데이터가 없으면(처음 방문) 빈 목록으로 시작
      if (stored === null) return [];
      const parsed = JSON.parse(stored);
      // 배열이 아니면 손상된 데이터로 보고 오류 처리
      if (!Array.isArray(parsed)) throw new Error("저장된 구독 데이터 형식이 올바르지 않습니다.");
      return parsed;
    } catch (error) {
      // JSON 파싱 실패 등: 콘솔에 기록하고 빈 목록으로 시작
      console.error("구독 데이터를 불러오지 못했습니다.", error);
      return [];
    }
  }

  // 현재 구독 목록을 localStorage에 저장한다. 성공하면 true, 실패하면 false를 돌려준다.
  function saveSubscriptions() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
      return true;
    } catch (error) {
      // 저장 공간 초과, 시크릿 모드 제한 등으로 저장이 실패한 경우
      console.error("구독 데이터를 저장하지 못했습니다.", error);
      showFormError("데이터를 저장하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.");
      return false;
    }
  }

  // 폼 아래에 오류 메시지를 보여준다.
  function showFormError(message) {
    formError.textContent = message;
    formError.hidden = false;
  }

  // 폼 오류 메시지를 지우고 숨긴다.
  function clearFormError() {
    formError.textContent = "";
    formError.hidden = true;
  }

  // 현재 구독 목록을 기준으로 요약 카드, 구독 목록, 카테고리 비중을 모두 다시 그린다.
  function render() {
    // 월/연 합계 계산 (logic.js)
    const monthlyAmount = calculateTotalMonthlyAmount(subscriptions);
    const yearlyAmount = calculateTotalYearlyAmount(subscriptions);
    // 오늘 날짜를 "YYYY-MM-DD" 형식으로 구한다 (ui.js)
    const today = SubscriptionUI.getTodayString();
    // 7일 이내에 결제가 예정된 구독만 골라 금액을 합산한다.
    const upcoming = filterUpcomingPayments(subscriptions, today, UPCOMING_DAYS);
    const upcomingAmount = upcoming.reduce((sum, subscription) => sum + subscription.amount, 0);

    // 요약 카드에 금액과 건수를 표시한다.
    monthlyTotal.textContent = SubscriptionUI.formatWon(monthlyAmount);
    yearlyTotal.textContent = SubscriptionUI.formatWon(yearlyAmount);
    upcomingTotal.textContent = SubscriptionUI.formatWon(upcomingAmount);
    upcomingCaption.textContent = `7일 이내 결제 ${upcoming.length}건`;
    subscriptionCount.textContent = subscriptions.length;
    // 구독 카드 목록을 그리고, 각 카드의 수정/삭제 버튼에 연결할 함수를 넘긴다.
    SubscriptionUI.renderSubscriptions(subscriptions, list, startEditing, deleteSubscription);
    // 카테고리별 월 금액을 묶어 막대 그래프로 그린다.
    SubscriptionUI.renderCategoryBreakdown(groupByCategory(subscriptions), categoryBreakdown);
  }

  // 폼을 비우고 "새 구독 추가" 상태로 되돌린다.
  function resetForm() {
    form.reset();
    idInput.value = "";
    formHeading.textContent = "새 구독 추가";
    submitButton.textContent = "구독 추가";
    cancelEditButton.hidden = true;
    clearFormError();
  }

  // 카드의 "수정" 버튼을 눌렀을 때: 선택한 구독 정보를 폼에 채우고 수정 모드로 바꾼다.
  function startEditing(subscription) {
    // 숨김 필드에 id를 넣어 두면 제출 시 "수정"으로 처리된다.
    idInput.value = subscription.id;
    document.getElementById("name").value = subscription.name;
    document.getElementById("amount").value = subscription.amount;
    document.getElementById("cycle").value = subscription.cycle;
    document.getElementById("next-payment-date").value = subscription.nextPaymentDate;
    document.getElementById("category").value = subscription.category;
    document.getElementById("card").value = subscription.card || "";
    // 폼 제목과 버튼 문구를 수정 모드에 맞게 바꾸고 취소 버튼을 보여준다.
    formHeading.textContent = "구독 수정";
    submitButton.textContent = "수정 완료";
    cancelEditButton.hidden = false;
    clearFormError();
    // 바로 입력할 수 있도록 이름 칸에 포커스
    document.getElementById("name").focus();
  }

  // 카드의 "삭제" 버튼을 눌렀을 때: 확인 후 해당 구독을 목록에서 지운다.
  function deleteSubscription(id) {
    const subscription = subscriptions.find(item => item.id === id);
    // 구독을 찾지 못했거나 사용자가 취소하면 아무것도 하지 않는다.
    if (!subscription || !window.confirm(`${subscription.name} 구독을 삭제할까요?`)) return;

    // 저장 실패 시 되돌릴 수 있도록 이전 목록을 보관한다.
    const previousSubscriptions = subscriptions;
    subscriptions = subscriptions.filter(item => item.id !== id);
    if (!saveSubscriptions()) {
      subscriptions = previousSubscriptions;
      return;
    }
    // 수정 중이던 구독을 삭제했다면 폼도 초기화한다.
    if (idInput.value === id) resetForm();
    render();
  }

  // 폼 제출: 입력값을 검사한 뒤 새 구독을 추가하거나 기존 구독을 수정한다.
  form.addEventListener("submit", event => {
    // 페이지가 새로고침되는 기본 제출 동작을 막는다.
    event.preventDefault();
    clearFormError();

    // 폼 입력값을 읽어 정리한다.
    const formData = new FormData(form);
    const amount = Number(formData.get("amount"));
    const name = String(formData.get("name")).trim();
    const category = String(formData.get("category")).trim();
    const nextPaymentDate = String(formData.get("nextPaymentDate"));
    // 필수값이 비었거나 금액이 양의 정수가 아니면 오류를 보여주고 중단한다.
    if (!name || !category || !Number.isSafeInteger(amount) || amount <= 0 || !nextPaymentDate) {
      showFormError("이름, 양의 정수 금액, 결제일, 카테고리를 확인해 주세요.");
      return;
    }

    // 저장할 구독 객체. 수정 중이면 기존 id를, 새 구독이면 고유한 id를 새로 만든다.
    const subscription = {
      id: idInput.value || `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      amount,
      cycle: String(formData.get("cycle")),
      nextPaymentDate,
      category,
      card: String(formData.get("card")).trim()
    };
    // 저장 실패 시 되돌릴 수 있도록 이전 목록을 보관한다.
    const previousSubscriptions = subscriptions;
    if (idInput.value) {
      // 수정 모드: 같은 id를 가진 항목을 새 내용으로 바꾼다.
      subscriptions = subscriptions.map(item => item.id === idInput.value ? subscription : item);
    } else {
      // 추가 모드: 목록 끝에 새 구독을 붙인다.
      subscriptions = [...subscriptions, subscription];
    }

    if (!saveSubscriptions()) {
      subscriptions = previousSubscriptions;
      return;
    }
    // 저장에 성공하면 폼을 비우고 화면을 다시 그린다.
    resetForm();
    render();
  });

  // "취소" 버튼을 누르면 수정 모드를 끝내고 폼을 초기화한다.
  cancelEditButton.addEventListener("click", resetForm);
  // 페이지가 처음 열릴 때 저장된 데이터로 화면을 그린다.
  render();
})();
