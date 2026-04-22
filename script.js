document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('kpcForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');
    
    // Admin Setting for Google App Script URL
    let scriptUrl = localStorage.getItem('kpcScriptUrl') || "https://script.google.com/macros/s/AKfycbz_REPLACE_WITH_YOUR_WEB_APP_URL/exec";

    // Toggle Experience History
    window.toggleExperienceHistory = function(show) {
        const group = document.getElementById('experienceHistoryGroup');
        const input = document.getElementById('experienceHistory');
        if(show) {
            group.style.display = 'block';
            input.setAttribute('required', 'required');
            group.style.animation = 'fadeIn 0.3s ease';
        } else {
            group.style.display = 'none';
            input.removeAttribute('required');
            input.value = '';
        }
    };

    // Form Submit Handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if(scriptUrl.includes('REPLACE_WITH_YOUR_WEB_APP_URL')) {
            showStatus('관리자 설정오류: 구글 Apps Script Web App URL이 설정되지 않았습니다. (Shift+A를 눌러 설정해주세요)', 'error');
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Add timestamp
        data['제출일시'] = new Date().toLocaleString('ko-KR');

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>제출 중...</span>';
            statusMessage.style.display = 'none';

            // Google Apps Script usually requires a slightly different approach for CORS
            // Standard approach using fetch with 'no-cors' or sending as form data
            const searchParams = new URLSearchParams();
            for (const key in data) {
                searchParams.append(key, data[key]);
            }

            // Using fetch with no-cors because Google Scripts Web Apps redirect to HTML and causes CORS blocks in browser unless configured carefully.
            // A common workaround is a POST with Content-Type: application/x-www-form-urlencoded
            await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: searchParams.toString()
            });

            // With no-cors we can't read the exact response, so we assume success if no network error
            showStatus('성공적으로 문의가 접수되었습니다. 확인 후 신속히 연락드리겠습니다.', 'success');
            form.reset();
            window.toggleExperienceHistory(false);
            
        } catch (error) {
            console.error('Error!', error.message);
            showStatus('서버 전송 중 오류가 발생했습니다. 다시 시도해주시거나 전화로 문의바랍니다.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>문의 접수하기</span> <i class="fa-solid fa-paper-plane"></i>';
        }
    });

    function showStatus(text, type) {
        statusMessage.textContent = text;
        statusMessage.className = `status-message status-${type}`;
    }

    // --- Admin Configuration Modal ---
    const modal = document.getElementById('adminModal');
    const closeBtn = document.querySelector('.close');
    const saveBtn = document.getElementById('saveScriptUrlBtn');
    const urlInput = document.getElementById('scriptUrlInput');

    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key.toLowerCase() === 'a') {
            modal.style.display = 'block';
            urlInput.value = localStorage.getItem('kpcScriptUrl') || '';
        }
    });

    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };

    saveBtn.onclick = () => {
        const newUrl = urlInput.value.trim();
        if(newUrl) {
            localStorage.setItem('kpcScriptUrl', newUrl);
            scriptUrl = newUrl;
            alert('URL이 저장되었습니다.');
            modal.style.display = 'none';
        }
    };
});
