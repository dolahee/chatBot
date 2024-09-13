// 날씨 데이터를 가져오는 함수
function getWeather(callback, temperatureOnly = false) {
    const apiKey = '1e5c0425d7d6ddc50ad6768bbca7709a';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${apiKey}&units=metric`;

    const weatherTranslations = {
        "clear sky": "맑으며",
        "few clouds": "구름 조금 껴있고",
        "scattered clouds": "구름이 조금 껴있고",
        "broken clouds": "조각 구름이 껴있고",
        "shower rain": "소나기가 내리고",
        "rain": "비가 오고",
        "thunderstorm": "천둥번개가 치며",
        "snow": "눈이 오고",
        "mist": "안개가 껴있고",
        "overcast clouds": "흐림",
        "light rain": "이슬비가 오고",
        "moderate rain" : "비가 오고",
        "heavy intensity rain" :"비가 많이 오고"
    };

    const weatherTranslations2 = {
        "clear sky": "🌞",
        "few clouds": "🌤️",
        "scattered clouds": "☁️",
        "broken clouds": "☁️",
        "shower rain": "🌧️",
        "rain": "☔",
        "thunderstorm": "⛈️",
        "snow": "❄️",
        "mist": "🌫️",
        "overcast clouds": "☁️",
        "light rain": "☔",
        "moderate rain" : "☔",
        "heavy intensity rain" :"☔"
    };

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const weatherDescriptionEnglish = data.weather[0].description;
            const weatherDescription = weatherTranslations[weatherDescriptionEnglish] || weatherDescriptionEnglish;
            const weatherEmoji = weatherTranslations2[weatherDescriptionEnglish] || '';
            const temperature = data.main.temp;

            const weatherMessage = `현재 서울의 날씨는 ${weatherDescription}, 온도는 ${temperature}°C 입니다.`;

            const headerWeatherSpan = document.querySelector('.header span');
            headerWeatherSpan.textContent = `${weatherEmoji}`;
            headerWeatherSpan.dataset.weather = weatherDescriptionEnglish;

            if (callback) {
                if (temperatureOnly) {
                    callback(`현재 서울의 온도는 ${temperature}°C 입니다.`);
                } else {
                    callback(weatherMessage);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            if (callback) {
                callback("날씨 정보를 가져오는데 실패했습니다. 다시 시도해주세요.");
            }
        });
}

document.addEventListener('DOMContentLoaded', function() {
    getWeather(); 
});


// 유튜브에서 날씨에 맞는 노래를 추천하는 함수
function recommendMusic(callback, useWeatherBasedQuery = false) {
    const headerWeatherSpan = document.querySelector('.header span');
    const currentWeather = headerWeatherSpan.dataset.weather;

    let searchQuery = '쏘플';

    if (useWeatherBasedQuery && currentWeather) {
        const weatherToMusic = {
            "clear sky": "맑은 날씨에 어울리는 노래",
            "few clouds": "구름 조금 있을 때 듣기 좋은 노래",
            "scattered clouds": "흩어진 구름과 어울리는 노래",
            "broken clouds": "조각 구름과 어울리는 노래",
            "shower rain": "소나기에 어울리는 노래",
            "rain": "비오는 날에 어울리는 노래",
            "thunderstorm": "천둥번개 칠 때 듣기 좋은 노래",
            "snow": "눈 오는 날에 어울리는 노래",
            "mist": "안개 낀 날에 어울리는 노래",
            "overcast clouds": "흐린 날에 어울리는 노래",
            "light rain": "비오는 날에 어울리는 노래",
            "moderate rain" : "비오는 날에 어울리는 노래",
            "heavy intensity rain" :"비오는 날에 어울리는 노래"
        };
        searchQuery = weatherToMusic[currentWeather] || searchQuery;
    }

    const apiKey = 'AIzaSyAAoLK2aGtnwLl46EeJBzCtfIdxnuDSWh0';
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodeURIComponent(searchQuery)}&type=video&videoEmbeddable=true&key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.items.length);
                const videoId = data.items[randomIndex].id.videoId;
                const videoTitle = data.items[randomIndex].snippet.title;
                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                
                const message = `
                    이 노래는 어떠세요?<br> ${videoTitle}<br>
                    <a href="${videoUrl}" target="_blank">☞ 클릭 하면 유튜브 채널로 이동 합니다</a><br>
                    <iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                `;
                
                callback(message);
            } else {
                callback("노래를 찾을 수 없었어요. 다시 시도해 주세요.");
            }
        })
        .catch(error => {
            console.error('Error fetching the YouTube data:', error);
            callback("노래 정보를 가져오는데 실패했습니다. 다시 시도해주세요.");
        });
}

// 음식 관련 응답 함수
function getRandomItemFromList(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

// 메뉴 추천 함수
function recommendFood(callback, cuisine = 'all') {
    const foodLists = {
        japan: [
            "돈까스덮밥", "라멘", "스시", "사시미", "우동", "소바", "텐동", "오코노미야키", "타코야키", "카레라이스",
            "규동", "야키토리", "가라아게", "카츠동", "나베", "미소시루", "츠케멘", "텐푸라", "야키니쿠", "모찌",
            "다이후쿠", "타이야키", "샤부샤부", "스키야키", "오차즈케", "하야시라이스", "멘치카츠", "코로케",
            "오뎅", "우나기동", "야키이모", "카이센동", "카츠카레", "모츠나베", "고로케", "쇼가야키", "니쿠자가",
            "하카타라멘", "미소라멘", "시오라멘", "톤코츠라멘", "탄탄멘", "차슈", "가츠산도", "오니기리", "고항",
            "사케동", "이카소멘", "호타테", "에비후라이", "이카야키", "치쿠와", "아게다시도후", "히야야코", "다시마키",
            "도리키조쿠", "도리카라", "고마아에", "고모쿠고항", "야키자케", "하마야키", "아부리모치", "유도후",
            "타마고야키", "가키후라이", "나가사키짬뽕", "고마소바", "니기리즈시", "호타루이카", "니혼슈", "유부초밥",
            "이카메시", "사바미소니", "테바사키", "에비칠리", "키츠네우동", "탄야키", "나스노아게비타시", "곤약",
            "다이콘오로시", "나스덴가쿠", "히라메", "아지후라이", "야키고항", "햄버거스테이크", "사케야키", "오야코동",
            "텐푸라우동", "치쿠와텐", "아지노히모노", "야키토마토", "야키코로케", "야키오니기리", "토리테리야키",
            "니쿠마키", "카마보코", "이와시", "다마고스시", "히루메시", "카와라소바", "이로리야키", "미나미소바"
          
        ],
        korea: [
            "불고기", "비빔밥", "김치찌개", "된장찌개", "삼겹살", "갈비찜", "갈비탕", "떡볶이", "잡채", "칼국수",
            "냉면", "김밥", "순두부찌개", "제육볶음", "닭갈비", "파전", "감자탕", "콩나물국", "해물탕", "순대국",
            "곰탕", "설렁탕", "육개장", "매운탕", "보쌈", "족발", "양념치킨", "후라이드치킨", "닭볶음탕", "된장국",
            "국밥", "동태찌개", "고등어조림", "두부조림", "무생채", "삼계탕", "황태해장국", "오징어볶음", "낙지볶음",
            "수육", "불닭", "차돌된장찌개", "청국장", "전복죽", "김치전", "육전", "감자전", "동그랑땡", "비지찌개",
            "김치볶음밥", "계란말이", "북엇국", "어묵탕", "우렁된장", "소고기무국", "계란국", "미역국", "장어구이",
            "도토리묵", "쌈밥", "닭한마리", "콩국수", "백숙", "비빔국수", "콩나물밥", "김치찜", "어리굴젓", "홍어회",
            "낙지탕탕이", "게장", "생선구이", "쭈꾸미볶음", "간장게장", "양념게장", "조기구이", "갈치조림", "가자미구이",
            "추어탕", "수제비", "부대찌개", "돼지갈비", "떡국", "만둣국", "소머리국밥", "장조림", "불고기전골",
            "잡곡밥", "산채비빔밥", "꼬막무침", "황태구이", "꼬리곰탕", "알탕", "동치미", "막국수", "콩비지",
            "고추장찌개", "감자조림", "닭발", "돼지국밥", "비빔만두", "수정과", "식혜", "호박죽", "팥죽", "매생이국",
            "어묵볶음", "나물무침"
        ],
        china: [
            "유린기", "깐풍새우", "짜장면", "짬뽕", "탕수육", "양장피", "마파두부", "팔보채", "고추잡채", "라조기",
            "깐쇼새우", "멘보샤", "동파육", "북경오리", "양고기꼬치", "칠리새우", "샤오롱바오", "딤섬", "훠궈", "볶음밥",
            "양꼬치", "마라탕", "마라샹궈", "군만두", "춘권", "고량주", "우육면", "딴딴면", "탕면", "피단두부", "퍄오롄",
            "부추볶음", "동지탕", "깐풍기", "사천탕면", "계란탕", "꽃빵", "꿔바로우", "지삼선", "부추잡채", "홍소육",
            "마라롱샤", "새우완자", "해파리냉채", "오향장육", "칠리크랩", "팔진반점", "퉁유볶음", "광동면", "광동식볶음밥",
            "잡채밥", "유산슬", "새우볶음밥", "마라볶음", "오징어볶음", "해물볶음밥", "간장새우", "호두새우", "전가복",
            "짜사이", "차슈", "게살볶음", "꿍바오지딩", "시금치볶음", "송이두부", "유린두부", "샹차이볶음", "탕수만두",
            "계란볶음밥", "달걀국", "지단", "양고기탕", "파오차이", "홍유조수", "양지탕", "중국식냉면", "베이징국수",
            "감자볶음", "콩나물볶음", "송이볶음", "계란말이", "어향육사", "해삼요리", "마파두부밥", "칠리닭",
            "광동식삼겹살", "북경식짜장면", "마라왕새우", "황제탕", "무쌍조", "샤챠소스볶음", "탄탄면", "지마장면",
            "고추마라닭", "퉁춘닭", "생선찜", "양송이버섯볶음", "연두부", "마라새우", "찐교자", "어향새우", "철판해물"
          
        ],
        all: []
    };
foodLists.all = [...foodLists.japan, ...foodLists.korea, ...foodLists.china];

const selectedCuisine = foodLists[cuisine] || foodLists.all;
const randomFood = getRandomItemFromList(selectedCuisine);
const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(randomFood)}+만드는+법`;

callback(`오늘은 <span class="food"> ${randomFood} </span> 어떠세요?<br><br>
    <a href="${searchUrl}" target="_blank" class="randomFood"> ☞ ${randomFood} 만드는 법 알아보기</a>`);
}
// 메뉴 버튼 이벤트 
document.getElementById('menuBtn').addEventListener('click', function () {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('show');
});

