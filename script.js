// 데이터베이스 (통계청/사이즈코리아 2022-2023 추정치)
// 실제 서비스 시에는 더 정밀한 DB 로딩 필요
const STAT_DB = {
    income: {
        unit: "만원(세전)",
        isHighBetter: true,
        distribution: "log-normal",
        // 연령대별 { mean: 평균, median: 중위, sd_log: 로그정규분포 표준편차(추정) }
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
        // 가계금융복지조사 2023 등 참조 (단위: 만원) - 추정치
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
        // 월 저축액 추정
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
        // 남성/여성 데이터 분리 필요
        hasGender: true,
        // 사이즈코리아
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
        isHighBetter: false, // 낮을수록 상위
        distribution: "normal",
        // 하루 평균 사용 시간
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
        isHighBetter: true, // 높을수록 상위
        distribution: "log-normal", // 편차가 큼
        // 연간 독서량
        data: {
            20: { mean: 5, median: 1, sd_log: 1.5 },
            30: { mean: 6, median: 2, sd_log: 1.5 },
            40: { mean: 7, median: 2, sd_log: 1.4 },
            50: { mean: 6, median: 1, sd_log: 1.3 },
            60: { mean: 4, median: 0, sd_log: 1.2 }
        }
    }
};

let currentType = null;

// UI Elements
const menuSection = document.getElementById('menuSection');
const calculatorSection = document.getElementById('calculatorSection');
const resultContainer = document.getElementById('result');
const calcForm = document.getElementById('calcForm');
const backButton = document.getElementById('backButton');
const mainTitle = document.getElementById('mainTitle');

// 초기화
document.addEventListener('DOMContentLoaded', () => {
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

    // 타이틀 및 라벨 설정
    document.getElementById('calcTitle').innerText = document.querySelector(`.menu-card[data-type="${type}"] h3`).innerText + " 측정";
    document.getElementById('valueLabel').innerText = document.querySelector(`.menu-card[data-type="${type}"] h3`).innerText;
    document.getElementById('valueUnit').innerText = config.unit;

    // 플레이스홀더 설정
    let placeholderMap = {
        income: "5000",
        networth: "20000",
        savings: "100",
        height: "173",
        smartphone: "4.5",
        reading: "5"
    };
    document.getElementById('valueInput').placeholder = placeholderMap[type] || "0";
    document.getElementById('valueInput').value = ""; // 초기화

    // 성별 필요 여부
    if (config.hasGender) {
        document.getElementById('genderGroup').classList.remove('hidden');
    } else {
        document.getElementById('genderGroup').classList.add('hidden');
    }

    // 헬퍼 텍스트
    let helperMap = {
        income: "* 세전 연봉(영끌 포함) 기준",
        networth: "* 부동산, 주식, 현금 포함 - 부채",
        savings: "* 매월 주식/예적금 등에 넣는 금액",
        smartphone: "* 스크린타임 일평균 사용시간",
        reading: "* 만화책 제외, 종이책/전자책 포함"
    };
    document.getElementById('helperText').innerText = helperMap[type] || "";

    // 화면 전환
    menuSection.classList.add('hidden');
    document.querySelector('.container header').classList.add('hidden'); // 헤더 숨겨서 공간 확보
    calculatorSection.classList.remove('hidden');
    resultContainer.classList.add('hidden'); // 결과창 초기화
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
    const value = parseFloat(document.getElementById('valueInput').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;

    if (!age || isNaN(value)) {
        alert("모든 값을 올바르게 입력해주세요.");
        return;
    }

    const config = STAT_DB[currentType];
    const stats = getStats(currentType, age, gender);

    if (!stats) {
        alert("해당 연령대의 데이터가 부족합니다.");
        return;
    }

    let zScore = 0;
    let percentile = 0; // 상위 % (0~100, 작을수록 상위)

    if (config.distribution === 'normal') {
        const sd = stats.sd;
        zScore = (value - stats.mean) / sd;
        const p = normalCDF(zScore);
        percentile = (1 - p) * 100; // 상위 %
    } else if (config.distribution === 'log-normal') {
        // Log-normal: ln(X) ~ N(mu, sigma^2)
        // stats.median is roughly exp(mu) -> mu = ln(median)
        // We use stored sd_log as sigma
        // z = (ln(x) - ln(median)) / sd_log

        // Median data is available
        const mu = Math.log(stats.median);
        const sigma = stats.sd_log;

        if (value <= 0) {
            percentile = 100; // 0 or negative income/assets -> bottom 
        } else {
            const lnVal = Math.log(value);
            zScore = (lnVal - mu) / sigma;
            const p = normalCDF(zScore);
            percentile = (1 - p) * 100;
        }
    }

    // Invert percentile if "Lower is Better" (e.g. smartphone usage)
    if (!config.isHighBetter) {
        percentile = 100 - percentile;
    }

    // Clamp
    percentile = Math.max(0.1, Math.min(99.9, percentile));

    // UI Update
    displayResult(percentile, value, stats, config);
}

function displayResult(percentile, userValue, stats, config) {
    const resultBox = document.getElementById('result');
    resultBox.classList.remove('hidden');

    // 스크롤 이동
    resultBox.scrollIntoView({ behavior: 'smooth' });

    // 숫자 애니메이션
    animateValue('percentileValue', 0, percentile.toFixed(1), 1000);

    // 바 차트
    const barFill = document.getElementById('barFill');
    setTimeout(() => {
        // 상위 N% -> 바의 길이는 (100 - N)% 가 되어야 "상위권(오른쪽)" 느낌을 줌
        // 하지만 여기선 "상위 1%"가 꽉 찬 게 직관적인지, "상위 1%"면 왼쪽 끝인지?
        // 디자인: "하위" --- "상위" 레이블.
        // 상위 1% = 점수 매우 높음 = 오른쪽 끝.
        // 따라서 길이는 (100 - percentile)% 가 적절.
        barFill.style.width = (100 - percentile) + "%";
    }, 100);

    // 텍스트 매핑
    document.getElementById('resultMeta').innerText = `${Math.floor(document.getElementById('age').value / 10) * 10}대`;

    // 비교 텍스트
    let tier = "";
    if (percentile <= 1) tier = "신계 🏆";
    else if (percentile <= 10) tier = "다이아몬드 💎";
    else if (percentile <= 30) tier = "플래티넘 ✨";
    else if (percentile <= 60) tier = "골드 🥇";
    else tier = "브론즈 🌱";

    // 낮을수록 좋은 경우(스마트폰 등) 텍스트 반전 필요? 
    // 로직상 percentile 수치 자체를 "상위 N%"로 맞췄으므로 티어 이름은 유지 가능.
    // 다만 스마트폰 중독 "하위 90%"보다는 "상위 10%(사용량 적음)"이 낫다.

    document.getElementById('comparisonText').innerText = `당신은 ${tier} 등급입니다!`;

    // 상세 수치
    document.getElementById('userValueDisplay').innerText = `${userValue.toLocaleString()} ${config.unit}`;

    if (config.distribution === 'normal') {
        document.getElementById('averageDisplay').innerText = `${stats.mean.toLocaleString()} ${config.unit}`;
        document.getElementById('medianDisplay').innerText = `-`; // 정규분포는 평균≒중위
    } else {
        document.getElementById('averageDisplay').innerText = `${stats.mean.toLocaleString()} ${config.unit}`;
        document.getElementById('medianDisplay').innerText = `${stats.median.toLocaleString()} ${config.unit}`;
    }
}

// 표준정규분포 누적함수 (CDF) 근사식
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
