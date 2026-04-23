const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz8Fyyz7bsy7SNmGZXXQgqokIEH0cxZLdW2KEWPJ0T29_XjGpgQ5osw1J7XtT694Lc_AQ/exec";

let currentStep = 1;
const totalSteps = 7;

const form = document.getElementById('applicationForm');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');
const steps = document.querySelectorAll('.form-step');
const navItems = document.querySelectorAll('.step-list li');

function updateFormSteps() {
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById(`step${currentStep}`).classList.add('active');

    navItems.forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.step) < currentStep) {
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
    });
    document.querySelector(`.step-list li[data-step="${currentStep}"]`).classList.add('active');

    prevBtn.style.display = currentStep === 1 ? 'none' : 'flex';

    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
    } else {
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }
}

// ========== 유효성 검사 (Validation) ==========
function validateCurrentStep() {
    const currentStepEl = document.getElementById(`step${currentStep}`);
    const allInputs = currentStepEl.querySelectorAll('input[type="text"], input[type="email"], input[type="number"], textarea');
    let isValid = true;
    let emptyCount = 0;

    allInputs.forEach(input => {
        // pastExperienceDetails는 '있음'을 선택한 경우에만 검증
        if (input.id === 'pastExperienceDetails') {
            const pastExpRadio = document.querySelector('input[name="pastExperience"]:checked');
            if (pastExpRadio && pastExpRadio.value === 'N') return;
        }

        if (!input.value.trim()) {
            input.classList.add('input-error');
            isValid = false;
            emptyCount++;
        } else {
            input.classList.remove('input-error');
        }
    });

    return { isValid, emptyCount };
}

// input에 값 입력 시 빨간 테두리 자동 해제
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('input-error') && e.target.value.trim()) {
        e.target.classList.remove('input-error');
    }
});

nextBtn.addEventListener('click', () => {
    const { isValid, emptyCount } = validateCurrentStep();

    if (isValid && currentStep < totalSteps) {
        currentStep++;
        updateFormSteps();
        // 부드러운 스크롤링
        document.querySelector('.main-content').scrollTo({ top: 0, behavior: 'smooth' });
    } else if (!isValid) {
        showToast(`미입력 항목이 ${emptyCount}개 있습니다. 모두 작성해야 넘어갈 수 있습니다.`);
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateFormSteps();
        document.querySelector('.main-content').scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ========== 토스트 알림 ==========
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// ========== 폼 제출 (iframe 방식 - 가장 안정적) ==========
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 마지막 단계 유효성 검사
    const { isValid, emptyCount } = validateCurrentStep();
    if (!isValid) {
        showToast(`미입력 항목이 ${emptyCount}개 있습니다. 모두 작성해야 제출할 수 있습니다.`);
        return;
    }
    
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 전송 중...';
    submitBtn.disabled = true;

    // iframe 방식으로 Google Apps Script에 직접 전송
    form.action = GOOGLE_SCRIPT_URL;
    form.target = 'hidden_iframe';
    form.method = 'POST';
    form.submit();

    // 1.5초 후 성공 모달 표시 (iframe이므로 응답을 직접 읽을 수 없음)
    setTimeout(() => {
        document.getElementById('successModal').style.display = 'flex';
        
        // 폼 속성 원복
        form.removeAttribute('action');
        form.removeAttribute('target');
        form.reset();
        currentStep = 1;
        updateFormSteps();
        submitBtn.innerHTML = '<i class="fa-solid fa-upload"></i> 양식 제출하기';
        submitBtn.disabled = false;
    }, 1500);
});

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}