document.querySelectorAll('.menuItem').forEach(button => {
    button.removeEventListener('click', handleMenuClick);
    button.addEventListener('click', handleMenuClick); 
});

// 메뉴 클릭
function handleMenuClick() {
    const menu = document.querySelector('.menu');
    menu.classList.remove('show');
    const menuText = this.getAttribute('data-text');

    displayMessage(menuText, true);

    if (menuText === "현재 날씨에 따른 노래 추천받기") {

        setTimeout(() => {
            recommendMusic(displayMessage, true);
        }, 1000);
    } else if (menuText === "도희봇의 메뉴 추천 받기") {

        setTimeout(() => {
            showCuisineOptions(displayMessage);
        }, 1000);
    } else {

        const userInput = document.getElementById('userInput');
        userInput.value = menuText;
        sendMessage();
    }
}

// 메뉴 선택 버튼을 표시하는 함수 (음식 메뉴 추천)
function showCuisineOptions(callback) {
    const cuisineOptions = `
        <button class="cuisineBtn" data-cuisine="japan">일식</button>
        <button class="cuisineBtn" data-cuisine="korea">한식</button>
        <button class="cuisineBtn" data-cuisine="china">중식</button>
        <button class="cuisineBtn" data-cuisine="all">랜덤</button>
    `;

    callback(`어떤 음식을 원하시나요?<br>${cuisineOptions}`);

    setTimeout(() => {
        document.querySelectorAll('.cuisineBtn').forEach(button => {
            const newButton = button.cloneNode(true); 
            button.replaceWith(newButton); 

            newButton.addEventListener('click', function () {
                const selectedCuisine = this.dataset.cuisine;
                displayMessage(this.textContent, true);
                setTimeout(() => {
                    recommendFood(callback, selectedCuisine);
                }, 1000);
            });
        });
    }, 100);
}

