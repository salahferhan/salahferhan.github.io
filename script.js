/**
 * BMI Pro Calculator - Advanced Fitness Calculator
 
 */

class BMICalculator {
    constructor() {
        this.form = document.getElementById('macroForm');
        this.resultsContainer = document.getElementById('results');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this)); /**  click submit  */  
        this.addInputValidation();
        this.addAnimations();
    }

    handleSubmit(e) {
        e.preventDefault(); /**  stop l reload   */
        
        if (!this.validateForm()) {   /**  verif les info    */  
            return;
        }

        const formData = this.getFormData();
        const results = this.calculateResults(formData);  
        this.displayResults(results); /**  afich results  */ 
    }

    getFormData() {             /**  select all info filled  */
        return {
            gender: document.querySelector("input[name='gender']:checked").value,
            age: parseInt(document.getElementById("age").value),
            weight: parseFloat(document.getElementById("weight").value),
            height: parseFloat(document.getElementById("height").value),
            activity: parseFloat(document.getElementById("activity").value),
            goal: document.getElementById("goal").value
        };
    }

    validateForm() {
        const fields = ['age', 'weight', 'height', 'activity', 'goal'];
        let isValid = true;

        fields.forEach(field => {
            const element = document.getElementById(field);
            const value = element.value.trim();
            
            if (!value || (field !== 'goal' && field !== 'activity' && (isNaN(value) || value <= 0))) {
                this.showFieldError(element);
                isValid = false;
            } else {
                this.clearFieldError(element);
            }
        });

        // Validate ranges
        const age = parseInt(document.getElementById("age").value);
        const weight = parseFloat(document.getElementById("weight").value);
        const height = parseFloat(document.getElementById("height").value);

        if (age && (age < 10 || age > 100)) {
            this.showFieldError(document.getElementById("age"));
            isValid = false;
        }

        if (weight && (weight < 30 || weight > 300)) {
            this.showFieldError(document.getElementById("weight"));
            isValid = false;
        }

        if (height && (height < 120 || height > 250)) {
            this.showFieldError(document.getElementById("height"));
            isValid = false;
        }

        return isValid;
    }

    showFieldError(element) {
        element.style.borderColor = '#ff4444';
        element.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.3)';
        
        // Add shake animation
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    clearFieldError(element) {
        element.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        element.style.boxShadow = '';
    }

    calculateResults(data) {
        const { gender, age, weight, height, activity, goal } = data;

        // Calculate BMI
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (gender === "male") {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Calculate TDEE (Total Daily Energy Expenditure)
        let tdee = bmr * activity;

        // Adjust calories based on goal
        let targetCalories = tdee;
        if (goal === "lose") {
            targetCalories -= 500; // 500 calorie deficit for weight loss
        } else if (goal === "gain") {
            targetCalories += 500; // 500 calorie surplus for weight gain
        }

        // Calculate macronutrient distribution
        // Protein: 25-30% of calories (using 30% for muscle building/maintenance)
        // Fat: 20-30% of calories (using 25% for hormone production)
        // Carbs: 40-55% of calories (using 45% for energy)
        const proteinPercentage = 0.30;
        const fatPercentage = 0.25;
        const carbPercentage = 0.45;

        const proteinCalories = targetCalories * proteinPercentage;
        const fatCalories = targetCalories * fatPercentage;
        const carbCalories = targetCalories * carbPercentage;

        // Convert to grams (1g protein = 4 cal, 1g fat = 9 cal, 1g carb = 4 cal)
        const proteinGrams = Math.round(proteinCalories / 4);
        const fatGrams = Math.round(fatCalories / 9);
        const carbGrams = Math.round(carbCalories / 4);

        return {
            bmi: Math.round(bmi * 10) / 10,
            bmiStatus: this.getBMIStatus(bmi),
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            targetCalories: Math.round(targetCalories),
            protein: proteinGrams,
            fat: fatGrams,
            carbs: carbGrams,
            goal: goal
        };
    }

    getBMIStatus(bmi) {
        if (bmi < 18.5) return { status: "Insuffisance pondérale", class: "underweight" };
        if (bmi < 25) return { status: "Poids normal", class: "normal" };
        if (bmi < 30) return { status: "Surpoids", class: "overweight" };
        return { status: "Obésité", class: "obese" };
    }

    displayResults(results) {
        const goalText = {
            lose: "Perte de poids",
            maintain: "Maintien",
            gain: "Prise de masse"
        };

        this.resultsContainer.innerHTML = `
            <div class="results-header">
                <h3><i class="fas fa-chart-line"></i> Vos Résultats Personnalisés</h3>
                <div class="bmi-status ${results.bmiStatus.class}">
                    BMI: ${results.bmi} - ${results.bmiStatus.status}
                </div>
            </div>
            
            <div class="results-grid">
                <div class="result-item">
                    <div class="result-icon"><i class="fas fa-fire"></i></div>
                    <div class="result-label">Métabolisme de base</div>
                    <div class="result-value">${results.bmr} <span class="result-unit">kcal</span></div>
                </div>
                
                <div class="result-item">
                    <div class="result-icon"><i class="fas fa-bolt"></i></div>
                    <div class="result-label">Dépense énergétique</div>
                    <div class="result-value">${results.tdee} <span class="result-unit">kcal</span></div>
                </div>
                
                <div class="result-item">
                    <div class="result-icon"><i class="fas fa-target"></i></div>
                    <div class="result-label">Calories ${goalText[results.goal]}</div>
                    <div class="result-value">${results.targetCalories} <span class="result-unit">kcal</span></div>
                </div>
                
                <div class="result-item">
                    <div class="result-icon"><i class="fas fa-drumstick-bite"></i></div>
                    <div class="result-label">Protéines</div>
                    <div class="result-value">${results.protein} <span class="result-unit">g</span></div>
                </div>
                
                <div class="result-item">
                    <div class="result-icon"><i class="fas fa-seedling"></i></div>
                    <div class="result-label">Lipides</div>
                    <div class="result-value">${results.fat} <span class="result-unit">g</span></div>
                </div>
                
                <div class="result-item">
                    <div class="result-icon"><i class="fas fa-bread-slice"></i></div>
                    <div class="result-label">Glucides</div>
                    <div class="result-value">${results.carbs} <span class="result-unit">g</span></div>
                </div>
            </div>
            
            <div class="nutrition-tips">
                <h4><i class="fas fa-lightbulb"></i> Conseils Nutritionnels</h4>
                <div class="tips-grid">
                    ${this.getNutritionTips(results)}
                </div>
            </div>
        `;

        // Show results with animation
        this.resultsContainer.classList.add('show');
        this.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Add counter animations
        this.animateCounters();
    }

    getNutritionTips(results) {
        const tips = [];
        
        if (results.goal === 'lose') {
            tips.push({
                icon: 'fas fa-tint',
                title: 'Hydratation',
                text: 'Buvez 2-3L d\'eau par jour pour optimiser la perte de poids'
            });
            tips.push({
                icon: 'fas fa-clock',
                title: 'Timing',
                text: 'Mangez vos protéines à chaque repas pour maintenir la masse musculaire'
            });
        } else if (results.goal === 'gain') {
            tips.push({
                icon: 'fas fa-dumbbell',
                title: 'Entraînement',
                text: 'Combinez avec un entraînement de résistance 3-4x/semaine'
            });
            tips.push({
                icon: 'fas fa-apple-alt',
                title: 'Qualité',
                text: 'Privilégiez les aliments complets et non transformés'
            });
        } else {
            tips.push({
                icon: 'fas fa-balance-scale',
                title: 'Équilibre',
                text: 'Maintenez un équilibre entre tous les macronutriments'
            });
            tips.push({
                icon: 'fas fa-heart',
                title: 'Santé',
                text: 'Surveillez votre composition corporelle, pas seulement le poids'
            });
        }

        return tips.map(tip => `
            <div class="tip-item">
                <i class="${tip.icon}"></i>
                <div>
                    <strong>${tip.title}</strong>
                    <p>${tip.text}</p>
                </div>
            </div>
        `).join('');
    }

    animateCounters() {
        const counters = document.querySelectorAll('.result-value');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.innerHTML = counter.innerHTML.replace(/^\d+/, target);
                    clearInterval(timer);
                } else {
                    counter.innerHTML = counter.innerHTML.replace(/^\d+/, Math.floor(current));
                }
            }, 20);
        });
    }

    addInputValidation() {
        const numberInputs = document.querySelectorAll('input[type="number"]');
        
        numberInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.clearFieldError(e.target);
            });
            
            input.addEventListener('blur', (e) => {
                this.validateSingleField(e.target);
            });
        });

        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            select.addEventListener('change', (e) => {
                this.clearFieldError(e.target);
            });
        });
    }

    validateSingleField(field) {
        const value = parseFloat(field.value);
        const fieldId = field.id;
        
        if (fieldId === 'age' && (value < 10 || value > 100)) {
            this.showFieldError(field);
        } else if (fieldId === 'weight' && (value < 30 || value > 300)) {
            this.showFieldError(field);
        } else if (fieldId === 'height' && (value < 120 || value > 250)) {
            this.showFieldError(field);
        }
    }

    addAnimations() {
        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .bmi-status {
                animation: pulse 2s infinite;
            }
            
            .bmi-status.underweight { background: linear-gradient(45deg, #3498db, #2980b9); }
            .bmi-status.normal { background: linear-gradient(45deg, #27ae60, #2ecc71); }
            .bmi-status.overweight { background: linear-gradient(45deg, #f39c12, #e67e22); }
            .bmi-status.obese { background: linear-gradient(45deg, #e74c3c, #c0392b); }
            
            .nutrition-tips {
                margin-top: 2rem;
                padding: 1.5rem;
                background: rgba(255, 215, 0, 0.1);
                border-radius: 12px;
                border: 1px solid rgba(255, 215, 0, 0.2);
            }
            
            .nutrition-tips h4 {
                color: var(--gold);
                margin-bottom: 1rem;
                text-align: center;
            }
            
            .tips-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
            }
            
            .tip-item {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1rem;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .tip-item i {
                color: var(--gold);
                font-size: 1.2rem;
                margin-top: 0.2rem;
                min-width: 20px;
            }
            
            .tip-item strong {
                color: var(--text-light);
                display: block;
                margin-bottom: 0.25rem;
            }
            
            .tip-item p {
                color: var(--text-muted);
                font-size: 0.9rem;
                margin: 0;
                line-height: 1.4;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Utility functions
class Utils {
    static formatNumber(num, decimals = 0) {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BMICalculator();
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading state to form submission
    const form = document.getElementById('macroForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', () => {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>CALCUL EN COURS...</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-calculator"></i> <span>CALCULER MES MACROS</span>';
            submitBtn.disabled = false;
        }, 1000);
    });
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BMICalculator, Utils };
}
