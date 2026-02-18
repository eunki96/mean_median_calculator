// 데이터베이스 (통계청/사이즈코리아 2022-2023 추정치)
// 실제 서비스 시에는 더 정밀한 DB 로딩 필요
const STAT_DB = {
    income: {
        unit: "만원(세전)",
        isHighBetter: true,
        distribution: "log-normal",
        data: {
            20: { mean: 3200, median: 2800, sd_log: 0.5 },
            30: { mean: 5100, median: 4500, sd_log: 0.6 },
            40: { mean: 6800, median: 5800, sd_log: 0.7 },
            50: { mean: 7500, median: 6000, sd_log: 0.8 },
            60: { mean: 5500, median: 4000, sd_log: 0.9 }
        }
    },
    networth: {
        unit: "만원",
        isHighBetter: true,
        distribution: "log-normal",
        data: {
            20: { mean: 8000, median: 4000, sd_log: 1.0 },
            30: { mean: 25000, median: 15000, sd_log: 1.1 },
            40: { mean: 45000, median: 30000, sd_log: 1.2 },
            50: { mean: 58000, median: 40000, sd_log: 1.2 },
            60: { mean: 55000, median: 35000, sd_log: 1.3 }
        }
    },
    savings: {
        unit: "만원",
        isHighBetter: true,
        distribution: "log-normal",
        data: {
            20: { mean: 80, median: 50, sd_log: 0.8 },
            30: { mean: 150, median: 100, sd_log: 0.8 },
            40: { mean: 200, median: 120, sd_log: 0.9 },
            50: { mean: 250, median: 100, sd_log: 1.0 },
            60: { mean: 100, median: 50, sd_log: 1.2 }
        }
    },
    height: {
        unit: "cm",
        isHighBetter: true,
        distribution: "normal",
        hasGender: true,
        data: {
            male: {
                20: { mean: 174.4, sd: 5.8 },
                30: { mean: 174.9, sd: 5.9 },
                40: { mean: 173.2, sd: 5.6 },
                50: { mean: 170.8, sd: 5.5 },
                60: { mean: 168.3, sd: 5.4 }
            },
            female: {
                20: { mean: 161.8, sd: 5.2 },
                30: { mean: 161.9, sd: 5.3 },
                40: { mean: 160.2, sd: 5.1 },
                50: { mean: 157.9, sd: 5.0 },
                60: { mean: 155.4, sd: 4.9 }
            }
        }
    },
    smartphone: {
        unit: "시간",
        isHighBetter: false,
        distribution: "normal",
        data: {
            20: { mean: 5.5, sd: 2.0 },
            30: { mean: 4.5, sd: 1.8 },
            40: { mean: 3.5, sd: 1.5 },
            50: { mean: 3.0, sd: 1.5 },
            60: { mean: 2.5, sd: 1.2 }
        }
    },
    reading: {
        unit: "권/년",
        isHighBetter: true,
        distribution: "log-normal",
        data: {
            20: { mean: 5, median: 1, sd_log: 1.5 },
            30: { mean: 6, median: 2, sd_log: 1.5 },
            40: { mean: 7, median: 2, sd_log: 1.4 },
            50: { mean: 6, median: 1, sd_log: 1.3 },
            60: { mean: 4, median: 0, sd_log: 1.2 }
        }
    },
    health: {
        unit: "BMI",
        isHighBetter: false,
        isCustomLogic: true,
        unitDisplay: "점",
        data: {
            male: {
                20: { mean: 24.0, sd: 3.5 },
                30: { mean: 25.2, sd: 3.8 },
                40: { mean: 25.5, sd: 3.6 },
                50: { mean: 25.1, sd: 3.4 },
                60: { mean: 24.8, sd: 3.3 }
            },
            female: {
                20: { mean: 21.5, sd: 3.0 },
                30: { mean: 22.2, sd: 3.2 },
                40: { mean: 23.0, sd: 3.4 },
                50: { mean: 24.0, sd: 3.5 },
                60: { mean: 24.5, sd: 3.6 }
            }
        },
        hasGender: true,
        extraInput: true
    },
    alcohol: {
        unit: "병",
        isHighBetter: true,
        distribution: "log-normal",
        data: {
            male: {
                20: { mean: 2.0, median: 1.5, sd_log: 0.6 },
                30: { mean: 2.5, median: 2.0, sd_log: 0.5 },
                40: { mean: 2.0, median: 1.5, sd_log: 0.6 },
                50: { mean: 1.5, median: 1.0, sd_log: 0.7 },
                60: { mean: 1.0, median: 0.8, sd_log: 0.8 }
            },
            female: {
                20: { mean: 1.5, median: 1.0, sd_log: 0.6 },
                30: { mean: 1.5, median: 1.0, sd_log: 0.6 },
                40: { mean: 1.0, median: 0.8, sd_log: 0.7 },
                50: { mean: 0.8, median: 0.5, sd_log: 0.8 },
                60: { mean: 0.5, median: 0.3, sd_log: 0.9 }
            }
        },
        hasGender: true
    },
    sns: {
        unit: "명",
        isHighBetter: true,
        distribution: "log-normal",
        data: {
            20: { mean: 300, median: 180, sd_log: 1.2 },
            30: { mean: 250, median: 150, sd_log: 1.3 },
            40: { mean: 150, median: 80, sd_log: 1.4 },
            50: { mean: 100, median: 50, sd_log: 1.5 },
            60: { mean: 50, median: 20, sd_log: 1.5 }
        }
    },
    big3: {
        unit: "kg",
        isHighBetter: true,
        distribution: "normal",
        hasGender: true,
        isSpecialInput: true,
        data: {
            male: {
                20: { mean: 260, sd: 70 },
                30: { mean: 250, sd: 75 },
                40: { mean: 230, sd: 70 },
                50: { mean: 200, sd: 60 },
                60: { mean: 160, sd: 50 }
            },
            female: {
                20: { mean: 130, sd: 40 },
                30: { mean: 125, sd: 35 },
                40: { mean: 110, sd: 30 },
                50: { mean: 90, sd: 25 },
                60: { mean: 70, sd: 20 }
            }
        }
    },
    running: {
        unit: "분/km",
        isHighBetter: false,
        distribution: "log-normal", // 페이스는 로그노말에 가까움
        hasGender: true,
        isSpecialInput: true,
        data: {
            male: {
                20: { mean: 6.5, median: 6.0, sd_log: 0.25 },
                30: { mean: 6.8, median: 6.3, sd_log: 0.25 },
                40: { mean: 7.0, median: 6.5, sd_log: 0.3 },
                50: { mean: 7.5, median: 7.0, sd_log: 0.3 },
                60: { mean: 8.0, median: 7.5, sd_log: 0.35 }
            },
            female: {
                20: { mean: 7.5, median: 7.0, sd_log: 0.25 },
                30: { mean: 7.8, median: 7.3, sd_log: 0.25 },
                40: { mean: 8.0, median: 7.5, sd_log: 0.3 },
                50: { mean: 8.5, median: 8.0, sd_log: 0.3 },
                60: { mean: 9.0, median: 8.5, sd_log: 0.35 }
            }
        }
    }
};