// 금지어 필터링을 위한 배열
var swear_words_arr = ["시발", "씨발", "씨빨", "씨바", "씨팔", "씨이발", "씨입발", "씨입팔", "씨이빨",
    "새끼", "샊기", "쌔끼", "쎄끼", "썅", "썌끼", "쌍년", "쌍놈", "좆", "좃", "조까", "좇", "좃까", 
    "좆까", "좇까", "개새끼", "개샊기", "개쉐끼", "개섀끼", "개쉑", "개자식", "개자지", "개잡놈", 
    "미친놈", "미친년", "병신", "븅신", "ㅄ", "ㅂㅅ", "빙신", "멍청이", "등신", "대가리", 
    "느금", "느그엄마", "느금마", "뒤질래", "죽을래", "닥쳐", "닥치라", "닥치고", "꺼져", "꺼지라",
    "엿먹어", "엿이나먹어", "엿먹어라", "지랄", "지럴", "지롤", "지뢀", "지랄맞네", "지랄하네",
    "미친", "미친놈", "미친년", "호로새끼", "호로자식", "호로새끼", "후장", "후장따먹", "후장뚫어",
    "좆같은", "좆나", "존나", "존망", "존못", "존내", "존귀", "존잼", "존맛", "존싫", "존트", "존멋", 
    "씨팍", "씨발놈", "씨방새", "씨펄", "쉑스", "쉐끼", "섀끼", "씹", "씹새끼", "씹년", "씹놈", "씹새", 
    "씹창", "씹탱", "씹할", "씹치", "씹물", "씹보지", "씹자지", "씹할년", "애미", "애비", "애미뒤진",
    "니미", "니앰", "니애미", "니애비", "너거애미", "엄마좆까", "할매보지", "할매자지", "뒈져", 
    "죽어", "뒤져", "디져라", "뒈지라", "디졌네", "뒤진놈", "후장", "항문", "항문쑤셔"];

