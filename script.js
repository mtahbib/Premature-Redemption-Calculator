

    function calculateMaturity() {
        const months = parseInt(document.getElementById('months').value);
        const installmentSize = new Decimal(document.getElementById('installmentSize').value);
        const rate = new Decimal(document.getElementById('rate').value);

        // Validate inputs
        if (months <= 0 || installmentSize.isNegative() || rate.isNegative()) {
            alert("The value cannot be negative! Please enter a positive value.");
            return;
        }

        Decimal.set({ precision: 20 }); // Set the precision as needed

        const totalInstallments = months;
        const { maturity, totalPrincipal, totalProfit } = calculateMaturityAmount(installmentSize, rate, totalInstallments, months);
        const totalTk = new Decimal(months).times(installmentSize);

        const resultHTML = `
            <div class="mt-8">
                <p class="text-lg font-semibold">Maturity Amount: TK ${maturity.toFixed(2)}</p>
                <p class="text-lg font-semibold">Principal Amount: TK ${totalTk.toFixed(2)}</p>
                <p class="text-lg font-semibold">Total Profit: TK ${totalProfit.toFixed(2)}</p>
            </div>
        `;
        document.getElementById('result').innerHTML = resultHTML;
    }

    // total maturity amount, total principal, and total profit calculation
    function calculateMaturityAmount(installmentSize, rate, totalInstallments, months) {
        let totalPrincipal = new Decimal(0);
        let totalAccrual = new Decimal(0);
        const totalTk = new Decimal(months).times(installmentSize);

        if (months <= 12) {
            totalPrincipal = new Decimal(months).times(installmentSize);
        } else {
            for (let i = 1; i <= totalInstallments; i++) {
                totalPrincipal = totalPrincipal.plus(installmentSize);
                totalAccrual = totalAccrual.plus(totalPrincipal.times(rate).times(30).div(36000));
            }
        }

        const maturity = totalPrincipal.plus(totalAccrual);
        const totalProfit = maturity.minus(totalTk);

        return { maturity, totalPrincipal, totalProfit };
    }

