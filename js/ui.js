// 화면(DOM)을 그리는 함수 모음. main.js에서 window.SubscriptionUI로 접근해 사용한다.
// 즉시 실행 함수(IIFE)로 감싸 내부 함수가 전역에 노출되지 않도록 한다.
(function () {
  // 카테고리 막대 그래프에 순서대로 돌려 쓰는 색상 목록
  const categoryColors = ["#6759e8", "#f29d55", "#4bbd9b", "#e66e89", "#5598df", "#b276d2"];

  // HTML 요소를 만들고 클래스와 텍스트를 한 번에 지정하는 도우미 함수
  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    // textContent를 사용해 사용자가 입력한 값이 HTML로 해석되지 않도록 한다.
    if (text !== undefined) element.textContent = text;
    return element;
  }

  // 숫자를 "13,500원"처럼 한국식 천 단위 구분 기호와 "원"을 붙인 문자열로 바꾼다.
  function formatWon(amount) {
    return `${Math.round(amount).toLocaleString("ko-KR")}원`;
  }

  // 오늘 날짜를 "YYYY-MM-DD" 형식 문자열로 돌려준다. (input[type=date] 값과 같은 형식)
  function getTodayString() {
    const today = new Date();
    const year = today.getFullYear();
    // 월은 0부터 시작하므로 1을 더하고, 한 자리면 앞에 0을 붙인다.
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // 구독 하나를 카드 형태의 요소로 만든다.
  // daysUntilPayment: 결제일까지 남은 일수, onEdit/onDelete: 버튼 클릭 시 호출할 함수
  function createSubscriptionCard(subscription, daysUntilPayment, onEdit, onDelete) {
    const card = createElement("article", "subscription-card");

    // 윗부분: 카테고리 첫 글자 아이콘 + 구독 이름/카테고리/카드 정보
    const main = createElement("div", "subscription-main");
    const icon = createElement("span", "category-icon", subscription.category.slice(0, 1) || "구");
    // 장식용 아이콘이므로 스크린 리더가 읽지 않도록 한다.
    icon.setAttribute("aria-hidden", "true");

    const description = createElement("div");
    description.append(
      createElement("p", "subscription-name", subscription.name),
      // 카드 정보가 있으면 "카테고리 · 카드" 형식, 없으면 카테고리만 표시
      createElement("p", "subscription-meta", `${subscription.category}${subscription.card ? ` · ${subscription.card}` : ""}`)
    );
    main.append(icon, description);

    // 가운데: 금액과 결제 주기
    const price = createElement("div", "subscription-price");
    price.append(
      createElement("strong", "", formatWon(subscription.amount)),
      createElement("span", "", subscription.cycle === "yearly" ? "매년 결제" : "매월 결제")
    );

    // 아랫부분: 남은 일수 배지 + 수정/삭제 버튼
    const bottom = createElement("div", "subscription-bottom");
    // 남은 일수에 따라 "결제일 N일 지남" / "오늘 결제" / "D-N" 중 하나로 표시
    const dayLabel = daysUntilPayment < 0
      ? `결제일 ${Math.abs(daysUntilPayment)}일 지남`
      : daysUntilPayment === 0
        ? "오늘 결제"
        : `D-${daysUntilPayment}`;
    // 0~3일 남았으면 due-soon 클래스를 붙여 강조한다.
    const badge = createElement("span", `days-badge${daysUntilPayment >= 0 && daysUntilPayment <= 3 ? " due-soon" : ""}`, dayLabel);
    const actions = createElement("div", "card-actions");

    // 수정 버튼: 클릭하면 이 구독 객체를 onEdit에 넘긴다.
    const editButton = createElement("button", "text-button", "수정");
    editButton.type = "button";
    editButton.setAttribute("aria-label", `${subscription.name} 수정`);
    editButton.addEventListener("click", () => onEdit(subscription));

    // 삭제 버튼: 클릭하면 이 구독의 id를 onDelete에 넘긴다.
    const deleteButton = createElement("button", "text-button delete-button", "삭제");
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `${subscription.name} 삭제`);
    deleteButton.addEventListener("click", () => onDelete(subscription.id));

    // 만든 요소들을 조립해 카드를 완성한다.
    actions.append(editButton, deleteButton);
    bottom.append(badge, actions);
    card.append(main, price, bottom);
    return card;
  }

  // 구독 목록 전체를 container 안에 카드로 그린다.
  function renderSubscriptions(subscriptions, container, onEdit, onDelete) {
    // 기존에 그려진 카드를 모두 지운다.
    container.replaceChildren();
    const today = getTodayString();

    // 구독이 하나도 없으면 안내 문구를 보여주고 끝낸다.
    if (subscriptions.length === 0) {
      const empty = createElement("div", "empty-state");
      empty.append(
        document.createTextNode("아직 등록된 구독이 없어요."),
        document.createElement("br"),
        document.createTextNode("오른쪽에서 첫 구독을 추가해 보세요.")
      );
      container.append(empty);
      return;
    }

    subscriptions
      // 원본 배열을 바꾸지 않도록 복사한 뒤 정렬한다.
      .slice()
      // 다음 결제일이 빠른 순서로 정렬 ("YYYY-MM-DD" 문자열은 사전순 = 날짜순)
      .sort((first, second) => first.nextPaymentDate.localeCompare(second.nextPaymentDate))
      .forEach(subscription => {
        // 남은 일수를 계산해(logic.js) 카드에 함께 넘긴다.
        const days = getDaysUntilNextPayment(today, subscription.nextPaymentDate);
        container.append(createSubscriptionCard(subscription, days, onEdit, onDelete));
      });
  }

  // 카테고리별 금액({ 카테고리: 금액 })을 비율 막대 그래프로 그린다.
  function renderCategoryBreakdown(categoryTotals, container) {
    // 기존 그래프를 지운다.
    container.replaceChildren();
    // [카테고리, 금액] 배열로 바꾸고 금액이 큰 순서로 정렬한다.
    const entries = Object.entries(categoryTotals).sort((first, second) => second[1] - first[1]);
    // 전체 합계 (비율 계산용)
    const total = entries.reduce((sum, entry) => sum + entry[1], 0);

    // 표시할 데이터가 없으면 안내 문구만 보여준다. (0으로 나누는 것도 방지)
    if (entries.length === 0 || total === 0) {
      container.append(createElement("p", "category-empty", "표시할 구독 내역이 없습니다."));
      return;
    }

    entries.forEach(([category, amount], index) => {
      // 전체 대비 비율(%)
      const percentage = Math.round((amount / total) * 100);
      const row = createElement("div", "category-row");
      const label = createElement("span", "category-label", category);
      // 막대의 바탕(트랙). 스크린 리더에는 "카테고리 N%"로 읽히게 한다.
      const track = createElement("div", "category-track");
      track.setAttribute("role", "img");
      track.setAttribute("aria-label", `${category} ${percentage}%`);
      // 실제로 채워지는 막대: 비율만큼 너비를 주고 색상을 순서대로 지정한다.
      const fill = createElement("div", "category-fill");
      fill.style.width = `${percentage}%`;
      fill.style.backgroundColor = categoryColors[index % categoryColors.length];
      track.append(fill);
      // 한 줄 = 카테고리 이름 + 막대 + "금액 · 비율"
      row.append(label, track, createElement("span", "category-value", `${formatWon(amount)} · ${percentage}%`));
      container.append(row);
    });
  }

  // main.js에서 사용할 함수만 전역 객체 SubscriptionUI로 공개한다.
  window.SubscriptionUI = {
    formatWon,
    getTodayString,
    renderSubscriptions,
    renderCategoryBreakdown
  };
})();