let currentType = null;
const KAKAO_API_KEY = "e55ba6c59a5d9384958fae7a56b70e7b"; // Real Key

// UI Elements
const menuSection = document.getElementById('menuSection');
const calculatorSection = document.getElementById('calculatorSection');
const resultContainer = document.getElementById('result');
const calcForm = document.getElementById('calcForm');
const backButton = document.getElementById('backButton');
const mainTitle = document.getElementById('mainTitle');
const extraInputGroup = document.getElementById('extraInputGroup');

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    // Kakao Init
    try {
        if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
            Kakao.init(KAKAO_API_KEY);
        }
    } catch (e) {
        console.log("Kakao SDK not loaded or init failed");
    }

    // 메뉴 카드 클릭 이벤트
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.type;
            // Google Analytics 이벤트 전송
            if (typeof gtag === 'function') {
                gtag('event', 'select_calculator', {
                    'calculator_type': type
                });
            }
            openCalculator(type);
        });
    });

    backButton.addEventListener('click', showMenu);

    document.getElementById('resetBtn').addEventListener('click', showMenu);

    // 폼 제출
    calcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateAndShowResult();
    });
});

function openCalculator(type) {
    currentType = type;
    const config = STAT_DB[type];
    const card = document.querySelector(`.menu-card[data-type="${type}"]`);

    // 타이틀 및 라벨 설정
    document.getElementById('calcTitle').innerText = card.querySelector('h3').innerText + " 측정";
    document.getElementById('valueLabel').innerText = (type === 'health') ? "몸무게" : card.querySelector('h3').innerText;
    document.getElementById('valueUnit').innerText = (type === 'health') ? "kg" : config.unit;

    // 플레이스홀더 설정
    let placeholderMap = {
        income: "5000",
        networth: "20000",
        savings: "100",
        height: "173",
        smartphone: "4.5",
        reading: "5",
        health: "70",
        alcohol: "1.5",
        sns: "150"
    };
    document.getElementById('valueInput').placeholder = placeholderMap[type] || "0";
    document.getElementById('valueInput').value = "";
    if (document.getElementById('extraInput')) document.getElementById('extraInput').value = "";

    // 성별 필요 여부
    if (config.hasGender) {
        document.getElementById('genderGroup').classList.remove('hidden');
    } else {
        document.getElementById('genderGroup').classList.add('hidden');
    }

    // 추가 입력 필드 (예: 건강 계산기의 키 입력)
    if (config.extraInput) {
        extraInputGroup.classList.remove('hidden');
        document.getElementById('extraLabel').innerText = "키";
        document.getElementById('extraUnit').innerText = "cm";
    } else {
        extraInputGroup.classList.add('hidden');
    }

    // 헬퍼 텍스트
    let helperMap = {
        income: "* 세전 연봉(영끌 포함) 기준",
        networth: "* 부동산, 주식, 현금 포함 - 부채",
        savings: "* 매월 주식/예적금 등에 넣는 금액",
        smartphone: "* 스크린타임 일평균 사용시간",
        reading: "* 만화책 제외, 종이책/전자책 포함",
        health: "* 키와 몸무게를 통해 BMI 및 건강 순위를 추정합니다.",
        alcohol: "* 한 번 마실 때 소주 기준 몇 병?",
        sns: "* 인스타그램, 유튜브 중 가장 많은 곳 기준"
    };
    document.getElementById('helperText').innerText = helperMap[type] || "";

    // 화면 전환
    menuSection.classList.add('hidden');
    document.querySelector('.container header').classList.add('hidden');
    calculatorSection.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    // 입력 그룹 제어
    const defaultGroup = document.getElementById('valueInput').closest('.input-group');
    const big3Group = document.getElementById('big3InputGroup');
    const runningGroup = document.getElementById('runningInputGroup');

    // 리셋
    defaultGroup.classList.remove('hidden');
    big3Group.classList.add('hidden');
    runningGroup.classList.add('hidden');

    if (type === 'big3') {
        defaultGroup.classList.add('hidden');
        big3Group.classList.remove('hidden');
        // big3 관련 필드 초기화
        document.getElementById('big3_bw').value = "";
        document.getElementById('big3_bench').value = "";
        document.getElementById('big3_dead').value = "";
        document.getElementById('big3_squat').value = "";
    } else if (type === 'running') {
        defaultGroup.classList.add('hidden');
        runningGroup.classList.remove('hidden');
        // running 관련 필드 초기화
        document.getElementById('running_distance').value = "";
        document.getElementById('running_minutes').value = "";
        document.getElementById('running_seconds').value = "";
    }
}

