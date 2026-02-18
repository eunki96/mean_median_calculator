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
            60: { mean: 5500, median: 4000, sd_log: 0.9 },
            // 전체 연령
            all: { mean: 5300, median: 4200, sd_log: 0.75 }
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
            60: { mean: 55000, median: 35000, sd_log: 1.3 },
            // 전체 연령
            all: { mean: 45000, median: 30000, sd_log: 1.2 }
        }
    },
    savings: {
        unit: "만원",
        isHighBetter: true,
        distribution: "log-normal",
        ignoreAge: true,
        data: { mean: 150, median: 90, sd_log: 1.0 }
    },
    height: {
        unit: "cm",
        isHighBetter: true,
        distribution: "normal",
        hasGender: true,
        ignoreAge: true,
        data: {
            male: { mean: 172.5, sd: 5.7 },
            female: { mean: 159.6, sd: 5.2 }
        }
    },
    smartphone: {
        unit: "시간",
        isHighBetter: false,
        distribution: "normal",
        ignoreAge: true,
        data: { mean: 3.8, sd: 1.8 }
    },
    reading: {
        unit: "권/년",
        isHighBetter: true,
        distribution: "log-normal",
        ignoreAge: true,
        data: { mean: 5.5, median: 1.5, sd_log: 1.4 }
    },
    health: {
        unit: "점",
        isHighBetter: true,
        isCustomLogic: true,
        isSpecialInput: true,
        ignoreAge: true,
        hasGender: true,
        data: {
            // 점수 분포 (Inbody 점수 기준)
            male: { mean: 74, sd: 8 },
            female: { mean: 74, sd: 8 }
        }
    },
    alcohol: {
        unit: "병",
        isHighBetter: true,
        distribution: "log-normal",
        ignoreAge: true,
        data: {
            male: { mean: 1.8, median: 1.5, sd_log: 0.7 },
            female: { mean: 1.0, median: 0.8, sd_log: 0.8 }
        },
        hasGender: true
    },
    sns: {
        unit: "명",
        isHighBetter: true,
        distribution: "log-normal",
        ignoreAge: true,
        data: { mean: 170, median: 100, sd_log: 1.4 }
    },
    big3: {
        unit: "kg",
        isHighBetter: true,
        distribution: "normal",
        hasGender: true,
        isSpecialInput: true,
        ignoreAge: true,
        data: {
            male: { mean: 220, sd: 70 },
            female: { mean: 100, sd: 35 }
        }
    },
    running: {
        unit: "분/km",
        isHighBetter: false,
        distribution: "log-normal",
        hasGender: true,
        isSpecialInput: true,
        ignoreAge: true,
        data: {
            male: { mean: 7.0, median: 6.5, sd_log: 0.3 },
            female: { mean: 8.0, median: 7.5, sd_log: 0.3 }
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

    // 나이 필드 제어 (ignoreAge가 true면 숨김)
    const ageGroup = document.getElementById('age').closest('.input-group');
    if (config.ignoreAge) {
        ageGroup.classList.add('hidden');
        document.getElementById('age').removeAttribute('required');
    } else {
        ageGroup.classList.remove('hidden');
        document.getElementById('age').setAttribute('required', 'true');
        document.getElementById('age').value = ""; // 초기화
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
        health: "* 인바디 측정표에 있는 골격근량, 체지방률 입력",
        alcohol: "* 한 번 마실 때 소주 기준 몇 병?",
        sns: "* 인스타그램, 유튜브 중 가장 많은 곳 기준",
        big3: "* 3대 운동 1RM 중량 합계 (스쿼트+벤치+데드)",
        running: "* 달리기 기록 (km, 시간, 분)"
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
    const inbodyGroup = document.getElementById('inbodyInputGroup');

    // 모든 특수 그룹 숨기기 & 기본 그룹 보이기
    defaultGroup.classList.remove('hidden');
    big3Group.classList.add('hidden');
    runningGroup.classList.add('hidden');
    inbodyGroup.classList.add('hidden');

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
    } else if (type === 'health') {
        defaultGroup.classList.add('hidden');
        inbodyGroup.classList.remove('hidden');
        // inbody 초기화
        document.getElementById('inbody_height').value = "";
        document.getElementById('inbody_weight').value = "";
        document.getElementById('inbody_muscle').value = "";
        document.getElementById('inbody_fat').value = "";
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
// 통계 계산 로직
function getStats(type, age, gender) {
    const config = STAT_DB[type];

    if (config.ignoreAge) {
        if (config.hasGender) {
            return config.data[gender];
        }
        return config.data;
    }

    const ageGroup = Math.floor(age / 10) * 10;
    const key = (ageGroup < 20) ? 20 : (ageGroup > 60) ? 60 : ageGroup;

    if (config.hasGender) {
        // health(인바디) 처럼 data가 바로 객체인 경우 (나이무관)
        if (config.ignoreAge && !config.data[10] && !config.data[20]) {
            // config.data가 { male: {mean...}, female: {mean...} } 형태
            return config.data[gender];
        }
        // 기존 연령별 데이터
        return config.data[gender][key];
    }
    return config.data[key];
}

function calculateAndShowResult() {
    const age = parseInt(document.getElementById('age').value);
    let value = parseFloat(document.getElementById('valueInput').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;

    // 건강(Inbody), Big3, Running 로직 분기
    if (currentType === 'health') {
        const h = parseFloat(document.getElementById('inbody_height').value);
        const w = parseFloat(document.getElementById('inbody_weight').value);
        const m = parseFloat(document.getElementById('inbody_muscle').value); // SMM
        const f = parseFloat(document.getElementById('inbody_fat').value); // PBF

        if (!h || !w || !m || !f) {
            alert("모든 인바디 정보를 입력해주세요.");
            return;
        }

        // 인바디 점수 계산 로직
        // 기준: 남성 SMM 42%, Fat 15% | 여성 SMM 36%, Fat 23%
        const stdSMM = (gender === 'male') ? 42 : 36;
        const stdFat = (gender === 'male') ? 15 : 23;

        const mySMM = (m / w) * 100;

        // 점수 공식: 기본 74 + (내골격근% - 표준%)*1.2 - (|내체지방% - 표준%|)*0.5 ... 너무 단순화하면 안됨.
        // 인바디 공식 모방: 근육 많으면 +, 지방은 적정(표준)일때 0, 표준보다 많으면 -, 너무 적어도 약간 -?
        // 단순화: 근육은 많을수록 좋음 (+), 지방은 표준 초과 시 감점 (-)

        let score = 80 + (mySMM - stdSMM) * 1.5;

        // 지방 감점 (표준보다 많을 때만 감점, 적으면 약간 가점 주거나 0)
        if (f > stdFat) {
            score -= (f - stdFat) * 1.0;
        } else {
            // 지방이 적으면 약간의 가점 (단, 너무 적으면 건강상 안좋으므로 캡)
            score += (stdFat - f) * 0.5;
        }

        value = Math.round(score);
        if (value > 100) value = 100; // 100점 만점
    } else if (currentType === 'big3') {
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
        if (!STAT_DB[currentType].ignoreAge && (!age || isNaN(value))) {
            alert("모든 값을 올바르게 입력해주세요.");
            return;
        } else if (STAT_DB[currentType].ignoreAge && isNaN(value)) {
            alert("값을 입력해주세요.");
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
        // Inbody Score (정규분포 가정)
        // mean 74, sd 8
        const mean = stats.mean;
        const sd = stats.sd;
        zScore = (value - mean) / sd;
        const p = normalCDF(zScore);
        percentile = (1 - p) * 100;
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

    // 전체 연령 통계 계산 (Income, Networth만 해당)
    let allPercentile = null;
    let allStats = null;

    if (config.data && config.data.all) {
        allStats = config.data.all;
        let z = 0;
        if (config.distribution === 'log-normal') {
            const meanLog = Math.log(allStats.median);
            z = (Math.log(value) - meanLog) / allStats.sd_log;
        } else if (config.distribution === 'normal') {
            z = (value - allStats.mean) / allStats.sd;
        }

        allPercentile = (1 - normalCDF(z)) * 100;

        if (config.isHighBetter === false && !config.isCustomLogic) {
            allPercentile = 100 - allPercentile;
        }

        allPercentile = Math.max(0.1, Math.min(99.9, allPercentile));
    }

    displayResult(percentile, value, stats, config, allPercentile, allStats);
}

function displayResult(percentile, userValue, stats, config, allPercentile = null, allStats = null) {
    const resultBox = document.getElementById('result');
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth' });

    animateValue('percentileValue', 0, percentile.toFixed(1), 1000);

    const barFill = document.getElementById('barFill');
    setTimeout(() => {
        barFill.style.width = (100 - percentile) + "%";
    }, 100);

    let metaText = "";
    if (config.ignoreAge) {
        metaText = "전체 연령";
    } else {
        const ageVal = document.getElementById('age').value;
        if (ageVal) metaText = `${Math.floor(ageVal / 10) * 10}대`;
        else metaText = "전체 연령";
    }
    document.getElementById('resultMeta').innerText = metaText;

    let tier = "";
    if (percentile <= 1) tier = "천상계 👑";
    else if (percentile <= 5) tier = "다이아몬드 💎";
    else if (percentile <= 15) tier = "플래티넘 ✨";
    else if (percentile <= 30) tier = "골드 🥇";
    else if (percentile <= 60) tier = "실버 🥈";
    else tier = "브론즈 🌱";

    document.getElementById('comparisonText').innerText = `당신은 ${tier} 등급입니다!`;
    document.getElementById('resultTier').innerText = tier;

    // 상세 통계 표시 (나의 기록, 평균, 중위)
    const detailDiv = document.querySelector('.detail-stat');
    const unit = config.unit || "";

    // 전체 통계가 존재하면 비교 테이블 표시
    if (allStats && allPercentile !== null) {
        const myP = percentile.toFixed(1) + "%";
        const allP = allPercentile.toFixed(1) + "%";

        const myMean = Math.round(stats.mean).toLocaleString();
        const allMean = Math.round(allStats.mean).toLocaleString();

        const myMed = Math.round(stats.median || stats.mean).toLocaleString();
        const allMed = Math.round(allStats.median || allStats.mean).toLocaleString();

        detailDiv.innerHTML = `
            <div class="comparison-container">
                <div class="comp-header">
                    <span>구분</span>
                    <span>${metaText}</span>
                    <span>전체 연령</span>
                </div>
                <div class="comp-row">
                    <span class="label">상위</span>
                    <span class="highlight">${myP}</span>
                    <span class="val">${allP}</span>
                </div>
                <div class="comp-row">
                    <span class="label">평균</span>
                    <span class="val">${myMean} ${unit}</span>
                    <span class="val">${allMean} ${unit}</span>
                </div>
                 <div class="comp-row">
                    <span class="label">중위</span>
                    <span class="val">${myMed} ${unit}</span>
                    <span class="val">${allMed} ${unit}</span>
                </div>
                <div class="comp-row" style="margin-top:5px; border-top:1px dashed #e5e7eb;">
                    <span class="label">나의 기록</span>
                    <span class="val" style="grid-column: span 2; font-weight:bold; color:#4f46e5;">${userValue.toLocaleString()} ${unit}</span>
                </div>
            </div>
        `;
    } else {
        let displayVal = userValue;
        if (currentType === 'health') {
            displayVal = userValue.toFixed(1);
        } else {
            displayVal = userValue.toLocaleString();
        }

        // 기존 방식 유지 (HTML 구조 복원)
        detailDiv.innerHTML = `
            <div class="stat-row">
                <span>나의 기록</span>
                <span class="value" id="userValueDisplay">${displayVal} ${unit}</span>
            </div>
            <div class="stat-row">
                <span>평균(Mean)</span>
                <span class="value" id="averageDisplay">${Math.round(stats.mean).toLocaleString()} ${unit}</span>
            </div>
            <div class="stat-row">
                <span>중위(Median)</span>
                <span class="value" id="medianDisplay">${Math.round(stats.median || stats.mean).toLocaleString()} ${unit}</span>
            </div>
        `;
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
                title: '나도 확인하기',
                link: {
                    mobileWebUrl: 'https://www.mean-median-calculator.com',
                    webUrl: 'https://www.mean-median-calculator.com',
                },
            },
        ],
    });
}
