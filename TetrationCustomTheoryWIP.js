import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "my_custom_theory_id";
var name = "Tetration";
var description = "WIP Theory revolving around tetration and its inverse functions";
var authors = "Dollar Tree Physicist";
var version = 1;

var currencyRho;
var currencyBeta;
var currencyDelta
var c1, c2;
var c3, c4;
var c5, c6;
var q2;


var init = () => {
    currencyRho = theory.createCurrency();
    currencyBeta = theory.createCurrency('β', '\\beta');
    currencyDelta = theory.createCurrency('δ', '\\delta');
    

    ///////////////////
    // Regular Upgrades

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0);
        c1 = theory.createUpgrade(0, currencyRho, new FirstFreeCost(new ExponentialCost(15, Math.log2(1.5))));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
    }

    // c2
    {
        let getDesc = (level) => "c_2=2^{" + level + "}";
        let getInfo = (level) => "c_2=" + getC2(level).toString(0);
        c2 = theory.createUpgrade(1, currencyRho, new ExponentialCost(5, Math.log2(4)));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }

    // c3
    {
	let getDesc = (level) => "c_3=" + getC3(level).toString(0);
	c3 = theory.createUpgrade(2, currencyBeta, new ExponentialCost(100, Math.log2(2)));
	c3.getDescription = (_) => Utils.getMath(getDesc(c3.level));
	c3.getInfo = (amount) => Utils.getMathTo(getDesc(c3.level), getDesc(c3.level + amount));
    }

    // c4
    {
	let getDesc = (level) => "c_4=\\sqrt{6^{" + level + "}}";
        let getInfo = (level) => "c_4=" + getC4(level).toString(0);
        c4 = theory.createUpgrade(3, currencyBeta, new ExponentialCost(BigNumber.from(1e10), Math.log2(10)));
        c4.getDescription = (_) => Utils.getMath(getDesc(c4.level));
        c4.getInfo = (amount) => Utils.getMathTo(getInfo(c4.level), getInfo(c4.level + amount));
    }

    // c5
    {
	let getDesc = (level) => "c_5=" + getC5(level).toString(0);
	c5 = theory.createUpgrade(4, currencyDelta, new ExponentialCost(100, Math.log2(2)));
	c5.getDescription = (_) => Utils.getMath(getDesc(c5.level));
	c5.getInfo = (amount) => Utils.getMathTo(getDesc(c5.level), getDesc(c5.level + amount));
    }

    // c6
    {
	let getDesc = (level) => "c_6" + getC6(level).toString(0);
    }





/////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currencyRho, 1e10);
    theory.createBuyAllUpgrade(1, currencyRho, 1e13);
    theory.createAutoBuyerUpgrade(2, currencyRho, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25));


}


var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let dt_b = BigNumber.from(elapsedTime * multiplier);
    let dt_d = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    let B = dt_b;
    let T = dt_d;

    currencyRho.value += dt * BigNumber.from(GetTetration(getC3(c3.level) * getC4(c4.level), getC5(c5.level)));
    currencyBeta.value += dt_b * getC2(c2.level);
    currencyDelta.value += dt_d * getC1(c1.level) * BigNumber.from(getSLog10(currencyRho.value));
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = B \\uparrow\\uparrow T";
    return result;
}


var getSecondaryEquation = () => theory.latexSymbol + "= 10\\uparrow{0.1}slog_{10}(\\rho)";


var getSLog10 = (z) => {
	let result = BigNumber.from(0);
	result = z.depth + Math.log10(BigNumber.fromComponents(z.sign, 0, z.exponent) );
	return result;
}

var getSlog_n = (base, z) => {
	let result = BigNumber.from(0);
	result = (z.depth + Math.log10(BigNumber.fromComponents(z.sign, 0, z.exponent) ) ) / getSLog10(base);
	return result;
}

var GetTetration = (base, tet) => {
	let result = BigNumber.from(1);
	let remainder = tet - Math.floor(tet);
	if (remainder > 0) {
		let towerCap = remainder;
	}
	if (remainder <= 0) {
		let towerCap = remainder + 1;
	}
	result = base.Pow(remainder);
	while (tet > 0) {
		result = base.Pow(result);
		tet -= 1;
	}
	return result;

}


var getPublicationMultiplier = (tau) => (1);
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => BigNumber.from(10).Pow(0.1 * getSLog10(currencyRho.value) );

//var get2DGraphValue = () => currencyRho.value.sign * (BigNumber.ONE + currencyRho.value.abs()).log10().toNumber();


var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getC3 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);
var getC4 = (level) => (BigNumber.SIX.pow(0.5)).pow(0.5 * level);
var getC5 = (level) => Utils.getStepwisePowerSum(level, 2, 32, 1);



init();