function showMenu() {
    calculatorSection.classList.add('hidden');
    menuSection.classList.remove('hidden');
    document.querySelector('.container header').classList.remove('hidden');
    resultContainer.classList.add('hidden');
    calcForm.reset();
}

// 통계 계산 로직
function getStats(type, age, gender) {
    const config = STAT_DB[type];
    const ageGroup = Math.floor(age / 10) * 10;
    const key = (ageGroup < 20) ? 20 : (ageGroup > 60) ? 60 : ageGroup;

    if (config.hasGender) {
        return config.data[gender][key];
    }
    return config.data[key];
}

function calculateAndShowResult() {
    const age = parseInt(document.getElementById('age').value);
    let value = parseFloat(document.getElementById('valueInput').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;

    // 건강(BMI) 모드일 경우: valueInput은 몸무게, extraInput은 키
    if (currentType === 'health') {
        const height = parseFloat(document.getElementById('extraInput').value);
        const weight = value;
        if (!height || !weight) {
            alert("키와 몸무게를 모두 입력해주세요.");
            return;
        }
        // BMI = weight / (height/100)^2
        const bmi = weight / Math.pow(height / 100, 2);
        value = bmi;
    }

    // Big3 및 Running 로직
    if (currentType === 'big3') {
        const bw = parseFloat(document.getElementById('big3_bw').value);
        const bench = parseFloat(document.getElementById('big3_bench').value);
        const dead = parseFloat(document.getElementById('big3_dead').value);
        const squat = parseFloat(document.getElementById('big3_squat').value);

        if (!bw || !bench || !dead || !squat) {
            alert("모든 항목을 입력해주세요.");
            return;
        }
        value = bench + dead + squat;
    } else if (currentType === 'running') {
        const dist = parseFloat(document.getElementById('running_distance').value);
        const mins = parseFloat(document.getElementById('running_minutes').value);
        const secs = parseFloat(document.getElementById('running_seconds').value) || 0;

        if (!dist || (!mins && !secs)) {
            alert("거리와 시간을 입력해주세요.");
            return;
        }
        // 페이스 계산 (분/km)
        const totalMinutes = mins + (secs / 60);
        value = totalMinutes / dist; // Pace in min/km
    } else {
        // 기존
        if (!age || isNaN(value)) {
            alert("모든 값을 올바르게 입력해주세요.");
            return;
        }
    }

    // big3나 running은 위에서 value가 설정됨. 기존 로직의 isNaN 체크를 다시 수행 (Big3/Running은 0일수도 있으나 보통 >0)
    if (value <= 0) {
        alert("값은 0보다 커야 합니다.");
        return;
    }

    const config = STAT_DB[currentType];
    const stats = getStats(currentType, age, gender);

    if (!stats) {
        alert("해당 연령대의 데이터가 부족합니다.");
        return;
    }

    let zScore = 0;
    let percentile = 0;

    if (config.isCustomLogic && currentType === 'health') {
        // BMI: 22(표준)와의 차이 절대값
        const diff = Math.abs(value - 22);
        // 임의 로직: 차이가 0이면 상위 1%, 차이가 8점 이상이면 하위권
        percentile = (diff / 8) * 100;
        if (percentile < 1) percentile = 1;
    }
    else if (config.distribution === 'normal') {
        const sd = stats.sd;
        zScore = (value - stats.mean) / sd;
        const p = normalCDF(zScore);
        percentile = (1 - p) * 100;
    } else if (config.distribution === 'log-normal') {
        const mu = Math.log(stats.median);
        const sigma = stats.sd_log;

        if (value <= 0) {
            percentile = 100;
        } else {
            const lnVal = Math.log(value);
            zScore = (lnVal - mu) / sigma;
            const p = normalCDF(zScore);
            percentile = (1 - p) * 100;
        }
    }

    if (config.isHighBetter === false && !config.isCustomLogic) {
        percentile = 100 - percentile;
    }

    percentile = Math.max(0.1, Math.min(99.9, percentile));

    displayResult(percentile, value, stats, config);
}

function displayResult(percentile, userValue, stats, config) {
    const resultBox = document.getElementById('result');
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth' });

    animateValue('percentileValue', 0, percentile.toFixed(1), 1000);

    const barFill = document.getElementById('barFill');
    setTimeout(() => {
        barFill.style.width = (100 - percentile) + "%";
    }, 100);

    document.getElementById('resultMeta').innerText = `${Math.floor(document.getElementById('age').value / 10) * 10}대`;

    let tier = "";
    if (percentile <= 1) tier = "신계 🏆";
    else if (percentile <= 10) tier = "다이아몬드 💎";
    else if (percentile <= 30) tier = "플래티넘 ✨";
    else if (percentile <= 60) tier = "골드 🥇";
    else tier = "브론즈 🌱";

    document.getElementById('comparisonText').innerText = `당신은 ${tier} 등급입니다!`;

    let displayVal = userValue;
    if (currentType === 'health') {
        displayVal = userValue.toFixed(1);
    } else {
        displayVal = userValue.toLocaleString();
    }
    document.getElementById('userValueDisplay').innerText = `${displayVal} ${config.unit}`;

    if (config.distribution === 'normal' || config.isCustomLogic) {
        document.getElementById('averageDisplay').innerText = `${stats.mean.toLocaleString()} ${config.unit}`;
        // 정규분포는 평균=중위값으로 가정
        document.getElementById('medianDisplay').innerText = `${stats.mean.toLocaleString()} ${config.unit}`;
    } else {
        document.getElementById('averageDisplay').innerText = `${stats.mean.toLocaleString()} ${config.unit}`;
        document.getElementById('medianDisplay').innerText = `${stats.median.toLocaleString()} ${config.unit}`;
    }

    // 추가 정보 표시 (Big3 비율 등)
    if (currentType === 'big3') {
        const bw = parseFloat(document.getElementById('big3_bw').value);
        const ratio = userValue / bw;
        document.getElementById('userValueDisplay').innerText += ` (체중 ${ratio.toFixed(1)}배)`;
    } else if (currentType === 'running') {
        // Pace를 분:초로 변환
        const min = Math.floor(userValue);
        const sec = Math.round((userValue - min) * 60);
        const paceStr = `${min}'${sec.toString().padStart(2, '0')}"`;
        document.getElementById('userValueDisplay').innerText = `${paceStr} /km`; // 덮어씌움

        // 평균/중위도 포맷팅 필요할 수 있음
        if (config.distribution === 'log-normal') {
            const mMin = Math.floor(stats.mean);
            const mSec = Math.round((stats.mean - mMin) * 60);
            document.getElementById('averageDisplay').innerText = `${mMin}'${mSec.toString().padStart(2, '0')}" /km`;

            const medMin = Math.floor(stats.median);
            const medSec = Math.round((stats.median - medMin) * 60);
            document.getElementById('medianDisplay').innerText = `${medMin}'${medSec.toString().padStart(2, '0')}" /km`;
        }
    }
}

function normalCDF(x) {
    var t = 1 / (1 + .2316419 * Math.abs(x));
    var d = .3989423 * Math.exp(-x * x / 2);
    var prob = d * t * (.3193815 + t * (-.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (x > 0) prob = 1 - prob;
    return prob;
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = (progress * (end - start) + start).toFixed(1);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function shareKakao() {
    if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
        alert("카카오톡 공유 기능을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
        return;
    }

    const percentile = document.getElementById('percentileValue').innerText;
    const tierText = document.getElementById('comparisonText').innerText;

    // 현재 측정 항목 이름 및 값 가져오기
    let titleText = '대한민국 티어 측정기 결과 📊';

    if (currentType) {
        const card = document.querySelector(`.menu-card[data-type="${currentType}"]`);
        if (card) {
            const typeName = card.querySelector('h3').innerText;

            // 민감한 정보(돈) 제외하고 값 표시
            const sensitiveTypes = ['income', 'networth', 'savings'];
            if (!sensitiveTypes.includes(currentType)) {
                // 예: "나의 키 175cm 티어는? 📊"
                const userValText = document.getElementById('userValueDisplay').innerText;
                titleText = `나의 ${typeName} ${userValText} 티어는? 📊`;
            } else {
                // 예: "나의 연 소득 티어는? 📊"
                titleText = `나의 ${typeName} 티어는? 📊`;
            }
        }
    }

    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: titleText,
            description: `상위 ${percentile}% (${tierText}) \n지금 바로 확인해보세요!`,
            imageUrl:
                'https://mean-median-calculator.com/assets/icon.svg',
            link: {
                mobileWebUrl: 'https://www.mean-median-calculator.com',
                webUrl: 'https://www.mean-median-calculator.com',
            },
        },
        buttons: [
            {
                title: '결과 확인하기',
                link: {
                    mobileWebUrl: 'https://www.mean-median-calculator.com',
                    webUrl: 'https://www.mean-median-calculator.com',
                },
            },
        ],
    });
}
