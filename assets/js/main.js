window.onload = () => {
  if (/iP(hone|ad)/.test(window.navigator.userAgent)) {
    document.body.addEventListener("touchstart", () => {}, false);
  }
  initSelectOption();
  setCardList(travelFoodData);
};
// 檢查圖片是否全載完, 載完就將 loading 關掉
const checkImageLoaded = () => {
  const cardImageList = document.querySelectorAll(".card-image");
  const imageLoadState = [];
  cardImageList.forEach((element) => {
    imageLoadState.push(element.complete);
  });
  const isAllImageLoaded = imageLoadState.every((state) => !!state);
  // 沒載完 delay 0.1 秒再檢查
  if (!isAllImageLoaded) {
    setTimeout(() => {
      checkImageLoaded();
    }, 100);
  } else {
    const loadingEl = document.getElementById("loading");
    loadingEl.classList.add("hidden");
  }
};

// 初始化縣市 select 選項
const initSelectOption = () => {
  // 將資料用 reduce 做分類, 避免重複
  const cityTown = travelFoodData.reduce((acc, item) => {
    if (!acc.find((city) => city.name === item.City)) {
      return [...acc, { name: item.City, town: [item.Town] }];
    } else {
      return acc.map((city) => ({
        ...city,
        town:
          city.name === item.City && !city.town.includes(item.Town)
            ? [...city.town, item.Town]
            : city.town,
      }));
    }
  }, []);
  const citySelect = document.getElementById("city");
  cityTown.forEach((item) => {
    citySelect.options[citySelect.options.length] = new Option(
      item.name,
      item.name
    );
    cityTownList.push(item);
  });
};

// 縣市下拉篩選, 並更新鄉鎮區列表及移除 disabled
const changeCity = () => {
  const townSelect = document.getElementById("town");
  townSelect.setAttribute("disabled", true);
  removeOptions(townSelect);
  const cityValue = document.getElementById("city").value;
  const selectedCity = cityTownList.find((item) => item.name === cityValue);
  if (selectedCity) {
    townSelect.removeAttribute("disabled");
    selectedCity.town.forEach((town) => {
      townSelect.options[townSelect.options.length] = new Option(town, town);
    });
  }
  const data = travelFoodData.filter((item) =>
    cityValue ? item.City === cityValue : true
  );
  setCardList(data);
};

// 鄉鎮區下拉篩選
const changeTown = () => {
  const cityValue = document.getElementById("city").value;
  const townValue = document.getElementById("town").value;

  const data = travelFoodData.filter(
    (item) =>
      item.City === cityValue && (townValue ? item.Town === townValue : true)
  );
  setCardList(data);
};

// 重置 selecton option
const removeOptions = (selectEl) => {
  const length = selectEl.options.length - 1;
  for (let i = length; i > 0; i--) {
    selectEl.remove(i);
  }
};

// 設定篩選資料
const setCardList = (data) => {
  filterData = data;
  appendCardList(true, 0);
};

// 加載更多或者更新篩選資料
const appendCardList = (isAdd, count) => {
  // 圖片載入前, 先顯示 loading 遮罩
  const loadingEl = document.getElementById("loading");
  loadingEl.classList.remove("hidden");

  const contentEl = document.getElementById("cards");
  // 如果是下拉篩選則是先清除 content innerHtml
  if (isAdd) {
    contentEl.innerHTML = ``;
  }

  // 將資料每 9 筆做 append
  filterData.slice(count, 9 + count).forEach((item) => {
    const element = document.createElement("div");
    element.setAttribute("class", "card-item");
    element.innerHTML = `
      <span class="card-city">${item.City}</span>
      <img src="${item.PicURL}" class="card-image" />
      <div class="card-store">
        <p class="card-town">${item.Town}</p>
        <p>${item.Name}</p>
        <div class="card-intro-border"></div>
        <div class="card-intro">${item.HostWords}</div>
    </div>`;
    contentEl.appendChild(element);
  });
  // 檢查圖片載完沒
  checkImageLoaded();
};

// 加載更多商店
const loadMoreStore = () => {
  const contentEl = document.getElementById("cards");
  const contentChildCount = contentEl.childElementCount;
  // 檢查 content 底下子元素總數是否跟資料長度一樣, 不一樣才加載
  if (contentChildCount !== filterData.length) {
    appendCardList(false, contentChildCount);
  } else {
    window.alert("已是全部資料");
  }
};
