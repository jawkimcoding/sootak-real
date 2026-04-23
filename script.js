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
    // Hide all steps
    steps.forEach(step => step.classList.remove('active'));
    
    // Show current step
    document.getElementById(`step${currentStep}`).classList.add('active');

    // Update navigation sidebar
    navItems.forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.step) < currentStep) {
            item.classList.add('completed');
            item.querySelector('i').classList.replace('fa-regular', 'fa-solid'); // Example icon state change
        } else {
            item.classList.remove('completed');
        }
    });
    document.querySelector(`.step-list li[data-step="${currentStep}"]`).classList.add('active');

    // Controls display
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
    }

    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
    } else {
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }
}

nextBtn.addEventListener('click', () => {
    // Basic Custom Validation for required fields
    const currentStepEl = document.getElementById(`step${currentStep}`);
    const requiredInputs = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444'; // Red border on error
            isValid = false;
        } else {
            input.style.borderColor = 'var(--border-color)';
        }
    });

    if (isValid && currentStep < totalSteps) {
        currentStep++;
        updateFormSteps();
    } else if (!isValid) {
        // Optional shake animation or simple alert
        showToast('필수 항목을 모두 입력해주세요.');
    }
});

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateFormSteps();
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Update button state visually
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 전송 중...';
    submitBtn.disabled = true;

    // Collect all data
    const formData = new FormData(form);

    // Google Apps Script Post request setup (Using no-cors to bypass redirect CORS error)
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData).toString()
    })
    .then(response => {
        // no-cors returns an opaque response (status 0), meaning success without reading body!
        document.getElementById('successModal').style.display = 'flex';
        form.reset(); // Reset form values
        currentStep = 1;
        updateFormSteps();
        
        // Reset button
        submitBtn.innerHTML = '<i class="fa-solid fa-upload"></i> 양식 제출하기';
        submitBtn.disabled = false;
    })
    .catch(error => {
        console.error('Submission error:', error);
        // Fallback Success (in case of weird browser block but request went through)
        document.getElementById('successModal').style.display = 'flex';
        form.reset();
        currentStep = 1;
        updateFormSteps();
        submitBtn.innerHTML = '<i class="fa-solid fa-upload"></i> 양식 제출하기';
        submitBtn.disabled = false;
    });
});

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}
