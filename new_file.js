document.addEventListener('DOMContentLoaded', function() {
    // 系统配置
    const TOTAL_NUMBERS = 33;
    const TOTAL_PERIODS = 36;
    const ROWS = 6;
    const COLS = 6;
    
    // 状态管理
    let currentPeriod = 1;
    let selectedNumbers = new Set();
    let periodRecords = {};
    
    // DOM元素
    const selectionGrid = document.getElementById('selectionGrid');
    const periodsContainer = document.getElementById('periodsContainer');
    const currentPeriodElement = document.getElementById('currentPeriod');
    const selectedCountElement = document.getElementById('selectedCount');
    const selectedNumbersElement = document.getElementById('selectedNumbers');
    const confirmBtn = document.getElementById('confirmBtn');
    const resetBtn = document.getElementById('resetBtn');
    const newPeriodBtn = document.getElementById('newPeriodBtn');
    
    // 初始化数字选择网格 (11个数字一行，共3行)
    function initializeSelectionGrid() {
        selectionGrid.innerHTML = '';
        
        for (let i = 1; i <= TOTAL_NUMBERS; i++) {
            const numberItem = document.createElement('div');
            numberItem.className = 'eleven-row-number';
            numberItem.textContent = i;
            numberItem.dataset.number = i;
            
            numberItem.addEventListener('click', function() {
                toggleNumberSelection(i);
            });
            
            selectionGrid.appendChild(numberItem);
        }
    }
    
    // 初始化期数记录容器 (紧凑型)
    function initializePeriodsContainer() {
        periodsContainer.innerHTML = '';
        
        for (let i = 1; i <= TOTAL_PERIODS; i++) {
            const periodBox = document.createElement('div');
            periodBox.className = 'compact-period-box';
            if (i === 1) periodBox.classList.add('active');
            periodBox.id = `period-${i}`;
            
            const periodHeader = document.createElement('div');
            periodHeader.className = 'compact-period-header';
            
            const periodTitle = document.createElement('div');
            periodTitle.className = 'compact-period-title';
            periodTitle.textContent = `第${i}期`;
            
            const periodStatus = document.createElement('div');
            periodStatus.className = 'compact-period-status';
            periodStatus.textContent = '未记录';
            periodStatus.id = `period-status-${i}`;
            
            periodHeader.appendChild(periodTitle);
            periodHeader.appendChild(periodStatus);
            
            const periodGrid = document.createElement('div');
            periodGrid.className = 'compact-period-grid';
            periodGrid.id = `period-grid-${i}`;
            
            const periodEmpty = document.createElement('div');
            periodEmpty.className = 'compact-period-empty';
            periodEmpty.textContent = '暂无选择记录';
            periodGrid.appendChild(periodEmpty);
            
            periodBox.appendChild(periodHeader);
            periodBox.appendChild(periodGrid);
            
            periodsContainer.appendChild(periodBox);
            
            // 初始化期数记录
            periodRecords[i] = new Set();
        }
    }
    
    // 切换数字选择状态
    function toggleNumberSelection(number) {
        const numberElement = document.querySelector(`.eleven-row-number[data-number="${number}"]`);
        
        if (!numberElement) return;
        
        if (selectedNumbers.has(number)) {
            // 取消选择
            selectedNumbers.delete(number);
            numberElement.classList.remove('selected');
        } else {
            // 选择数字
            selectedNumbers.add(number);
            numberElement.classList.add('selected');
        }
        
        updateSelectionInfo();
    }
    
    // 更新选择信息显示
    function updateSelectionInfo() {
        selectedCountElement.textContent = selectedNumbers.size;
        
        if (selectedNumbers.size === 0) {
            selectedNumbersElement.textContent = '无';
        } else {
            const sortedNumbers = Array.from(selectedNumbers).sort((a, b) => a - b);
            selectedNumbersElement.textContent = sortedNumbers.join(', ');
        }
    }
    
    // 确认当前期数选择
    function confirmCurrentPeriod() {
        if (selectedNumbers.size === 0) {
            alert('请至少选择一个数字！');
            return;
        }
        
        // 保存当前期数选择
        periodRecords[currentPeriod] = new Set(selectedNumbers);
        
        // 更新期数显示
        updatePeriodDisplay(currentPeriod);
        
        // 更新期数状态
        const periodStatus = document.getElementById(`period-status-${currentPeriod}`);
        periodStatus.textContent = '已记录';
        periodStatus.classList.add('filled');
        
        // 为当前期数方格添加已填写样式
        const periodBox = document.getElementById(`period-${currentPeriod}`);
        periodBox.classList.add('filled');
        
        alert(`第${currentPeriod}期选择已保存！`);
    }
    
    // 更新期数显示 (6x6布局)
    function updatePeriodDisplay(period) {
        const periodGridElement = document.getElementById(`period-grid-${period}`);
        periodGridElement.innerHTML = '';
        
        const selectedSet = periodRecords[period];
        
        if (selectedSet.size === 0) {
            const periodEmpty = document.createElement('div');
            periodEmpty.className = 'compact-period-empty';
            periodEmpty.textContent = '暂无选择记录';
            periodGridElement.appendChild(periodEmpty);
            return;
        }
        
        // 创建6x6网格，只显示有数字的格子
        let cellCount = 0;
        for (let i = 1; i <= TOTAL_NUMBERS; i++) {
            const periodNumber = document.createElement('div');
            periodNumber.className = 'compact-period-number';
            periodNumber.textContent = i;
            
            if (selectedSet.has(i)) {
                periodNumber.classList.add('selected');
            }
            
            periodGridElement.appendChild(periodNumber);
            cellCount++;
            
            // 每行6个，自动换行显示
            if (cellCount % COLS === 0 && cellCount < TOTAL_NUMBERS) {
                // 网格会自动换行
            }
        }
    }
    
    // 重置当前选择
    function resetCurrentSelection() {
        // 清除所有选中的数字样式
        document.querySelectorAll('.eleven-row-number.selected').forEach(item => {
            item.classList.remove('selected');
        });
        
        // 清空选择集合
        selectedNumbers.clear();
        
        // 更新选择信息
        updateSelectionInfo();
        
        alert('当前选择已重置！');
    }
    
    // 开始下一期
    function startNextPeriod() {
        // 检查当前期数是否有未保存的选择
        if (selectedNumbers.size > 0) {
            const saveChoice = confirm(`第${currentPeriod}期还有未保存的选择，是否先保存？`);
            if (saveChoice) {
                confirmCurrentPeriod();
            }
        }
        
        // 移动到下一期
        if (currentPeriod < TOTAL_PERIODS) {
            // 移除当前期数的激活状态
            const currentPeriodBox = document.getElementById(`period-${currentPeriod}`);
            if (currentPeriodBox) {
                currentPeriodBox.classList.remove('active');
            }
            
            currentPeriod++;
            currentPeriodElement.textContent = currentPeriod;
            
            // 添加新期数的激活状态
            const newPeriodBox = document.getElementById(`period-${currentPeriod}`);
            if (newPeriodBox) {
                newPeriodBox.classList.add('active');
            }
            
            // 重置当前选择
            resetCurrentSelection();
            
            // 如果该期已有记录，加载到选择区域
            if (periodRecords[currentPeriod].size > 0) {
                // 清除当前选择
                selectedNumbers.clear();
                
                // 加载该期记录
                periodRecords[currentPeriod].forEach(number => {
                    selectedNumbers.add(number);
                    const numberElement = document.querySelector(`.eleven-row-number[data-number="${number}"]`);
                    if (numberElement) {
                        numberElement.classList.add('selected');
                    }
                });
                
                updateSelectionInfo();
                
                alert(`已加载第${currentPeriod}期的记录，您可以修改并重新保存。`);
            }
        } else {
            alert('已到达最大期数（33期）！');
        }
    }
    
    // 跳转到指定期数
    function jumpToPeriod(period) {
        if (period < 1 || period > TOTAL_PERIODS) {
            alert('期数超出范围！');
            return;
        }
        
        // 移除所有期数的激活状态
        document.querySelectorAll('.compact-period-box').forEach(box => {
            box.classList.remove('active');
        });
        
        // 设置新期数为激活状态
        currentPeriod = period;
        currentPeriodElement.textContent = currentPeriod;
        
        const newPeriodBox = document.getElementById(`period-${currentPeriod}`);
        if (newPeriodBox) {
            newPeriodBox.classList.add('active');
        }
        
        // 重置当前选择
        resetCurrentSelection();
        
        // 如果该期已有记录，加载到选择区域
        if (periodRecords[currentPeriod].size > 0) {
            periodRecords[currentPeriod].forEach(number => {
                selectedNumbers.add(number);
                const numberElement = document.querySelector(`.eleven-row-number[data-number="${number}"]`);
                if (numberElement) {
                    numberElement.classList.add('selected');
                }
            });
            
            updateSelectionInfo();
            
            alert(`已加载第${currentPeriod}期的记录，您可以修改并重新保存。`);
        }
    }
    
    // 为所有期数方格添加点击事件（用于跳转）
    function addPeriodClickEvents() {
        for (let i = 1; i <= TOTAL_PERIODS; i++) {
            const periodBox = document.getElementById(`period-${i}`);
            if (periodBox) {
                periodBox.addEventListener('click', function(e) {
                    // 防止点击期数内部元素时触发跳转
                    if (e.target.closest('.compact-period-header') || e.target.closest('.compact-period-grid')) {
                        jumpToPeriod(i);
                    }
                });
            }
        }
    }
    
    // 初始化应用
    function initializeApp() {
        initializeSelectionGrid();
        initializePeriodsContainer();
        updateSelectionInfo();
        addPeriodClickEvents();
        
        // 事件监听
        confirmBtn.addEventListener('click', confirmCurrentPeriod);
        resetBtn.addEventListener('click', resetCurrentSelection);
        newPeriodBtn.addEventListener('click', startNextPeriod);
        
        // 添加键盘快捷键支持
        document.addEventListener('keydown', function(e) {
            // Ctrl+Enter: 确认当前期数选择
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                confirmCurrentPeriod();
            }
            
            // Ctrl+R: 重置当前选择
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                resetCurrentSelection();
            }
            
            // Ctrl+N: 开始下一期
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                startNextPeriod();
            }
            
            // 数字键1-9快速选择
            if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.altKey) {
                const num = parseInt(e.key);
                if (num >= 1 && num <= 9) {
                    toggleNumberSelection(num);
                }
            }
            
            // 数字键0选择数字10
            if (e.key === '0' && !e.ctrlKey && !e.altKey) {
                toggleNumberSelection(10);
            }
        });
        
        // 示例：预选几个数字
        setTimeout(() => {
            const exampleNumbers = [1, 6, 24, 29];
            exampleNumbers.forEach(num => {
                selectedNumbers.add(num);
                const element = document.querySelector(`.eleven-row-number[data-number="${num}"]`);
                if (element) {
                    element.classList.add('selected');
                }
            });
            updateSelectionInfo();
            alert('示例：已预选数字 1, 6, 24, 29。您可以继续选择其他数字，然后点击"确认本期选择"按钮。');
        }, 500);
        
        console.log('11行数字选择记录系统已初始化！');
    }
    
    // 启动应用
    initializeApp();
});