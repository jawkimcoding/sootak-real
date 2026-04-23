const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz8Fyyz7bsy7SNmGZXXQgqokIEH0cxZLdW2KEWPJ0T29_XjGpgQ5osw1J7XtT694Lc_AQ/exec";

let currentStep = 1;
const totalSteps = 7;

const form = document.getElementById('applicationForm');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');
const steps = document.querySelectorAll('.form-step');
const navItems = document.querySelectorAll('.step-list li');

// 선택 항목 (빈칸이어도 넘어갈 수 있는 필드)
const optionalFields = ['otherInquiries', 'pastExperienceDetails'];

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

// ========== 유효성 검사 ==========
function validateCurrentStep() {
    const currentStepEl = document.getElementById(`step${currentStep}`);
    const allInputs = currentStepEl.querySelectorAll('input[type="text"], input[type="email"], input[type="number"], textarea');
    let isValid = true;
    let missingFields = [];

    allInputs.forEach(input => {
        // 선택 항목은 건너뛰기
        if (optionalFields.includes(input.id)) return;
        if (input.id === 'pastExperienceDetails') return;
        // 숨겨진 필드는 건너뛰기
        if (input.offsetParent === null) return;

        if (!input.value.trim()) {
            input.classList.add('input-error');
            isValid = false;
            // 해당 input 위에 있는 label 텍스트를 가져와서 표시
            const label = input.closest('.input-group')?.querySelector('label');
            const fieldName = label ? label.textContent : input.placeholder;
            missingFields.push(fieldName);
        } else {
            input.classList.remove('input-error');
        }
    });

    return { isValid, missingFields };
}

// input 값 입력 시 빨간 테두리 자동 해제
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('input-error') && e.target.value.trim()) {
        e.target.classList.remove('input-error');
    }
});

// ========== 다음 버튼 ==========
nextBtn.addEventListener('click', () => {
    const { isValid, missingFields } = validateCurrentStep();

    if (isValid && currentStep < totalSteps) {
        currentStep++;
        updateFormSteps();
        document.querySelector('.main-content').scrollTo({ top: 0, behavior: 'smooth' });
    } else if (!isValid) {
        const names = missingFields.join(', ');
        showToast(`[${names}] 항목을 입력해주세요.`);
    }
});

// ========== 이전 버튼 ==========
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

// ========== 제출 버튼 클릭 ==========
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const { isValid, missingFields } = validateCurrentStep();
    if (!isValid) {
        const names = missingFields.join(', ');
        showToast(`[${names}] 항목을 입력해야 제출할 수 있습니다.`);
        return;
    }
    
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 전송 중...';
    submitBtn.disabled = true;

    // iframe 방식으로 Google Apps Script에 직접 전송
    form.action = GOOGLE_SCRIPT_URL;
    form.target = 'hidden_iframe';
    form.method = 'POST';
    form.submit();

    // 1.5초 후 성공 모달 표시
    setTimeout(() => {
        document.getElementById('successModal').style.display = 'flex';
        
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
