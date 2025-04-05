/**
 * M&A AI査定サービス メインJavaScript
 * 
 * 機能:
 * - フォームステップ間の遷移
 * - フォームバリデーション
 * - 査定計算ロジック
 * - 結果表示とグラフ描画
 * - アニメーションとインタラクション
 */

$(document).ready(function() {
    // スクロールアニメーション
    initScrollAnimations();
    
    // フォームステップ遷移
    initFormSteps();
    
    // 査定計算と結果表示
    initValuationCalculation();
    
    // スムーズスクロール
    initSmoothScroll();
    
    // FAQアコーディオン（Bootstrapで自動処理されるが、追加機能があれば実装）
    
    // フォーム送信処理
    initFormSubmission();
});

/**
 * スクロールアニメーションの初期化
 */
function initScrollAnimations() {
    // セクション要素を取得
    const sections = document.querySelectorAll('.steps, .benefits, .assessment-form, .testimonials, .faq');
    
    // Intersection Observerの設定
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // ステップカードに遅延アニメーションを追加
                if (entry.target.classList.contains('steps')) {
                    const stepCards = entry.target.querySelectorAll('.step-card');
                    stepCards.forEach((card, index) => {
                        card.classList.add(`delay-${index + 1}`);
                    });
                }
                
                // ベネフィット項目に遅延アニメーションを追加
                if (entry.target.classList.contains('benefits')) {
                    const benefitItems = entry.target.querySelectorAll('.benefit-item');
                    benefitItems.forEach((item, index) => {
                        item.classList.add(`delay-${index + 1}`);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // 各セクションを監視
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * フォームステップ遷移の初期化
 */
function initFormSteps() {
    // 次へボタンのクリックイベント
$('.next-step').click(function () {
    const currentStep = $(this).closest('.form-step');
    const nextStep = currentStep.next('.form-step');
    const currentStepNumber = parseInt(currentStep.attr('id').split('-')[1]);
    const nextStepNumber = currentStepNumber + 1;

    // 現在のステップのバリデーション
    if (validateStep(currentStepNumber)) {
        // ✅ ステップ1ならメールアドレスを送信
        if (currentStepNumber === 1) {
            const earlyEmail = $('#initial-email').val();
            if (earlyEmail) {
                fetch('/api/send-proposal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // ← ✅ 正しくオブジェクトで記述
                    },
                    body: JSON.stringify({
                        email: earlyEmail
                    })
                })
                .then(res => {
                    if (res.ok) {
                        console.log('📩 ステップ1メール送信成功');
                    } else {
                        console.error('❌ ステップ1メール送信失敗');
                    }
                })
                .catch(err => console.error('❌ ステップ1メール送信エラー:', err));
            }
        }

        // 次のステップに進む
        currentStep.hide();
        nextStep.show();

        // プログレスバーの更新
        updateProgressBar(nextStepNumber);
    }
});
    
    // 戻るボタンのクリックイベント
    $('.prev-step').click(function() {
        const currentStep = $(this).closest('.form-step');
        const prevStep = currentStep.prev('.form-step');
        const currentStepNumber = parseInt(currentStep.attr('id').split('-')[1]);
        const prevStepNumber = currentStepNumber - 1;
        
        // 前のステップに戻る
        currentStep.hide();
        prevStep.show();
        
        // プログレスバーの更新
        updateProgressBar(prevStepNumber);
    });
    
    // 査定結果を見るボタンのクリックイベント
    $('.calculate-value').click(function() {
        const currentStep = $(this).closest('.form-step');
        const resultStep = $('#step-3');
        
        // ステップ2のバリデーション
        if (validateStep(2)) {
            // 査定計算を実行
            calculateValuation();
            
            // ✅ ステップ1で入力したメールアドレスをステップ3に引き継ぐ
            const earlyEmail = $('#initial-email').val();
            if (earlyEmail) {
                $('#email').val(earlyEmail);
            }

            // 結果ステップに進む
            currentStep.hide();
            resultStep.show();
            
            // プログレスバーの更新
            updateProgressBar(3);
        }
    });
    
    // もう一度査定するボタンのクリックイベント
    $('.restart-assessment').click(function() {
        // フォームをリセット
        $('#assessment-form-element')[0].reset();
        
        // 最初のステップに戻る
        $('.form-step').hide();
        $('#step-1').show();
        
        // プログレスバーの更新
        updateProgressBar(1);
    });
}

/**
 * プログレスバーの更新
 * @param {number} stepNumber - 現在のステップ番号
 */
function updateProgressBar(stepNumber) {
    // すべてのステップをリセット
    $('.progress-step').removeClass('active completed');
    
    // 現在のステップまでをアクティブ化
    for (let i = 1; i <= 3; i++) {
        const step = $(`.progress-step[data-step="${i}"]`);
        if (i < stepNumber) {
            step.addClass('completed');
        } else if (i === stepNumber) {
            step.addClass('active');
        }
    }
}

/**
 * ステップのバリデーション
 * @param {number} stepNumber - バリデーションするステップ番号
 * @returns {boolean} - バリデーション結果
 */
function validateStep(stepNumber) {
    let isValid = true;
    
    // ステップ1のバリデーション
    if (stepNumber === 1) {
        const industry = $('#industry').val();
        
        if (!industry) {
            // 業種が選択されていない場合はエラー
            $('#industry').addClass('is-invalid');
            isValid = false;
        } else {
            $('#industry').removeClass('is-invalid');
        }
    }
    
    // ステップ2のバリデーション
    else if (stepNumber === 2) {
        const sales = $('#sales').val();
        const operatingProfit = $('#operating-profit').val();
        
        if (!sales) {
            // 売上高が入力されていない場合はエラー
            $('#sales').addClass('is-invalid');
            isValid = false;
        } else {
            $('#sales').removeClass('is-invalid');
        }
        
        if (!operatingProfit) {
            // 営業利益が入力されていない場合はエラー
            $('#operating-profit').addClass('is-invalid');
            isValid = false;
        } else {
            $('#operating-profit').removeClass('is-invalid');
        }
    }
    
    return isValid;
}

/**
 * 査定計算と結果表示の初期化
 */
function initValuationCalculation() {
    // 入力フィールドの変更イベント
    $('#industry, #sales, #operating-profit, #depreciation, #total-assets, #total-liabilities').on('change input', function() {
        // リアルタイムでの計算は行わない（ボタンクリック時に計算）
    });
}

/**
 * 企業価値の計算
 * 企業価値（円） = （営業利益 + 減価償却費） × 業界別マルチプル + 時価純資産
 */
function calculateValuation() {
    // フォームから値を取得
    const industry = $('#industry').val();
    const sales = parseFloat($('#sales').val()) || 0;
    const operatingProfit = parseFloat($('#operating-profit').val()) || 0;
    const depreciation = parseFloat($('#depreciation').val()) || 0;
    const totalAssets = parseFloat($('#total-assets').val()) || 0;
    const totalLiabilities = parseFloat($('#total-liabilities').val()) || 0;
    
    // 業界別マルチプルの設定
    const industryMultiples = {
        '製造業': { min: 4, max: 6 },
        '小売業': { min: 3, max: 5 },
        '卸売業': { min: 3, max: 5 },
        'サービス業': { min: 5, max: 8 },
        'IT・通信': { min: 6, max: 10 },
        '建設業': { min: 3, max: 5 },
        '不動産業': { min: 5, max: 8 },
        '運輸・物流': { min: 4, max: 6 },
        '飲食業': { min: 3, max: 5 },
        '医療・福祉': { min: 5, max: 8 },
        'その他': { min: 4, max: 6 }
    };
    
    // 選択された業界のマルチプルを取得（デフォルト値を設定）
    const multiple = industryMultiples[industry] || { min: 4, max: 6 };
    
    // 純資産の計算
    const netAssets = totalAssets - totalLiabilities;
    
    // EBITDA（営業利益 + 減価償却費）の計算
    const ebitda = operatingProfit + depreciation;
    
    // 最小企業価値の計算
    const minValuation = Math.round((ebitda * multiple.min) + netAssets);
    
    // 最大企業価値の計算
    const maxValuation = Math.round((ebitda * multiple.max) + netAssets);
    
    // 結果を表示
    displayValuationResult(minValuation, maxValuation, industry);
}

/**
 * 査定結果の表示
 * @param {number} minValuation - 最小企業価値
 * @param {number} maxValuation - 最大企業価値
 * @param {string} industry - 業種
 */
function displayValuationResult(minValuation, maxValuation, industry) {
    // 値が負の場合は0に調整
    const minVal = Math.max(0, minValuation);
    const maxVal = Math.max(0, maxValuation);
    
    // 結果テキストの更新
    $('#valuation-min').text(minVal.toLocaleString());
    $('#valuation-max').text(maxVal.toLocaleString());
    
    // グラフの描画
    drawValuationChart(minVal, maxVal, industry);
    
    // 数値のカウントアップアニメーション
    animateCountUp('#valuation-min', minVal);
    animateCountUp('#valuation-max', maxVal);
}

/**
 * 査定結果グラフの描画
 * @param {number} minValuation - 最小企業価値
 * @param {number} maxValuation - 最大企業価値
 * @param {string} industry - 業種
 */
function drawValuationChart(minValuation, maxValuation, industry) {
    // 業界平均値（仮の値）
    const industryAverages = {
        '製造業': 50000,
        '小売業': 30000,
        '卸売業': 40000,
        'サービス業': 45000,
        'IT・通信': 70000,
        '建設業': 35000,
        '不動産業': 60000,
        '運輸・物流': 40000,
        '飲食業': 25000,
        '医療・福祉': 55000,
        'その他': 40000
    };
    
    // 選択された業界の平均値を取得（デフォルト値を設定）
    const industryAverage = industryAverages[industry] || 40000;
    
    // 平均値
    const avgValuation = (minValuation + maxValuation) / 2;
    
    // グラフのコンテキストを取得
    const ctx = document.getElementById('result-chart').getContext('2d');
    
    // 既存のグラフがあれば破棄
    if (window.valuationChart) {
        window.valuationChart.destroy();
    }
    
    // 新しいグラフを作成
    window.valuationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['あなたの企業', '業界平均'],
            datasets: [{
                label: '企業価値（万円）',
                data: [avgValuation, industryAverage],
                backgroundColor: [
                    'rgba(45, 91, 255, 0.8)',
                    'rgba(90, 107, 124, 0.5)'
                ],
                borderColor: [
                    'rgba(45, 91, 255, 1)',
                    'rgba(90, 107, 124, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '企業価値（万円）'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw.toLocaleString() + '万円';
                        }
                    }
                }
            },
            animation: {
                duration: 1500
            }
        }
    });
}

