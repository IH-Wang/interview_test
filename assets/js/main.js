window.onload = () => {
  if (/iP(hone|ad)/.test(window.navigator.userAgent)) {
    document.body.addEventListener("touchstart", () => {}, false);
  }
  initSelectOption();
  setCardList(travelFoodData);
  checkImageLoaded();
};
// 檢查圖片是否全載完, 載完就將 loading 關掉
const checkImageLoaded = () => {
  const cardImageList = document.querySelectorAll(".card-image");
  const imageLoadState = [];
  cardImageList.forEach((element) => {
    imageLoadState.push(element.complete);
  });
  const isAllImageLoaded = imageLoadState.every((state) => !!state);
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
  cityTown.forEach((item) => {
    cityTownList.push(item);
  });
  const citySelect = document.getElementById("city");
  cityTownList.forEach((city) => {
    citySelect.options[citySelect.options.length] = new Option(
      city.name,
      city.name
    );
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
  const contentEl = document.getElementById("cards");
  if (isAdd) {
    contentEl.innerHTML = ``;
  }
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
};

// 加載更多商店
const loadMoreStore = () => {
  const contentEl = document.getElementById("cards");
  const contentChildCount = contentEl.childElementCount;
  if (contentChildCount !== filterData.length) {
    appendCardList(false, contentChildCount);
    const loadingEl = document.getElementById("loading");
    loadingEl.classList.remove("hidden");
    checkImageLoaded();
  } else {
    window.alert("已是全部資料");
  }
};
