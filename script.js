document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calcForm');
    const resultDiv = document.getElementById('result');
    const userAgeSpan = document.getElementById('userAge');
    const percentileValSpan = document.getElementById('percentileValue');
    const barFill = document.getElementById('barFill');
    const comparisonText = document.getElementById('comparisonText');
    const userIncomeDisplay = document.getElementById('userIncomeDisplay');
    const avgIncomeDisplay = document.getElementById('averageIncomeDisplay');
    const medianIncomeDisplay = document.getElementById('medianIncomeDisplay');
    const resetBtn = document.getElementById('resetBtn');

    // Stats Data (Approximate based on 2023 Statistics Korea & NTS data)
    // Mean is in Man Won (10,000 KRW)
    // Sigma is estimated to reflect inequality (higher age = higher inequality)
    const stats = {
        20: { mean: 3600, sigma: 0.55 },
        30: { mean: 4600, sigma: 0.65 },
        40: { mean: 5400, sigma: 0.75 },
        50: { mean: 5150, sigma: 0.75 },
        60: { mean: 3500, sigma: 0.80 }
    };

    function getStatsForAge(age) {
        if (age < 30) return stats[20];
        if (age < 40) return stats[30];
        if (age < 50) return stats[40];
        if (age < 60) return stats[50];
        return stats[60];
    }

    // Standard Normal CDF
    function cumulativeStdNormalProbability(z) {
        // Constants
        const b1 = 0.319381530;
        const b2 = -0.356563782;
        const b3 = 1.781477937;
        const b4 = -1.821255978;
        const b5 = 1.330274429;
        const p = 0.2316419;
        const c2 = 0.39894228;

        if (z > 6.0) { return 1.0; }
        if (z < -6.0) { return 0.0; }

        const t = 1.0 / (1.0 + p * Math.abs(z));
        const b = c2 * Math.exp(-z * z / 2.0);
        let n = ((((b5 * t + b4) * t + b3) * t + b2) * t + b1) * t;
        n = 1.0 - b * n;

        if (z < 0.0) n = 1.0 - n;
        return n;
    }

    function calculatePercentile(income, mean, sigma) {
        // Income is Log-Normal distributed
        // mu = ln(Mean) - sigma^2 / 2
        const mu = Math.log(mean) - (sigma * sigma / 2);

        // Z = (ln(X) - mu) / sigma
        // We use Math.max(income, 1) to avoid log(0) or log(negative)
        const z = (Math.log(Math.max(income, 1)) - mu) / sigma;

        return cumulativeStdNormalProbability(z);
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('ko-KR').format(Math.round(value)) + ' 만원';
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const age = parseInt(document.getElementById('age').value);
        const income = parseInt(document.getElementById('income').value.replace(/,/g, ''));

        if (!age || age < 15) {
            alert('유효한 나이를 입력해주세요 (15세 이상).');
            return;
        }
        if (isNaN(income) || income < 0) {
            alert('유효한 소득을 입력해주세요.');
            return;
        }

        // 1. Get Stats parameter
        const { mean, sigma } = getStatsForAge(age);

        // 2. Calculate Percentile (CDF gives percentile from bottom, e.g. 0.9 = Top 10%)
        const percentileFromBottom = calculatePercentile(income, mean, sigma);
        const topPercentile = (1 - percentileFromBottom) * 100;

        // 3. Calculate Median
        // Median = exp(mu) = exp(ln(mean) - sigma^2/2)
        const mu = Math.log(mean) - (sigma * sigma / 2);
        const median = Math.exp(mu);

        // 4. Update UI
        form.classList.add('hidden');
        resultDiv.classList.remove('hidden');
        userAgeSpan.textContent = Math.floor(age / 10) * 10 + '대'; // e.g., 30대

        // Animate the number
        let currentVal = 0;
        const targetVal = topPercentile;
        const duration = 1500;
        const startTime = performance.now();

        function animate(time) {
            let timeFraction = (time - startTime) / duration;
            if (timeFraction > 1) timeFraction = 1;

            // Ease out cubic
            const progress = 1 - Math.pow(1 - timeFraction, 3);
            const displayVal = (targetVal * progress).toFixed(1);

            percentileValSpan.textContent = displayVal;

            // Bar fill logic (Visual representation)
            // If top 10%, fill should be high (90%). 
            // Basically calculate CDF again
            barFill.style.width = `${percentileFromBottom * 100}%`;

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);

        // Update Text Info
        userIncomeDisplay.textContent = formatCurrency(income);
        avgIncomeDisplay.textContent = formatCurrency(mean);
        medianIncomeDisplay.textContent = formatCurrency(median);

        let comparisonMsg = '';
        if (topPercentile <= 10) {
            comparisonMsg = '대단해요! 상위 10% 안에 드시는군요.';
        } else if (topPercentile <= 30) {
            comparisonMsg = '훌륭합니다! 평균보다 훨씬 높으시네요.';
        } else if (topPercentile <= 50) {
            comparisonMsg = '평균 이상이시네요! 잘하고 계십니다.';
        } else {
            comparisonMsg = '통계적 평균과의 비교입니다. 파이팅!';
        }

        // Add specific median comparison
        const diff = income - median;
        const diffText = Math.abs(diff) < 100 ? '비슷한' :
            (Math.abs(diff) / 10000).toFixed(1) + '억원 ' + (diff > 0 ? '더 높습니다.' : '더 낮습니다.');
        const diffMsg = diff > 0 ? `중위 소득보다 약 ${formatCurrency(diff)} 더 높습니다.` : `중위 소득보다 약 ${formatCurrency(Math.abs(diff))} 차이가 납니다.`;

        comparisonText.innerHTML = `${comparisonMsg}<br><span class="median-diff">${diffMsg}</span>`;

        // Scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    resetBtn.addEventListener('click', () => {
        form.reset();
        form.classList.remove('hidden');
        resultDiv.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
