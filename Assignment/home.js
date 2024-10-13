class TargetCalculator {
    constructor(startDate, endDate, annualTarget) {
        this.start = new Date(startDate);
        this.end = new Date(endDate);
        this.annualTarget = annualTarget;
    }

    calculateDays(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let nonFridayCount = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            if (new Date(year, month, day).getDay() !== 5) {
                nonFridayCount++;
            }
        }
        return nonFridayCount;
    }

    getMonthlyWorkingDays() {
        let current = new Date(this.start);
        const totalDaysExcludingFridays = [];
        const actualWorkedDays = [];

        while (current <= this.end) {
            const year = current.getFullYear();
            const month = current.getMonth();
            const daysInMonth = this.calculateDays(year, month);

            totalDaysExcludingFridays.push(daysInMonth);

            let validDays = 0;
            for (let day = current.getDate(); day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                if (date > this.end) break;
                if (date.getDay() !== 5) {
                    validDays++;
                }
            }
            actualWorkedDays.push(validDays);

            current.setMonth(current.getMonth() + 1);
            current.setDate(1);
        }

        return { totalDaysExcludingFridays, actualWorkedDays };
    }

    calculateProportionalTargets() {
        const { actualWorkedDays } = this.getMonthlyWorkingDays();
        return actualWorkedDays.map(days => (this.annualTarget / 365) * days);
    }

    calculateTotalTarget() {
        const targets = this.calculateProportionalTargets();
        return targets.reduce((acc, val) => acc + val, 0);
    }

    run() {
        const { totalDaysExcludingFridays, actualWorkedDays } = this.getMonthlyWorkingDays();
        const monthlyTargets = this.calculateProportionalTargets();
        const totalTarget = this.calculateTotalTarget();

        return {
            totalDaysExcludingFridays,
            actualWorkedDays,
            monthlyTargets,
            totalTarget
        };
    }
}

const calculator = new TargetCalculator('2024-01-01', '2024-03-31', 5220);
console.log(calculator.run());