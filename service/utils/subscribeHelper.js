const { multiFieldsMsgToChannel, success } = require("../utils/msgTemplate");
const { monitorHelper } = require("../utils/monitorHelper")


module.exports = {
    subscribeHelper: ({ blockNumber, channel }) => {
        const id = setInterval(() => {
            monitorHelper({ block_number: blockNumber }).then(res => {
                // collect all logs
                const logs = res.map((log, i) => {
                    // collect all columns in the log
                    const msg = Object.entries(log).map(([key, value]) => `${key} : ${value} \n`).join('')
                    return {
                        name: `transfer-${log.log_index}`,
                        value: msg,
                        inline: true,
                    }
                }
                );
                multiFieldsMsgToChannel({
                    msgFields: logs,
                    channel
                });
            }).catch(err => console.log(err))
        }, 300000)
        return id
    }
}