/**
 * 数値のカウントアップアニメーション
 * @param {string} selector - 対象要素のセレクタ
 * @param {number} endValue - 最終値
 */
function animateCountUp(selector, endValue) {
    const $element = $(selector);
    const duration = 1500;
    const startValue = 0;
    const increment = endValue / (duration / 16);
    
    let currentValue = startValue;
    const timer = setInterval(function() {
        currentValue += increment;
        
        if (currentValue >= endValue) {
            clearInterval(timer);
            currentValue = endValue;
        }
        
        $element.text(Math.round(currentValue).toLocaleString());
    }, 16);
}

/**
 * スムーズスクロールの初期化
 */
function initSmoothScroll() {
    // ナビゲーションリンクのクリックイベント
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        
        const target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });
}

/**
 * フォーム送信処理の初期化
 */
function initFormSubmission() {
    // フォーム送信イベント
    $('#assessment-form-element').submit(function(e) {
        e.preventDefault();
        
        // 同意チェックの確認
        if (!$('#consent').is(':checked')) {
            alert('M&A会社からの提案を受け取るには同意が必要です。');
            return;
        }
        
        const formData = {
            industry: $('#industry').val(),
            companyAge: $('#company-age').val(),
            employees: $('#employees').val(),
            location: $('#location').val(),
            sales: $('#sales').val(),
            operatingProfit: $('#operating-profit').val(),
            depreciation: $('#depreciation').val(),
            totalAssets: $('#total-assets').val(),
            totalLiabilities: $('#total-liabilities').val(),
            valuationMin: $('#valuation-min').text(),
            valuationMax: $('#valuation-max').text(),
            companyName: $('#company-name').val(),
            contactName: $('#contact-name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            consent: $('#consent').is(':checked'),
            initialEmail: $('#initial-email').val() 
        };

        // ✅ バックエンドのAPIにデータを送信（ローカル環境用）
        fetch('/api/send-proposal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: earlyEmail
            })
        })
        .then(response => {
            if (response.ok) {
                alert('ありがとうございます。提案をご希望のM&A会社から連絡があります。');
        
                // フォームをリセット
                $('#assessment-form-element')[0].reset();
                $('.form-step').hide();
                $('#step-1').show();
                updateProgressBar(1);
            } else {
                alert('送信に失敗しました。もう一度お試しください。');
            }
        })
        .catch(error => {
            console.error('送信エラー:', error);
            alert('送信時にエラーが発生しました。');
        });
    }); // ← submit の function を閉じる
} // ← initFormSubmission を閉じる