function generateBotResponse(userMessage) {

    const responses = {
        "안녕": "안녕하세요! 만나서 반가워요.",
        "잘 지내?": "네, 잘 지내고 있어요. 당신은요?",
        "이름이 뭐야?": "저는 채팅 봇이에요. 당신의 이름은 무엇인가요?",
        "무슨 일을 해?": "저는 여러분과 대화를 나누는 일을 하고 있어요.",
        "고마워": "천만에요! 도움이 되어 기뻐요.",
        "도희": "걔 공주잖아",
        "진웅": "완전 잘생긴 왕자잖아.",
        "진하": "그 왕자의 동생... 신이 되고 싶어서 자꾸 하늘에 서려고 하지",
        "민지": "맨날 리썰 하자고 하는 바보임",
        "오늘 몇 도야": function(callback) {
            getWeather(callback, true);
        },
        "오늘 몇도야": function(callback) {
            getWeather(callback, true);
        },
        "날씨": function(callback) {
            getWeather(callback, false); 
        },
        "온도": function(callback) {
            getWeather(callback, true);
        },
        "노래 추천": function(callback) {
            recommendMusic(callback);
        },
        "노래": function(callback) {
            recommendMusic(callback);
        },
        "도희봇의 메뉴 추천 받기": function(callback) { 
            showCuisineOptions(callback);
        },
        "음식": function(callback) { 
            food(callback);
        },
        "메뉴": function(callback) { 
            food(callback);
        },
        "뭐 먹지": function(callback) { 
            food(callback);
        },
        "뭐 먹을까": function(callback) { 
            food(callback);
        },
    };

    const learnedResponses = JSON.parse(localStorage.getItem('learnedResponses')) || {};
    let finalResponse = "뭐라는지 모르겠어요. 저를 학습시키려면 '학습:키워드:응답' 형식으로 입력해 주세요.";

    for (let key in learnedResponses) {
        if (userMessage.includes(key)) {
            finalResponse = learnedResponses[key];
        }
    }

    for (let key in responses) {
        if (userMessage.includes(key)) {
            if (typeof responses[key] === 'function') {
                responses[key](displayMessage);
                return; 
            } else {
                finalResponse = responses[key];
            }
        }
    }

    if (userMessage.startsWith('학습:')) {
        const parts = userMessage.split(':');
        if (parts.length === 3) {
            const keyword = parts[1].trim();
            const response = parts[2].trim();
            learnedResponses[keyword] = response;
            localStorage.setItem('learnedResponses', JSON.stringify(learnedResponses));
            finalResponse = `배웠어요! "${keyword}"에 대해 이렇게 답할게요: "${response}"`;
        } else {
            finalResponse = "학습시키려면 '학습:키워드:응답' 형식으로 입력해 주세요.";
        }
    }

    displayMessage(finalResponse);
}
// 메시지를 화면에 표시하는 함수
function displayMessage(message, isUser = false) {
    const chatLog = document.getElementById('chatLog');
    
    const messageLabel = document.createElement('div');
    messageLabel.className = isUser ? 'messageLabel userLabel' : 'messageLabel botLabel';
    messageLabel.textContent = isUser ? 'me' : '도희🎀';
    
    const messageElement = document.createElement('div');
    messageElement.className = isUser ? 'message userMessage' : 'message botMessage';
    messageElement.innerHTML = message;

    chatLog.appendChild(messageLabel);
    chatLog.appendChild(messageElement);

    scrollToBottom();
}

// 채팅 박스를 자동으로 스크롤하는 함수
function scrollToBottom() {
    const chatBox = document.querySelector('.chatBox');
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 메시지를 보내는 함수
function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatLog = document.getElementById('chatLog');

    if (userInput.value.trim() !== '') {
        // 욕설 필터링
        let userMessageText = userInput.value.trim();

        let containsSwearWord = false;

        for (let i = 0; i < swear_words_arr.length; i++) {
            const swearWord = swear_words_arr[i];
            const swearWordRegex = new RegExp(swearWord, 'gi'); 
            if (swearWordRegex.test(userMessageText)) {
                userMessageText = userMessageText.replace(swearWordRegex, "***");
                containsSwearWord = true; 
            }
        }
        displayMessage(userMessageText, true); 

        userInput.value = '';

        // 욕 관련 대답
        if (containsSwearWord) {
            setTimeout(function() {
                displayMessage("응 꺼져~", false); 
            }, 1000); 
        } else {
            setTimeout(function() {
                generateBotResponse(userMessageText);
            }, 1000); 
        }
    }
}


// 전송 버튼 및 입력란 이벤트 처리
document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
