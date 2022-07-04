let credit = 100

module.exports = {
    creditMinus1: () => {
        credit -= 1
    },
    resetCredit: () => {
        credit = 100
    },
    getCurrentCredit: () => {
        return credit
    }
}